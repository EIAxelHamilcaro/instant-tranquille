import type { Block } from "payload";
import { sectionTitleField } from "./sectionTitleField";

export const WifiBlock: Block = {
  slug: "wifi",
  labels: { singular: "WiFi", plural: "WiFi" },
  fields: [
    sectionTitleField,
    {
      name: "networkName",
      type: "text",
      label: "Nom du réseau",
      admin: {
        description: "Nom qui apparaît dans la liste des Wi-Fi",
        placeholder: "InstantTranquille_Wifi",
      },
    },
    {
      name: "password",
      type: "text",
      label: "Mot de passe Wi-Fi",
      admin: {
        description: "Code à taper pour se connecter",
        placeholder: "Sologne2024!",
      },
    },
  ],
};
