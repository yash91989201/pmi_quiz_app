"use client";
// TYPES
import type { Editor } from "@tiptap/react";
// CUSTOM COMPONENTS
import { Toggle } from "@/components/ui/toggle";
// ICONS
import {
  Bold,
  Code,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Undo2,
} from "lucide-react";

type EditorProps = {
  editor: Editor | null;
};

export default function MenuBar({ editor }: EditorProps) {
  if (!editor) {
    return null;
  }

  return (
    <section className="flex justify-between rounded-md  border bg-transparent p-1">
      <div className="space-x-2">
        <Toggle
          size="sm"
          title="Heading 2"
          pressed={editor.isActive("heading")}
          onPressedChange={() => {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
        >
          <Heading2 className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          title="Bold"
          pressed={editor.isActive("bold")}
          onPressedChange={() => {
            editor.chain().focus().toggleBold().run();
          }}
        >
          <Bold className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          title="Italics"
          pressed={editor.isActive("italic")}
          onPressedChange={() => {
            editor.chain().focus().toggleItalic().run();
          }}
        >
          <Italic className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          title="Bullet List"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => {
            editor.chain().focus().toggleBulletList().run();
          }}
        >
          <List className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          title="Number List"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => {
            editor.chain().focus().toggleOrderedList().run();
          }}
        >
          <ListOrdered className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          title="Code Block"
          pressed={editor.isActive("codeBlock")}
          onPressedChange={() => {
            editor.chain().focus().toggleCodeBlock().run();
          }}
        >
          <Code className="size-4" />
        </Toggle>
      </div>
      <div className="space-x-2">
        <Toggle
          size="sm"
          title="Undo"
          pressed={true}
          onPressedChange={() => {
            editor.chain().focus().undo().run();
          }}
        >
          <Undo2 className="size-4" />
        </Toggle>

        <Toggle
          size="sm"
          title="Redo"
          pressed={true}
          onPressedChange={() => {
            editor.chain().focus().redo().run();
          }}
        >
          <Redo2 className="size-4" />
        </Toggle>
      </div>
    </section>
  );
}
