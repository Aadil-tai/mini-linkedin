"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  ImageIcon,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor = ({
  content,
  onChange,
  placeholder = "What's on your mind?",
  className = "",
}: RichTextEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        // Exclude link from StarterKit to avoid duplication
        link: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 hover:text-blue-600 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[120px] max-w-none dark:prose-invert ${className}`,
      },
    },
  });

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
            editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-600" : ""
          }`}
          type="button"
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
            editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-600" : ""
          }`}
          type="button"
        >
          <Italic size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
            editor.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-600" : ""
          }`}
          type="button"
        >
          <List size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
            editor.isActive("orderedList") ? "bg-gray-200 dark:bg-gray-600" : ""
          }`}
          type="button"
        >
          <ListOrdered size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        <button
          onClick={addLink}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
            editor.isActive("link") ? "bg-gray-200 dark:bg-gray-600" : ""
          }`}
          type="button"
        >
          <LinkIcon size={16} />
        </button>

        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          type="button"
        >
          <ImageIcon size={16} />
        </button>
      </div>

      {/* Editor */}
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
