import React from 'react';
import { 
  View, 
  StyleSheet, 
  ImageBackground, 
  StatusBar, 
  ViewStyle
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../utils/images';

import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, Text } from 'react-native';
import { fonts } from '../utils/fonts';

interface PremiumHeaderProps {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  height?: number;
  overlap?: number;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

const PremiumHeader: React.FC<PremiumHeaderProps> = ({ 
  children, 
  headerContent, 
  title,
  showBackButton,
  onBackPress,
  height = 160, 
  overlap = 30,
  containerStyle,
  contentStyle
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground 
        source={images.ajrakBg} 
        style={[styles.headerBg, { height }]}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(128,0,0,0.85)', 'rgba(0,0,0,0.3)']}
          style={StyleSheet.absoluteFillObject}
        />
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
          <View style={styles.headerInner}>
            <View style={styles.headerTopRow}>
              {showBackButton && (
                <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                  <Icon name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              )}
              {title && (
                <Text style={styles.headerTitle}>{title}</Text>
              )}
            </View>
            {headerContent}
          </View>
        </SafeAreaView>
      </ImageBackground>

      <View style={[styles.contentArea, { marginTop: -overlap }, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Default cream color
  },
  headerBg: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  headerSafeArea: {
    flex: 1,
  },
  headerInner: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'flex-end',
    paddingBottom: 35,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: fonts.bebasNeue.bold,
    color: 'white',
    letterSpacing: 2,
  },

  contentArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default PremiumHeader;
