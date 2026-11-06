// font.ts

export const fonts = {
  // Bebas Neue Family
  bebasNeue: {
    regular: 'BebasNeue-Regular',
    bold: 'BebasNeue-Bold',


















































    
  },

  // Poppins Family
  poppins: {
    thin: 'Poppins-Thin',
    thinItalic: 'Poppins-ThinItalic',
    extraLight: 'Poppins-ExtraLight',
    extraLightItalic: 'Poppins-ExtraLightItalic',
    light: 'Poppins-Light',
    lightItalic: 'Poppins-LightItalic',
    regular: 'Poppins-Regular',
    italic: 'Poppins-Italic',
    medium: 'Poppins-Medium',
    mediumItalic: 'Poppins-MediumItalic',
    semiBold: 'Poppins-SemiBold',
    semiBoldItalic: 'Poppins-SemiBoldItalic',
    bold: 'Poppins-Bold',
    boldItalic: 'Poppins-BoldItalic',
    extraBold: 'Poppins-ExtraBold',
    extraBoldItalic: 'Poppins-ExtraBoldItalic',
    black: 'Poppins-Black',
    blackItalic: 'Poppins-BlackItalic',
  },
};

// Optional: Create font weight mappings for easier use
export const fontWeights = {
  thin: '100',
  extraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
} as const;

// Optional: Create typography presets
export const typography = {
  // Headings with Bebas Neue
  h1: {
    fontFamily: fonts.bebasNeue.bold,
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: fonts.bebasNeue.bold,
    fontSize: 28,
    lineHeight: 36,
  },
  h3: {
    fontFamily: fonts.bebasNeue.regular,
    fontSize: 24,
    lineHeight: 32,
  },
  h4: {
    fontFamily: fonts.bebasNeue.regular,
    fontSize: 20,
    lineHeight: 28,
  },
  h5: {
    fontFamily: fonts.bebasNeue.regular,
    fontSize: 18,
    lineHeight: 24,
  },
  h6: {
    fontFamily: fonts.bebasNeue.regular,
    fontSize: 16,
    lineHeight: 22,
  },

  // Body text with Poppins
  body1: {
    fontFamily: fonts.poppins.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontFamily: fonts.poppins.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  body3: {
    fontFamily: fonts.poppins.regular,
    fontSize: 12,
    lineHeight: 18,
  },

  // Button text
  buttonLarge: {
    fontFamily: fonts.poppins.semiBold,
    fontSize: 18,
    lineHeight: 26,
  },
  buttonMedium: {
    fontFamily: fonts.poppins.semiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  buttonSmall: {
    fontFamily: fonts.poppins.medium,
    fontSize: 14,
    lineHeight: 20,
  },

  // Captions and labels
  caption: {
    fontFamily: fonts.poppins.light,
    fontSize: 12,
    lineHeight: 16,
  },
  overline: {
    fontFamily: fonts.poppins.medium,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.5,
  },
} as const;

// Helper function to get font styles
type Fonts = typeof fonts;

export const getFontStyle = <F extends keyof Fonts, W extends keyof Fonts[F]>(
  family: F,
  weight: W,
  size?: number,
) => {
  return {
    fontFamily: fonts[family][weight],
    ...(size && { fontSize: size }),
  };
};