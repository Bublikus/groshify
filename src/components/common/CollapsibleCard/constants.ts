/**
 * Constants for CollapsibleCard component
 */

export const ANIMATION_CONSTANTS = {
  CARD_ENTER_DURATION: 0.5,
  CARD_EXIT_DURATION: 0.5,
  ICON_ROTATION_DURATION: 0.3,
  CONTENT_ANIMATION_DURATION: 0.3,
} as const;

export const INITIAL_ANIMATION_VALUES = {
  OPACITY: 0,
  Y_ENTER: 20,
  Y_EXIT: -20,
  ROTATION_CLOSED: 0,
  ROTATION_OPEN: 180,
} as const;
