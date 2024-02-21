'use client'; // this registers <Editor> as a Client Component
import {
  BlockNoteEditor,
  uploadToTmpFilesDotOrg_DEV_ONLY,
} from '@blocknote/core';
import {
  BlockNoteView,
  darkDefaultTheme,
  lightDefaultTheme,
  Theme,
  useBlockNote,
} from '@blocknote/react';
import '@blocknote/react/style.css';

import { useTheme } from 'next-themes';

// Our <Editor> component we can reuse later
export default function Editor() {
  const { theme, setTheme } = useTheme();
  // Creates a new editor instance.
  const editor: BlockNoteEditor | null = useBlockNote({
    uploadFile: uploadToTmpFilesDotOrg_DEV_ONLY,
  });
  // Changes for dark mode
  const darkCustomTheme = {
    ...darkDefaultTheme,
    colors: {
      ...darkDefaultTheme.colors,
      editor: {
        text: '#ffffff',
        background: '#09090b',
      },
      menu: {
        text: '#ffffff',
        background: '#09090b',
      },
      //   sideMenu: '#ffffff',
      //   highlights: darkDefaultTheme.colors.highlights,
    },
  } satisfies Theme;

  const customTheme = {
    light: lightDefaultTheme,
    dark: darkCustomTheme,
  };

  //   const blockNoteTheme = theme === 'dark' ? 'dark' : 'light';
  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      theme={customTheme[theme as 'light' | 'dark']}
    />
  );
}
