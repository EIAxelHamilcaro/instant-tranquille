"use client";

import {
  Button,
  toast,
  useDocumentInfo,
  useFormModified,
} from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RecalculateRoute() {
  const { id } = useDocumentInfo();
  const isModified = useFormModified();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  if (!id)
    return (
      <p className="lit-aide">
        La position et le temps de route se calculent tout seuls au premier
        enregistrement, à partir de l&apos;adresse.
      </p>
    );

  const recalculate = async () => {
    setIsPending(true);
    try {
      const response = await fetch(`/api/places/${id}/recalculate-route`, {
        method: "POST",
        credentials: "include",
      });
      const { message } = (await response.json()) as { message?: string };
      const text = message ?? "Le calcul n'a pas abouti. Réessayez plus tard.";
      if (response.ok) toast.success(text);
      else toast.error(text);
      router.refresh();
    } catch {
      toast.error("Le calcul n'a pas abouti. Vérifiez votre connexion.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="lit-action">
      <Button
        buttonStyle="secondary"
        size="medium"
        disabled={isPending || isModified}
        onClick={() => void recalculate()}
      >
        {isPending ? "Calcul en cours" : "Recalculer"}
      </Button>
      <p className="lit-aide">
        {isModified
          ? "Enregistrez d'abord vos modifications, puis recalculez."
          : "Relance le calcul de la position et du temps de route depuis le gîte."}
      </p>
    </div>
  );
}
