import type { Guide, GuideProgrammeBlock } from "@/payload-types";

const WORDS_PER_MINUTE = 200;

type ProgrammeFields = Partial<GuideProgrammeBlock>;

export interface LexicalNode {
  type?: string;
  tag?: string;
  text?: string;
  fields?: ProgrammeFields & { url?: string };
  children?: LexicalNode[];
}

export type ProgrammeStep = GuideProgrammeBlock["steps"][number];

export interface GuideHeading {
  id: string;
  text: string;
}

const stepText = ({ time, title, details }: ProgrammeStep) =>
  [time, title, details].filter(Boolean).join(" ");

export function nodeText(node: LexicalNode): string {
  if (typeof node.text === "string") return node.text;
  if (node.type === "block") {
    return (node.fields?.steps ?? []).map(stepText).join(" ");
  }

  return (node.children ?? []).map(nodeText).join("");
}

export function headingId(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function guideHeadings(body: Guide["body"]): GuideHeading[] {
  return (body.root.children as LexicalNode[])
    .filter((node) => node.type === "heading" && node.tag === "h2")
    .map((node) => {
      const text = nodeText(node);

      return { id: headingId(text), text };
    });
}

export function guideProgramme(body: Guide["body"]): ProgrammeStep[] {
  return (body.root.children as LexicalNode[])
    .filter((node) => node.fields?.blockType === "programme")
    .flatMap((node) => node.fields?.steps ?? []);
}

const INLINE_NODES = new Set(["text", "link", "autolink", "tab"]);

function spacedText(node: LexicalNode): string {
  if (typeof node.text === "string") return node.text;
  if (node.type === "block") {
    return (node.fields?.steps ?? []).map(stepText).join(" ");
  }

  const children = node.children ?? [];
  const inline = children.every((child) => INLINE_NODES.has(child.type ?? ""));

  return children.map(spacedText).join(inline ? "" : " ");
}

export function guideWordCount(body: Guide["body"]) {
  return spacedText(body.root as LexicalNode)
    .split(/\s+/)
    .filter(Boolean).length;
}

export function readingMinutes(body: Guide["body"]) {
  return Math.max(1, Math.round(guideWordCount(body) / WORDS_PER_MINUTE));
}
