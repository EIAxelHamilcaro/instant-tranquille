type Inline = string | { text: string; bold?: boolean; href?: string };

type Content = string | Inline[];

export interface ProgrammeStep {
  time: string;
  title: string;
  details?: string;
}

export type Block =
  | Content
  | { h2: string }
  | { h3: string }
  | { list: Content[] }
  | { programme: ProgrammeStep[] }
  | { table: { head: string[]; rows: Content[][] } };

const HEADER_ROW = 1;
const BODY_CELL = 0;

const textNode = (text: string, bold = false) => ({
  type: "text",
  version: 1,
  text,
  format: bold ? 1 : 0,
  detail: 0,
  mode: "normal",
  style: "",
});

const inlineNodes = (content: string | Inline[]) =>
  (typeof content === "string" ? [content] : content).map((part) => {
    if (typeof part === "string") return textNode(part);
    if (!part.href) return textNode(part.text, part.bold);

    return {
      type: "link",
      version: 3,
      direction: "ltr",
      format: "",
      indent: 0,
      fields: {
        linkType: "custom",
        url: part.href,
        newTab: part.href.startsWith("http"),
      },
      children: [textNode(part.text, part.bold)],
    };
  });

const element = (type: string, children: unknown[], extra: object = {}) => ({
  type,
  version: 1,
  direction: "ltr",
  format: "",
  indent: 0,
  children,
  ...extra,
});

const tableCell = (content: Content, headerState: number) =>
  element(
    "tablecell",
    [element("paragraph", inlineNodes(content), { textFormat: 0 })],
    { headerState, colSpan: 1, rowSpan: 1, backgroundColor: null },
  );

const tableRow = (cells: Content[], headerState: number) =>
  element(
    "tablerow",
    cells.map((cell) => tableCell(cell, headerState)),
  );

const blockId = (prefix: string, index: number) =>
  `${prefix}${index.toString(16).padStart(24 - prefix.length, "0")}`;

function blockNode(block: Block, index: number) {
  if (typeof block === "string" || Array.isArray(block)) {
    return element("paragraph", inlineNodes(block), { textFormat: 0 });
  }
  if ("h2" in block) {
    return element("heading", inlineNodes(block.h2), { tag: "h2" });
  }
  if ("h3" in block) {
    return element("heading", inlineNodes(block.h3), { tag: "h3" });
  }
  if ("programme" in block) {
    return {
      type: "block",
      version: 2,
      format: "",
      fields: {
        id: blockId("b", index),
        blockName: "",
        blockType: "programme",
        steps: block.programme.map((step, position) => ({
          id: blockId("e", index * 100 + position),
          ...step,
        })),
      },
    };
  }
  if ("table" in block) {
    return element("table", [
      tableRow(block.table.head, HEADER_ROW),
      ...block.table.rows.map((row) => tableRow(row, BODY_CELL)),
    ]);
  }

  return element(
    "list",
    block.list.map((item, index) =>
      element("listitem", inlineNodes(item), { value: index + 1 }),
    ),
    { listType: "bullet", tag: "ul", start: 1 },
  );
}

export function richText(blocks: Block[]) {
  return { root: element("root", blocks.map(blockNode)) };
}
