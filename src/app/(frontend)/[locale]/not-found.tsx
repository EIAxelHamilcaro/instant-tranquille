import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Trees, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Trees className="mb-6 h-16 w-16 text-primary-300" />
      <h1 className="font-heading text-5xl font-bold text-foreground">404</h1>
      <h2 className="mt-2 font-heading text-2xl font-semibold">
        {t("pageNotFound")}
      </h2>
      <p className="mt-3 max-w-md text-muted-foreground">
        {t("pageNotFoundDesc")}
      </p>
      <Button
        asChild
        className="mt-8 bg-primary-500 font-sans hover:bg-primary-600"
      >
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backHome")}
        </Link>
      </Button>
    </Container>
  );
}
