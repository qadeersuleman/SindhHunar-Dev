import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import Header from '../../components/layout/Header';
import { fonts } from '../../utils/fonts';
import { TextInput as PaperInput, Button as PaperButton, Chip, Switch, Portal, Modal as PaperModal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabase/client';
import { SINDHI_CATEGORIES } from '../../services/supabase/sindhi-crafts';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { decode } from 'base64-arraybuffer';

const AddProductScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [inStock, setInStock] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Image states
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const categories = Object.values(SINDHI_CATEGORIES);

  const handlePickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (result.assets?.[0]?.uri) {
      setLocalImageUri(result.assets[0].uri);
    }
  };

  const uploadProductImage = async (productId: string, uri: string) => {
    const ext = uri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const fileName = `${user?.id}/${productId}.${ext}`;
    const cleanUri = uri.replace('file://', '');
    
    const base64Str = await RNFS.readFile(cleanUri, 'base64');
    const arrayBuffer = decode(base64Str);
    const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;

    const { error } = await supabase.storage
      .from('products')
      .upload(fileName, arrayBuffer, { upsert: true, contentType: mimeType });

    if (error) throw error;

    const { data } = supabase.storage.from('products').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleAddProduct = async () => {
    if (!name || !price || !category) {
      Alert.alert('Missing Info', 'Please fill in product name, price, and category.');
      return;
    }
    
    if (!localImageUri) {
      Alert.alert('Missing Image', 'Please upload an image for your product.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price greater than 0.');
      return;
    }

    setLoading(true);
    try {
      // 0. Fetch the artisan record for this user to get the correct artisan_id
      const { data: artisanData, error: artisanError } = await supabase
        .from('artisans')
        .select('id')
        .eq('owner_id', user?.id)
        .single();

      if (artisanError || !artisanData) {
        throw new Error('Artisan profile not found. Please complete your artisan profile first.');
      }

      const actualArtisanId = artisanData.id;

      // 1. Insert product row without image first to get the ID
      const { data: productData, error: insertError } = await supabase
        .from('products')
        .insert({
          name,
          price: priceNum,
          category,
          description: description || null,
          is_available: inStock,
          artisan_id: actualArtisanId,
          rating: 5,
          images: [], // Initialize with empty array
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // 2. Upload image
      let publicImageUrl = '';
      if (localImageUri) {
        publicImageUrl = await uploadProductImage(productData.id, localImageUri);
      }

      // 3. Update product with image URL
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: [publicImageUrl] })
        .eq('id', productData.id);

      if (updateError) throw updateError;

      Alert.alert('Success', 'Your product has been added to the marketplace!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-[#FAF9F6]">
      <Header
        title="Add New Product"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView className="flex-1 px-5 py-6" showsVerticalScrollIndicator={false}>
        
        {/* Image Picker */}
        <View className="items-center mb-6">
          <TouchableOpacity 
            onPress={handlePickImage}
            className="w-full h-48 bg-white rounded-3xl border-2 border-dashed border-[#C5A059] justify-center items-center overflow-hidden"
          >
            {localImageUri ? (
              <Image source={{ uri: localImageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <>
                <View className="w-14 h-14 rounded-full bg-[#800000]/10 justify-center items-center mb-2">
                  <Icon name="image-outline" size={30} color="#800000" />
                </View>
                <Text className="text-[16px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }}>Upload Product Image</Text>
                <Text className="text-[12px] text-gray-500 mt-1" style={{ fontFamily: fonts.poppins.regular }}>Tap to select from gallery</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View className="gap-5 mb-10">
          <PaperInput
            label="Product Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            placeholder="e.g. Handmade Sindhi Topi"
            outlineColor="#E5E7EB"
            activeOutlineColor="#800000"
            style={{ backgroundColor: 'white', height: 56, fontFamily: fonts.poppins.regular }}
            theme={{ roundness: 16 }}
          />
          
          <PaperInput
            label="Price (Rs)"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            mode="outlined"
            placeholder="0"
            left={<PaperInput.Affix text="Rs" />}
            outlineColor="#E5E7EB"
            activeOutlineColor="#800000"
            style={{ backgroundColor: 'white', height: 56, fontFamily: fonts.poppins.regular }}
            theme={{ roundness: 16 }}
          />
          
          <View>
            <Text className="text-[16px] text-[#1A1A1A] mb-3" style={{ fontFamily: fonts.poppins.bold }}>Category</Text>
            <View className="flex-row flex-wrap gap-2">
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  selected={category === cat}
                  onPress={() => setCategory(cat)}
                  selectedColor="white"
                  style={{ 
                    backgroundColor: category === cat ? '#800000' : 'white',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: category === cat ? '#800000' : '#E5E7EB'
                  }}
                  textStyle={{ 
                    fontFamily: fonts.poppins.medium,
                    color: category === cat ? 'white' : '#666'
                  }}
                >
                  {cat}
                </Chip>
              ))}
            </View>
          </View>
          
          <PaperInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            placeholder="Describe your product's material, craft, etc."
            multiline
            numberOfLines={4}
            outlineColor="#E5E7EB"
            activeOutlineColor="#800000"
            style={{ backgroundColor: 'white', fontFamily: fonts.poppins.regular }}
            theme={{ roundness: 16 }}
          />
          
          <View className="flex-row items-center justify-between bg-white p-4 rounded-2xl border border-[#E5E7EB]">
            <View>
              <Text className="text-[16px] text-[#1A1A1A]" style={{ fontFamily: fonts.poppins.bold }}>Availability</Text>
              <Text className="text-[12px] text-[#757575]" style={{ fontFamily: fonts.poppins.regular }}>{inStock ? 'In Stock (Visible to buyers)' : 'Out of Stock (Hidden)'}</Text>
            </View>
            <Switch
              value={inStock}
              onValueChange={setInStock}
              color="#800000"
            />
          </View>
          
          <PaperButton
            mode="contained"
            onPress={handleAddProduct}
            loading={loading}
            className="rounded-2xl py-2 mt-4"
            buttonColor="#800000"
            labelStyle={{ fontFamily: fonts.poppins.bold, fontSize: 18 }}
          >
            Add Product
          </PaperButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProductScreen;
