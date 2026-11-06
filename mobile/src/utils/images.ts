// Image Constants for Sindh Hunar App

export interface ImageAssets {
  // Logo and Branding
  logo: any;
  logoWhite: any;
  appIcon: any;
  
  // Onboarding Images
  onboarding1: any;
  onboarding2: any;
  onboarding3: any;
  
  // Placeholder Images
  productPlaceholder: any;
  profilePlaceholder: any;
  categoryPlaceholder: any;
  
  // Ajrak Pattern Images
  ajrakPattern1: any;
  ajrakPattern2: any;
  ajrakPattern3: any;
  
  // Icon Images
  cartIcon: any;
  searchIcon: any;
  heartIcon: any;
  userIcon: any;
  
  // Background Images
  backgroundPattern: any;
  splashBackground: any;
  ajrakBg: any;
  background: any;
  cardbg: any;

  // Product Images
  ajrak: any;
  rili: any;
  topi: any;
  peda: any;
  dress: any;
  sindhiFemaleDress: any;
  bags: any;
  book: any;
  keychain: any;
  peraJpg: any;
  sindhiTopi: any;
  sindhiQuilt: any;
}

export const images: ImageAssets = {
  // Logo and Branding
  logo: require('../assets/images/logo.png'),
  logoWhite: require('../assets/images/logo.png'), 
  appIcon: require('../assets/images/logo.png'),
  
  // Onboarding Images
  onboarding1: require('../assets/images/logo.png'),
  onboarding2: require('../assets/images/logo.png'),
  onboarding3: require('../assets/images/logo.png'),
  
  // Placeholder Images
  productPlaceholder: require('../assets/images/logo.png'),
  profilePlaceholder: require('../assets/images/logo.png'),
  categoryPlaceholder: require('../assets/images/logo.png'),
  
  // Ajrak Pattern Images
  ajrakPattern1: require('../assets/images/AjrakBG.jpg'),
  ajrakPattern2: require('../assets/images/logo.png'),
  ajrakPattern3: require('../assets/images/logo.png'),
  
  // Icon Images
  cartIcon: require('../assets/images/logo.png'),
  searchIcon: require('../assets/images/logo.png'),
  heartIcon: require('../assets/images/logo.png'),
  userIcon: require('../assets/images/logo.png'),
  
  // Background Images
  backgroundPattern: require('../assets/images/logo.png'),
  splashBackground: require('../assets/images/logo.png'),
  // Background & Pattern Images
  ajrakBg: require('../assets/images/AjrakBG.jpg'),
  background: require('../assets/images/background.jpg'),
  cardbg: require('../assets/images/cardBg.jpg'),

  // Product Images (Cloud Fallbacks)
  ajrak: require('../assets/images/AjrakBG.jpg'),
  rili: require('../assets/images/AjrakBG.jpg'),
  topi: require('../assets/images/AjrakBG.jpg'),
  peda: require('../assets/images/cardBg.jpg'),
  dress: require('../assets/images/AjrakBG.jpg'),
  sindhiFemaleDress: require('../assets/images/AjrakBG.jpg'),
  bags: require('../assets/images/cardBg.jpg'),
  book: require('../assets/images/cardBg.jpg'),
  keychain: require('../assets/images/cardBg.jpg'),
  peraJpg: require('../assets/images/cardBg.jpg'),
  sindhiTopi: require('../assets/images/AjrakBG.jpg'),
  sindhiQuilt: require('../assets/images/AjrakBG.jpg'),
};

// Helper function to get image source with fallback
export const getImageSource = (imagePath: any, fallback?: any) => {
  try {
    return imagePath || fallback || images.productPlaceholder;
  } catch (error) {
    console.warn('Image not found, using fallback:', error);
    return fallback || images.productPlaceholder;
  }
};

// Image dimensions constants
export const IMAGE_DIMENSIONS = {
  THUMBNAIL: { width: 60, height: 60 },
  SMALL: { width: 120, height: 120 },
  MEDIUM: { width: 200, height: 200 },
  LARGE: { width: 300, height: 300 },
  FULL: { width: '100%', height: '100%' },
} as const;
