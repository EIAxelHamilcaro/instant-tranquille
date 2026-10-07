"use client";

import { FieldLabel } from "@payloadcms/ui";
import type { FieldLabelClientProps, TextFieldClient } from "payload";
import Help from "./Help";

interface HelpLabelProps extends FieldLabelClientProps<TextFieldClient> {
  help: string;
}

export default function HelpLabel({ help, field, path }: HelpLabelProps) {
  const label = field?.label;

  return (
    <div className="lit-libelle">
      <FieldLabel
        label={label}
        localized={field?.localized}
        path={path}
        required={field?.required}
      />
      <Help text={help} about={typeof label === "string" ? label : undefined} />
    </div>
  );
}
