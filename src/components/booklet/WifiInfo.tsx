import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "./CopyButton";
import { Wifi } from "lucide-react";

type WifiData = {
  networkName?: string | null;
  password?: string | null;
};

export function WifiInfo({ data }: { data: WifiData }) {
  const t = useTranslations("booklet");

  if (!data.networkName && !data.password) return null;

  return (
    <section id="wifi" className="scroll-mt-20">
      <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl font-bold">
        <Wifi className="h-6 w-6 text-primary-500" />
        {t("wifi")}
      </h2>

      <Card className="border-sand-200">
        <CardContent className="space-y-4 p-6">
          {data.networkName && (
            <div>
              <p className="mb-1 font-sans text-sm font-medium text-muted-foreground">
                {t("wifiNetwork")}
              </p>
              <CopyButton value={data.networkName} className="text-base" />
            </div>
          )}
          {data.password && (
            <div>
              <p className="mb-1 font-sans text-sm font-medium text-muted-foreground">
                {t("wifiPassword")}
              </p>
              <CopyButton value={data.password} className="text-base" />
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
