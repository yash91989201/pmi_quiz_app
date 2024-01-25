"use client";
import "@/styles/tiptap.css";
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";
import Heading from "@tiptap/extension-heading";
import { common, createLowlight } from "lowlight";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
// CUSTOM COMPONENTS
import MenuBar from "@/components/admin/quizzes/MenuBar";

const lowlight = createLowlight(common);
lowlight.register({ html });
lowlight.register({ css });
lowlight.register({ js });
lowlight.register({ ts });

const extensions = [
  StarterKit.configure({
    heading: false,
    codeBlock: false,
    bulletList: false,
    orderedList: false,
  }),
  Heading.configure({
    HTMLAttributes: {
      class: "text-lg font-bold",
      levels: [2],
    },
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: "list-disc",
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: "list-decimal",
    },
  }),
];

export default function TipTap({
  text,
  onChange,
}: {
  text: string;
  onChange: (richText: string) => void;
}) {
  const editor = useEditor({
    extensions,
    content: text,
    editorProps: {
      attributes: {
        class:
          "min-h-[180px] w-full rounded-md border border-input bg-background p-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  return (
    <div className="flex flex-col gap-3">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
