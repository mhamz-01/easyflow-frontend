import type { JSONContent } from "@tiptap/react";

// The real doc editor (@mhamz.01/easyflow-texteditor) supports a much wider
// node/mark schema than we register for this read-only preview (images,
// tables, colored text, custom upload nodes, …). Rather than register every
// extension here (and risk drifting out of sync with an external package we
// don't control), unknown nodes are swapped for a plain placeholder and
// unknown marks are dropped — so a doc using those features still opens
// instead of crashing the preview.

const SUPPORTED_NODES = new Set([
  "doc",
  "paragraph",
  "text",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "taskList",
  "taskItem",
  "blockquote",
  "codeBlock",
  "horizontalRule",
  "hardBreak",
]);

const SUPPORTED_MARKS = new Set(["bold", "italic", "strike", "code", "underline", "link"]);

const fallbackParagraph = (): JSONContent => ({
  type: "paragraph",
  content: [
    { type: "text", text: "⋯ unsupported content", marks: [{ type: "italic" }] },
  ],
});

const emptyDoc = (): JSONContent => ({ type: "doc", content: [{ type: "paragraph" }] });

const sanitizeNode = (node: JSONContent): JSONContent | null => {
  if (!node || typeof node !== "object" || !node.type) return null;

  if (node.type === "text") {
    if (!node.text) return null;
    const marks = (node.marks ?? []).filter((m) => SUPPORTED_MARKS.has(m.type));
    return { ...node, marks: marks.length ? marks : undefined };
  }

  if (!SUPPORTED_NODES.has(node.type)) {
    return fallbackParagraph();
  }

  const content = Array.isArray(node.content)
    ? node.content.map(sanitizeNode).filter((c): c is JSONContent => c !== null)
    : undefined;

  return { type: node.type, attrs: node.attrs, content };
};

export const sanitizeTiptapContent = (content: JSONContent | null | undefined): JSONContent => {
  if (!content || typeof content !== "object") return emptyDoc();

  const root: JSONContent = content.type ? content : { type: "doc", content: content.content };
  const sanitized = sanitizeNode(root);

  if (!sanitized || sanitized.type !== "doc" || !sanitized.content?.length) {
    return emptyDoc();
  }

  return sanitized;
};
