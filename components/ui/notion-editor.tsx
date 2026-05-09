"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useRef } from "react";

const TOOLBAR_BUTTON = (active: boolean) => ({
  height: "30px",
  minWidth: "30px",
  padding: "0 8px",
  borderRadius: "6px",
  border: "none",
  background: active ? "#e8f5e9" : "transparent",
  color: active ? "#1F6B2A" : "#555",
  fontSize: "13px",
  fontWeight: active ? 700 : 500,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 120ms ease",
  fontFamily: "inherit",
});

interface NotionEditorProps {
  onChange: (html: string) => void;
  initialContent?: string;
}

export default function NotionEditor({ onChange, initialContent }: NotionEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder: "내용을 입력하세요…" }),
    ],
    content: initialContent || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        style: [
          "outline:none",
          "min-height:200px",
          "font-size:15px",
          "line-height:1.8",
          "color:#191f28",
          "padding:4px 0 16px",
          "font-family:Pretendard,-apple-system,sans-serif",
        ].join(";"),
      },
    },
  });

  if (!editor) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result as string }).run();
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const Sep = () => (
    <div style={{ width: "1px", height: "18px", background: "#e5e8eb", margin: "0 4px", flexShrink: 0 }} />
  );

  return (
    <div style={{ border: "1.5px solid #e5e8eb", borderRadius: "12px", overflow: "hidden", background: "#fafbfc" }}>
      {/* 툴바 */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "2px", padding: "8px 10px", borderBottom: "1px solid #f0f2f4", background: "#ffffff" }}>
        {/* 텍스트 스타일 */}
        <button type="button" style={TOOLBAR_BUTTON(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()} title="굵게">
          <strong>B</strong>
        </button>
        <button type="button" style={TOOLBAR_BUTTON(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()} title="기울임">
          <em>I</em>
        </button>
        <button type="button" style={TOOLBAR_BUTTON(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()} title="밑줄">
          <span style={{ textDecoration: "underline" }}>U</span>
        </button>
        <button type="button" style={TOOLBAR_BUTTON(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()} title="취소선">
          <span style={{ textDecoration: "line-through" }}>S</span>
        </button>

        <Sep />

        {/* 헤딩 */}
        <button type="button" style={{ ...TOOLBAR_BUTTON(editor.isActive("heading", { level: 1 })), fontSize: "12px", fontWeight: 700 }} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button type="button" style={{ ...TOOLBAR_BUTTON(editor.isActive("heading", { level: 2 })), fontSize: "12px", fontWeight: 700 }} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" style={{ ...TOOLBAR_BUTTON(editor.isActive("heading", { level: 3 })), fontSize: "12px", fontWeight: 700 }} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>

        <Sep />

        {/* 리스트 */}
        <button type="button" style={TOOLBAR_BUTTON(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="글머리 목록">
          ≡
        </button>
        <button type="button" style={TOOLBAR_BUTTON(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="번호 목록">
          №
        </button>

        <Sep />

        {/* 인용구 */}
        <button type="button" style={TOOLBAR_BUTTON(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="인용">
          "
        </button>

        {/* 구분선 */}
        <button type="button" style={TOOLBAR_BUTTON(false)} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="구분선">
          —
        </button>

        <Sep />

        {/* 사진 삽입 */}
        <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleImageUpload} />
        <button
          type="button"
          style={{ ...TOOLBAR_BUTTON(false), gap: "4px", padding: "0 10px", color: "#1F6B2A", fontWeight: 600 }}
          onClick={() => fileInputRef.current?.click()}
          title="사진 삽입"
        >
          <span style={{ fontSize: "14px" }}>🖼</span>
          <span style={{ fontSize: "12px" }}>사진</span>
        </button>
      </div>

      {/* 에디터 본문 */}
      <div style={{ padding: "12px 16px" }}>
        <EditorContent editor={editor} />
      </div>

      {/* 에디터 스타일 */}
      <style>{`
        .tiptap p { margin: 0 0 8px; }
        .tiptap p.is-editor-empty:first-child::before {
          color: #b0b8c1;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .tiptap h1 { font-size: 24px; font-weight: 800; color: #191f28; margin: 16px 0 8px; line-height: 1.3; }
        .tiptap h2 { font-size: 20px; font-weight: 700; color: #191f28; margin: 14px 0 6px; line-height: 1.3; }
        .tiptap h3 { font-size: 17px; font-weight: 700; color: #191f28; margin: 12px 0 6px; line-height: 1.3; }
        .tiptap ul { padding-left: 20px; margin: 4px 0 8px; }
        .tiptap ol { padding-left: 20px; margin: 4px 0 8px; }
        .tiptap li { margin-bottom: 4px; }
        .tiptap blockquote { border-left: 3px solid #1F6B2A; padding: 4px 0 4px 16px; margin: 8px 0; color: #555; font-style: italic; }
        .tiptap hr { border: none; border-top: 1.5px solid #e5e8eb; margin: 16px 0; }
        .tiptap img { max-width: 100%; border-radius: 10px; margin: 12px 0; display: block; }
        .tiptap strong { font-weight: 700; }
        .tiptap em { font-style: italic; }
        .tiptap s { text-decoration: line-through; }
        .tiptap u { text-decoration: underline; }
      `}</style>
    </div>
  );
}
