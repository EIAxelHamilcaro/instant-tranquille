import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, AlertTriangle } from "lucide-react";

type EmergencyContact = {
  name: string;
  role?: string | null;
  phone: string;
  available?: string | null;
};

export function EmergencyContacts({
  contacts,
}: {
  contacts: EmergencyContact[];
}) {
  const t = useTranslations("booklet");

  if (!contacts?.length) return null;

  return (
    <section id="emergency" className="scroll-mt-20">
      <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl font-bold">
        <Phone className="h-6 w-6 text-primary-500" />
        {t("emergency")}
      </h2>

      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-sans text-sm font-semibold">
              Urgences / Emergency: 112
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {contacts.map((contact, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-white p-3"
              >
                <div>
                  <p className="font-sans text-sm font-semibold">
                    {contact.name}
                  </p>
                  {contact.role && (
                    <p className="text-xs text-muted-foreground">
                      {contact.role}
                    </p>
                  )}
                  {contact.available && (
                    <p className="text-xs text-muted-foreground">
                      {contact.available}
                    </p>
                  )}
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-1 rounded-md bg-primary-500 px-3 py-1.5 font-sans text-xs font-medium text-white hover:bg-primary-600"
                >
                  <Phone className="h-3 w-3" />
                  {contact.phone}
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
