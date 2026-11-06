import ReactNativeHapticFeedback, { HapticFeedbackTypes } from "react-native-haptic-feedback";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const triggerHaptic = (type: HapticFeedbackTypes = HapticFeedbackTypes.impactLight) => {
  ReactNativeHapticFeedback.trigger(type, options);
};

export const hapticFeedback = {
  light: () => triggerHaptic(HapticFeedbackTypes.impactLight),
  medium: () => triggerHaptic(HapticFeedbackTypes.impactMedium),
  heavy: () => triggerHaptic(HapticFeedbackTypes.impactHeavy),
  selection: () => triggerHaptic(HapticFeedbackTypes.selection),
  success: () => triggerHaptic(HapticFeedbackTypes.notificationSuccess),
  warning: () => triggerHaptic(HapticFeedbackTypes.notificationWarning),
  error: () => triggerHaptic(HapticFeedbackTypes.notificationError),
};
