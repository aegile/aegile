import * as React from "react";

import { type HotkeyItem, getHotkeyMatcher, shouldFireEvent } from "./helpers";

export function useHotkeys(
  hotkeys: HotkeyItem[],
  isActive: boolean, // Flag to target specific card being hovered over
  tagsToIgnore: string[] = ["INPUT", "TEXTAREA", "SELECT"],
  triggerOnContentEditable = false,
) {
  React.useEffect(() => {
    if (!isActive) return;

    const keydownListener = (event: KeyboardEvent) => {
      for (const [
        hotkey,
        handler,
        options = { preventDefault: true },
      ] of hotkeys) {
        if (
          getHotkeyMatcher(hotkey)(event) &&
          shouldFireEvent(event, tagsToIgnore, triggerOnContentEditable)
        ) {
          if (options.preventDefault) {
            event.preventDefault();
          }

          handler(event);
        }
      }
    };

    document.documentElement.addEventListener("keydown", keydownListener);
    return () =>
      document.documentElement.removeEventListener("keydown", keydownListener);
  }, [hotkeys, tagsToIgnore, triggerOnContentEditable, isActive]);
}