"use client"; // this registers <Editor> as a Client Component
import React, { useEffect } from "react";

import {
  Block,
  BlockNoteEditor,
  PartialBlock,
  uploadToTmpFilesDotOrg_DEV_ONLY,
} from "@blocknote/core";
import {
  darkDefaultTheme,
  lightDefaultTheme,
  Theme,
  BlockNoteView,
  DragHandleButton,
  SideMenu,
  SideMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";
import { SaveIcon } from "lucide-react";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Our <Editor> component we can reuse later
export default function Editor({
  setContentCallback,
  defaultBlocks,
  editable = false,
}: {
  setContentCallback?: (content: Object[]) => void;
  defaultBlocks?: Object[];
  editable?: boolean;
}) {
  const { theme, systemTheme } = useTheme();
  // const [blocks, setBlocks] = React.useState<Block[]>([]);
  // since editing is always disabled by default, this state can track editing state too
  // const [isEditable, setIsEditable] = React.useState<boolean>(false);
  // Creates a new editor instance.
  const editor: BlockNoteEditor | null = useCreateBlockNote({
    uploadFile: uploadToTmpFilesDotOrg_DEV_ONLY,
    ...(defaultBlocks
      ? {
          initialContent: defaultBlocks,
        }
      : {}),
  });
  let initLoad = true;
  const [hasEdited, setHasEdited] = React.useState<boolean>(false);
  // Changes for dark mode
  // const darkCustomTheme = {
  //   ...darkDefaultTheme,
  //   colors: {
  //     editor: {
  //       text: "#ffffff",
  //       background: "#09090b",
  //     },
  //     menu: {
  //       text: "#ffffff",
  //       background: "#09090b",
  //     },
  //     //   sideMenu: '#ffffff',
  //     //   highlights: darkDefaultTheme.colors.highlights,
  //   },
  // } satisfies Theme;

  // const customTheme = {
  //   light: lightDefaultTheme,
  //   dark: darkCustomTheme,
  // };
  const blockNoteTheme = theme === "system" ? systemTheme : theme;

  function handleSubmit() {
    setHasEdited(false);
  }

  function handleUnsavedChanges() {
    toast.error("You have unsaved changes. Please save your work.");
  }

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasEdited) {
        event.preventDefault();
        handleUnsavedChanges();
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasEdited]);

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      sideMenu={false}
      // theme={customTheme[theme as "light" | "dark"]}
      theme={blockNoteTheme as "dark" | "light"}
      onChange={() => {
        // if (initLoad) {
        //   initLoad = false;
        //   return;
        // }
        if (editable && !hasEdited) setHasEdited(true);
        // setBlocks(editor.document);
        if (editable && setContentCallback) {
          setContentCallback(editor.document);
        }
      }}
    ></BlockNoteView>
  );
}
