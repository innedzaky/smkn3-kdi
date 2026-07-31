"use client";

import { useEffect, useRef, useState } from "react";
import { MediaLibraryModal } from "./MediaLibraryModal";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const BLOCK_OPTIONS = [
  { value: "P", label: "Paragraph" },
  { value: "H1", label: "Heading 1" },
  { value: "H2", label: "Heading 2" },
  { value: "H3", label: "Heading 3" },
  { value: "H4", label: "Heading 4" },
  { value: "H5", label: "Heading 5" },
  { value: "H6", label: "Heading 6" },
  { value: "PRE", label: "Preformatted" },
];

/** Editor konten kaya (rich text) sederhana ala WordPress Classic Editor,
 *  memakai contentEditable + document.execCommand. Dipakai khusus untuk
 *  field bertipe "richtext" di CrudManager. Menyimpan hasil sebagai HTML. */
export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mediaOpen, setMediaOpen] = useState(false);
  const initialized = useRef(false);

  // Isi konten awal sekali saja saat mount / saat berpindah item yang diedit,
  // supaya kursor tidak "loncat" waktu mengetik.
  useEffect(() => {
    if (editorRef.current && !initialized.current) {
      editorRef.current.innerHTML = value || "";
      initialized.current = true;
    }
  }, [value]);

  const exec = (cmd: string, arg?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
    onChange(editorRef.current?.innerHTML || "");
  };

  const handleInsertImage = (url: string) => {
    editorRef.current?.focus();
    document.execCommand(
      "insertHTML",
      false,
      `<img src="${url}" alt="" style="max-width:100%;height:auto;" />`
    );
    onChange(editorRef.current?.innerHTML || "");
  };

  const handleInsertLink = () => {
    const url = window.prompt("Masukkan URL tautan:");
    if (url) exec("createLink", url);
  };

  return (
    <div className="admin-richtext">
      <div className="admin-richtext-toolbar">
        <button type="button" className="admin-rt-addmedia" onClick={() => setMediaOpen(true)}>
          🖼️ Add Media
        </button>
      </div>
      <div className="admin-richtext-toolbar admin-richtext-toolbar-row2">
        <select
          className="admin-rt-select"
          defaultValue="P"
          onChange={(e) => exec("formatBlock", e.target.value)}
          title="Format paragraf"
        >
          {BLOCK_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => exec("bold")} title="Tebal (Bold)">
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => exec("italic")} title="Miring (Italic)">
          <em>I</em>
        </button>
        <button type="button" onClick={() => exec("insertUnorderedList")} title="Daftar bullet">
          • ≡
        </button>
        <button type="button" onClick={() => exec("insertOrderedList")} title="Daftar bernomor">
          1. ≡
        </button>
        <button type="button" onClick={() => exec("formatBlock", "BLOCKQUOTE")} title="Kutipan">
          ❝
        </button>
        <button type="button" onClick={() => exec("justifyLeft")} title="Rata kiri">
          ⯇
        </button>
        <button type="button" onClick={() => exec("justifyCenter")} title="Rata tengah">
          ▤
        </button>
        <button type="button" onClick={() => exec("justifyRight")} title="Rata kanan">
          ⯈
        </button>
        <button type="button" onClick={handleInsertLink} title="Sisipkan tautan">
          🔗
        </button>
      </div>
      <div
        ref={editorRef}
        className="admin-richtext-body"
        contentEditable
        data-placeholder={placeholder}
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        onBlur={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
      />
      <MediaLibraryModal open={mediaOpen} onClose={() => setMediaOpen(false)} onSelect={handleInsertImage} />
    </div>
  );
}
