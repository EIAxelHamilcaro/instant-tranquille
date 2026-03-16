"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, AlertTriangle } from "lucide-react";

type EmergencyContact = {
  name: string;
  role?: string | null;
  phone: string;
  available?: string | null;
};

export function EmergencyContacts({
  id,
  sectionTitle,
  emergencyLabel,
  contacts,
}: {
  id?: string;
  sectionTitle?: string | null;
  emergencyLabel?: string | null;
  contacts: EmergencyContact[];
}) {
  const t = useTranslations("booklet");

  return (
    <section id={id ?? "emergency"} className="scroll-mt-20">
      <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl font-bold">
        <Phone className="h-6 w-6 text-primary-500" aria-hidden="true" />
        {sectionTitle || t("emergency")}
      </h2>

      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            <span className="font-sans text-sm font-semibold">
              {emergencyLabel || t("emergencyNumber")}
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
                <Button asChild size="sm" className="bg-primary-500 text-white hover:bg-primary-600">
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                    <Phone className="h-3 w-3" aria-hidden="true" />
                    {contact.phone}
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
