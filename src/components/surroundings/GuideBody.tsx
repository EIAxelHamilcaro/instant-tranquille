import type {
  SerializedTableCellNode,
  SerializedTableNode,
  SerializedTableRowNode,
} from "@payloadcms/richtext-lexical";
import type { SerializedLexicalNode } from "@payloadcms/richtext-lexical/lexical";
import {
  type JSXConverters,
  RichText,
} from "@payloadcms/richtext-lexical/react";
import { PhotoViewer } from "@/components/shared/PhotoViewer";
import { bulletItemsWithoutValue } from "@/components/shared/rich-text-converters";
import { GuideDay } from "@/components/surroundings/GuideDay";
import { GuidePlate } from "@/components/surroundings/GuidePlate";
import {
  headingId,
  type LexicalNode,
  nodeText,
} from "@/components/surroundings/guide-content";
import {
  columnBars,
  illustrateBody,
  type PlateFields,
} from "@/components/surroundings/guide-illustrations";
import type { Guide, GuideProgrammeBlock, Place } from "@/payload-types";

interface GuideBodyProps {
  body: Guide["body"];
  places?: Place[];
  className?: string;
}

interface ProgrammeNode {
  fields: GuideProgrammeBlock;
}

interface PlateNode {
  fields: PlateFields;
}

type NodesToJSX = (args: { nodes: SerializedLexicalNode[] }) => React.ReactNode;

const HEADER_ROW = 1;
const HEADER_COLUMN = 2;

const cellContent = (node: SerializedTableCellNode, nodesToJSX: NodesToJSX) =>
  node.children.map((child) =>
    "children" in child && Array.isArray(child.children)
      ? nodesToJSX({ nodes: child.children as SerializedLexicalNode[] })
      : nodesToJSX({ nodes: [child] }),
  );

const isHeaderRow = (cells: SerializedTableCellNode[]) =>
  cells.every((cell) => cell.headerState === HEADER_ROW);

const isBlank = (cell: SerializedTableCellNode) =>
  nodeText(cell as LexicalNode).trim() === "";

function tableLabel(siblings: LexicalNode[], index: number) {
  const before = siblings.slice(0, index);
  const heading = before.findLastIndex((node) => node.type === "heading");
  const title = before[heading];
  if (!title) return undefined;

  const rank = before
    .slice(heading)
    .filter((node) => node.type === "table").length;
  const text = nodeText(title);

  return rank > 0 ? `${text} (${rank + 1})` : text;
}

const tableConverters: JSXConverters<SerializedTableNode> = {
  table: ({ node, nodesToJSX, parent, childIndex }) => {
    const rows = node.children.map(
      (row) =>
        (row as SerializedTableRowNode).children as SerializedTableCellNode[],
    );
    const bars = columnBars(
      rows
        .filter((cells) => !isHeaderRow(cells))
        .map((cells) => cells.map((cell) => nodeText(cell as LexicalNode))),
    );
    const firstBody = rows.findIndex((cells) => !isHeaderRow(cells));
    const corner = rows.find(isHeaderRow)?.[0];
    const hasRowHeaders = corner !== undefined && isBlank(corner);
    const siblings =
      "children" in parent ? (parent.children as LexicalNode[]) : [];

    return (
      <div className="tableau">
        <table aria-label={tableLabel(siblings, childIndex)}>
          <tbody>
            {rows.map((cells, row) => (
              <tr
                key={cells.map((cell) => nodeText(cell as LexicalNode)).join()}
              >
                {cells.map((cell, column) => {
                  const content = cellContent(cell, nodesToJSX);
                  const key = `${column}-${nodeText(cell as LexicalNode)}`;
                  const bar = bars[row - firstBody]?.[column];

                  if (cell.headerState === HEADER_ROW && isBlank(cell)) {
                    return <td key={key} />;
                  }

                  if (cell.headerState === HEADER_ROW) {
                    return (
                      <th key={key} scope="col">
                        {content}
                      </th>
                    );
                  }

                  if (
                    cell.headerState === HEADER_COLUMN ||
                    (hasRowHeaders && column === 0)
                  ) {
                    return (
                      <th key={key} scope="row">
                        {content}
                      </th>
                    );
                  }

                  return (
                    <td key={key}>
                      {content}
                      {typeof bar === "number" && (
                        <svg
                          className="jauge"
                          viewBox="0 0 100 2"
                          preserveAspectRatio="none"
                          aria-hidden="true"
                        >
                          <path d={`M0 1H${bar}`} />
                        </svg>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

function Programme({ fields }: ProgrammeNode) {
  return (
    <>
      <GuideDay steps={fields.steps} />
      <ol className="programme">
        {fields.steps.map((step) => (
          <li key={step.id ?? step.time + step.title}>
            <span className="heure">{step.time}</span>
            <strong>{step.title}</strong>
            {step.details && <p>{step.details}</p>}
          </li>
        ))}
      </ol>
    </>
  );
}

export function GuideBody({ body, places = [], className }: GuideBodyProps) {
  return (
    <PhotoViewer>
      <RichText
        data={illustrateBody(body, places)}
        className={className}
        converters={({ defaultConverters }) => ({
          ...defaultConverters,
          ...bulletItemsWithoutValue(defaultConverters),
          ...tableConverters,
          blocks: {
            programme: ({ node }: { node: ProgrammeNode }) => (
              <Programme fields={node.fields} />
            ),
            planche: ({ node }: { node: PlateNode }) => (
              <GuidePlate fields={node.fields} />
            ),
          },
          heading: ({ node, nodesToJSX }) => {
            const Tag = node.tag;
            const children = nodesToJSX({ nodes: node.children });

            return node.tag === "h2" ? (
              <Tag id={headingId(nodeText(node))}>{children}</Tag>
            ) : (
              <Tag>{children}</Tag>
            );
          },
        })}
      />
    </PhotoViewer>
  );
}
