import { Dimensions, PixelRatio } from 'react-native';

const { height, width } = Dimensions.get('window');

// Based on iPhone 5s's scale
const scale = width / (width < 450 ? 320 : 450);

export const RESPONSIVE = {
  /**
   * Get height in percentage as per device total height
   * @param {number} h - height percentage
   * @returns {number} - calculated height
   */
  GET_HEIGHT: (h: number): number => {
    const screenHeight = width < height ? height : width;
    return PixelRatio.roundToNearestPixel(screenHeight * (h / 100));
  },

  /**
   * Get width in percentage as per device total width
   * @param {number} w - width percentage
   * @returns {number} - calculated width
   */
  GET_WIDTH: (w: number): number => {
    const screenWidth = width < height ? width : height;
    return PixelRatio.roundToNearestPixel(screenWidth * (w / 100));
  },

  /**
   * Manage font size as per scale of device size
   * @param {number} size - font size
   * @returns {number} - calculated font size
   */
  GET_FONT_SIZE: (size: number): number => {
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  },

  /**
   * Moderately scale values for UI components like padding, margin, borderRadius, etc.
   * @param {number} size - base size
   * @param {number} factor - scaling factor (default is 0.5 for slight scaling)
   * @returns {number} - scaled size
   */
  MODERATE_SCALE: (size: number, factor: number = 0.5): number => {
    const newSize = size + (RESPONSIVE.GET_FONT_SIZE(size) - size) * factor;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  },
};
