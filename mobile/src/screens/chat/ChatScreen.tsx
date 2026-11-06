import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
  Dimensions,
} from 'react-native';
import Animated, { 
  FadeInRight, 
  FadeInLeft, 
  FadeIn,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Layout,
  useSharedValue,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { fonts } from '../../utils/fonts';
import PremiumHeader from '../../components/PremiumHeader';
import { generateAIResponse, ChatMessage as AIChatMessage } from '../../services/api/aiService';
import Tts from 'react-native-tts';
import { PermissionsAndroid, Alert } from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#800000',
  secondary: '#C5A059',
  white: '#FFFFFF',
  bg: '#FAF9F6',
  dark: '#1A1A1A',
  gray: '#757575',
  lightGray: '#F0F0F0',
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'artisan';
  timestamp: Date;
  isTyping?: boolean;
  isAudio?: boolean;
  audioPath?: string;
}

const TypingIndicator = () => {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const animate = (val: any, delay: number) => {
      val.value = withDelay(delay, withRepeat(
        withSequence(
          withTiming(-5, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        true
      ));
    };
    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
  }, []);

  const s1 = useAnimatedStyle(() => ({ transform: [{ translateY: dot1.value }] }));
  const s2 = useAnimatedStyle(() => ({ transform: [{ translateY: dot2.value }] }));
  const s3 = useAnimatedStyle(() => ({ transform: [{ translateY: dot3.value }] }));

  return (
    <View style={styles.typingContainer}>
      <Animated.View style={[styles.dot, s1]} />
      <Animated.View style={[styles.dot, s2]} />
      <Animated.View style={[styles.dot, s3]} />
    </View>
  );
};

const ChatScreen: React.FC<any> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'sd';
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: isRTL ? 'خوش آمديد! مان توهان جي ڪيئن مدد ڪري سگهان ٿو؟' : 'Khush Amdeed! How can I help you today?',
      sender: 'artisan',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00');
  const flatListRef = useRef<any>(null);
  const recordTimerRef = useRef<any>(null);
  const recordSecondsRef = useRef<number>(0);

  useEffect(() => {
    // TTS Setup
    Tts.getInitStatus().then(() => {
      Tts.setDefaultLanguage(i18n.language === 'sd' ? 'sd-PK' : 'en-US');
    });

    return () => {
      Tts.stop();
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
      }
    };
  }, []);

  const handleSpeech = (text: string) => {
    Tts.stop();
    Tts.speak(text);
  };

  const typeWriter = (fullText: string) => {
    let currentText = '';
    let index = 0;
    const msgId = (Date.now() + 1).toString();
    
    setMessages(prev => [...prev, {
      id: msgId,
      text: '',
      sender: 'artisan',
      timestamp: new Date()
    }]);

    const interval = setInterval(() => {
      if (index < fullText.length) {
        currentText += fullText[index];
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: currentText } : m));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    Keyboard.dismiss();
    
    // Prepare history for AI
    const history: AIChatMessage[] = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    setIsTyping(true);
    try {
      const aiResponse = await generateAIResponse(userText, history, i18n.language);
      setIsTyping(false);
      typeWriter(aiResponse);
      
      // Auto-speak AI response if user just used voice? Or maybe just provide a button.
      // For now, let's just provide the button.
    } catch (error) {
      setIsTyping(false);
      const errorMsg = isRTL 
        ? 'معاف ڪجو، ڪجهه غلط ٿي ويو.' 
        : 'Sorry, something went wrong. Please try again.';
      typeWriter(errorMsg);
    }
  };

  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (
          grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else {
          Alert.alert('Permissions Required', 'Please allow microphone access to record audio.');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const onStartRecord = async () => {
    const hasPermission = await checkPermissions();
    if (!hasPermission) return;

    setIsRecording(true);
    recordSecondsRef.current = 0;
    setRecordTime('00:00');
    recordTimerRef.current = setInterval(() => {
      recordSecondsRef.current += 1;
      const mins = Math.floor(recordSecondsRef.current / 60).toString().padStart(2, '0');
      const secs = (recordSecondsRef.current % 60).toString().padStart(2, '0');
      setRecordTime(`${mins}:${secs}`);
    }, 1000);
  };

  const onStopRecord = async () => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordTime('00:00');
    
    // In a real app, you'd send the audio file to a transcription service.
    // For this demo, since we want "WhatsApp style", let's simulate transcription 
    // or tell the user we're processing their voice.
    
    // Let's add the audio message to the list
    const audioMsg: Message = {
      id: Date.now().toString(),
      text: isRTL ? '🎤 آڊيو پيغام' : '🎤 Audio Message',
      sender: 'user',
      timestamp: new Date(),
      isAudio: true,
      audioPath: ''
    };
    setMessages(prev => [...prev, audioMsg]);
    
    // Simulate AI response for the voice
    setIsTyping(true);
    setTimeout(async () => {
        try {
            const aiResponse = await generateAIResponse("The user sent a voice message. Please respond briefly as a Sindhi artisan.", messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            })), i18n.language);
            setIsTyping(false);
            typeWriter(aiResponse);
        } catch (e) {
            setIsTyping(false);
        }
    }, 1000);
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    
    return (
      <Animated.View 
        entering={isUser ? FadeInRight.springify() : FadeInLeft.springify()}
        style={[
          styles.messageWrapper,
          { alignSelf: isUser ? 'flex-end' : 'flex-start' }
        ]}
      >
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.artisanBubble,
          { 
            borderBottomRightRadius: isUser ? 2 : 20,
            borderBottomLeftRadius: isUser ? 20 : 2,
            marginLeft: isUser ? 50 : 0,
            marginRight: isUser ? 0 : 50,
          }
        ]}>
          <Text style={[
            styles.messageText,
            { color: isUser ? 'white' : COLORS.dark, textAlign: isRTL ? 'right' : 'left' }
          ]}>
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            {!isUser && (
              <TouchableOpacity onPress={() => handleSpeech(item.text)} style={styles.speakerIcon}>
                <Icon name="volume-medium-outline" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            )}
            <Text style={[
              styles.timestamp,
              { color: isUser ? 'rgba(255,255,255,0.7)' : COLORS.gray }
            ]}>
              {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {isUser && <Icon name="checkmark-done" size={14} color="rgba(255,255,255,0.8)" style={{ marginLeft: 4 }} />}
          </View>
        </View>
      </Animated.View>
    );
  };

  const HeaderContent = () => (
    <View style={styles.headerTopRow}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconButton}>
        <Icon name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color="white" />
      </TouchableOpacity>
      
      <View style={styles.headerProfile}>
        <View style={styles.avatarGlow}>
          <Image 
            source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artisan' }} 
            style={styles.headerAvatar}
          />
          <View style={styles.onlineStatus} />
        </View>
        <View style={{ marginLeft: 12, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          <Text style={styles.headerName}>{isRTL ? 'سنڌي ڪاريگر' : 'Sindhi Artisan'}</Text>
          <Text style={styles.headerSubtext}>{isRTL ? 'توهان جي خدمت ۾ حاضر' : 'At your service'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.headerIconButton}>
        <Icon name="ellipsis-vertical" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <PremiumHeader 
      headerContent={<HeaderContent />}
      height={160}
      overlap={30}
    >
      <Animated.FlatList

        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        itemLayoutAnimation={Layout.springify()}
        ListFooterComponent={() => isTyping ? (
          <Animated.View entering={FadeIn.duration(300)} style={styles.typingWrapper}>
            <View style={styles.artisanBubble}>
              <TypingIndicator />
            </View>
          </Animated.View>
        ) : null}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputBar}>
            <TouchableOpacity 
              onPressIn={onStartRecord}
              onPressOut={onStopRecord}
              style={styles.inputAction}
            >
              <Icon name={isRecording ? "mic" : "mic-outline"} size={24} color={isRecording ? COLORS.primary : COLORS.gray} />
            </TouchableOpacity>

            <TextInput
              style={[styles.textInput, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={isRecording ? `${t('Recording')}... ${recordTime}` : (isRTL ? 'پيغام لکو...' : 'Type a message...')}
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
              editable={!isRecording}
            />
            
            <TouchableOpacity 
              onPress={handleSend}
              disabled={!inputText.trim() || isRecording}
              style={styles.sendButtonContainer}
            >
              <LinearGradient
                colors={inputText.trim() ? [COLORS.primary, '#4A0000'] : ['#DDD', '#CCC']}
                style={styles.sendButton}
              >
                <Icon name="send" size={18} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </PremiumHeader>
  );
};

const styles = StyleSheet.create({
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  avatarGlow: {
    padding: 2,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    position: 'relative',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  headerName: {
    fontSize: 16,
    fontFamily: fonts.poppins.bold,
    color: 'white',
  },
  headerSubtext: {
    fontSize: 11,
    fontFamily: fonts.poppins.regular,
    color: 'rgba(255,255,255,0.8)',
  },
  listContent: {
    padding: 20,
    paddingTop: 45,
    paddingBottom: 20,
  },
  messageWrapper: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
  },
  artisanBubble: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.1)',
  },
  messageText: {
    fontSize: 14,
    fontFamily: fonts.poppins.regular,
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  speakerIcon: {
    marginRight: 8,
    padding: 2,
  },
  timestamp: {
    fontSize: 10,
    fontFamily: fonts.poppins.regular,
  },
  typingWrapper: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    width: 40,
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.secondary,
    marginHorizontal: 2,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    paddingHorizontal: 12,
    minHeight: 50,
  },
  inputAction: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontFamily: fonts.poppins.regular,
    fontSize: 14,
    color: COLORS.dark,
    paddingHorizontal: 10,
    maxHeight: 100,
  },
  sendButtonContainer: {
    marginLeft: 5,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
