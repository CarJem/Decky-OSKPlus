import { findModule } from "decky-frontend-lib";

type VirtualKeyboardClasses = Record <
  | 'Keyboard',
  string
>;

export const virtualKeyboardClasses: VirtualKeyboardClasses = findModule(
    (mod) => typeof mod === 'object' && mod?.Keyboard?.includes && mod?.Keyboard?.includes('virtualkeyboard_'),
);

type VirtualKeyboardContainerClasses = Record <
  | 'VirtualKeyboardStandaloneContainer'
  | 'VirtualKeyboardContainer'
  | 'keyboard_appear',
  string
>;

export const virtualKeyboardContainerClasses: VirtualKeyboardContainerClasses = findModule(
    (mod) => typeof mod === 'object' && mod?.VirtualKeyboardContainer?.includes('virtualkeyboardcontainer_'),
);