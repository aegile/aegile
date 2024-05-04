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

import { useTheme } from "next-themes";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Our <Editor> component we can reuse later
export default function Editor({
  defaultBlocks,
  canEdit = true,
  showEditToggle = false,
}: {
  defaultBlocks?: Object[];
  canEdit?: boolean;
  showEditToggle?: boolean;
}) {
  const { theme, systemTheme } = useTheme();
  const [blocks, setBlocks] = React.useState<Block[]>([]);
  const [isEditable, setIsEditable] = React.useState<boolean>(false);
  // Creates a new editor instance.
  const editor: BlockNoteEditor | null = useCreateBlockNote({
    uploadFile: uploadToTmpFilesDotOrg_DEV_ONLY,
    ...(defaultBlocks
      ? {
          initialContent: defaultBlocks,
        }
      : {}),
  });
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

  return (
    <>
      {showEditToggle && (
        <div className="my-2 ml-auto flex items-center space-x-2">
          <Checkbox
            id="edit-toggle"
            onCheckedChange={() => setIsEditable((prev) => !prev)}
          />
          <Label htmlFor="edit-toggle">
            Edit mode: {isEditable ? "On" : "Off"}
          </Label>
        </div>
      )}
      <BlockNoteView
        editor={editor}
        editable={canEdit && isEditable}
        sideMenu={false}
        // theme={customTheme[theme as "light" | "dark"]}
        theme={blockNoteTheme}
        onChange={() => {
          setBlocks(editor.document);
        }}
      ></BlockNoteView>
    </>
  );
}
