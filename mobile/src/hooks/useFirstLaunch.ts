import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SPLASH_SEEN_KEY = '@sindhhunar:has_seen_splash';

/**
 * Checks AsyncStorage on mount to determine if the custom SplashScreen
 * has already been shown in a previous session.
 *
 * - On FIRST INSTALL: key is null  → isFirstLaunch = true
 * - On every subsequent launch:    → isFirstLaunch = false
 *
 * Call `markSplashSeen()` after the splash animation completes
 * to permanently mark the flag in AsyncStorage.
 */
export const useFirstLaunch = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem(SPLASH_SEEN_KEY);
        // null means the key was never set → first install
        setIsFirstLaunch(value === null);
      } catch (error) {
        console.warn('[useFirstLaunch] AsyncStorage read error:', error);
        // If we can't read, treat as NOT first launch to be safe
        setIsFirstLaunch(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkFirstLaunch();
  }, []);

  const markSplashSeen = async () => {
    try {
      await AsyncStorage.setItem(SPLASH_SEEN_KEY, 'true');
      setIsFirstLaunch(false);
    } catch (error) {
      console.warn('[useFirstLaunch] AsyncStorage write error:', error);
    }
  };

  return { isFirstLaunch, isChecking, markSplashSeen };
};
