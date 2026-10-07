"use client";

import { PopupList, toast, useConfig } from "@payloadcms/ui";
import type { CollectionSlug } from "payload";
import { withSemicolons } from "@/lib/spreadsheet-csv";

interface SpreadsheetDownloadProps {
  collectionSlug: CollectionSlug;
  exportCollectionSlug: CollectionSlug;
}

const today = () => new Date().toISOString().slice(0, 10);

function save(csv: string, filename: string) {
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  });

  link.click();
  URL.revokeObjectURL(url);
}

export default function SpreadsheetDownload({
  collectionSlug,
  exportCollectionSlug,
}: SpreadsheetDownloadProps) {
  const { config, getEntityConfig } = useConfig();
  const { plural } = getEntityConfig({ collectionSlug }).labels;
  const name = typeof plural === "string" ? plural : collectionSlug;

  const download = async () => {
    const response = await fetch(
      `${config.routes.api}/${exportCollectionSlug}/download`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            collectionSlug,
            format: "csv",
            locale: "fr",
            sort: "-createdAt",
          },
        }),
      },
    );

    if (!response.ok) {
      toast.error(
        "Le fichier n'a pas pu être préparé. Réessayez dans un instant.",
      );
      return;
    }

    save(withSemicolons(await response.text()), `${name} ${today()}.csv`);
    toast.success(
      "Le fichier est dans vos téléchargements. Il s'ouvre avec Excel, Numbers ou Google Sheets.",
    );
  };

  return (
    <PopupList.Button onClick={() => void download()}>
      Télécharger la liste en tableur
    </PopupList.Button>
  );
}
