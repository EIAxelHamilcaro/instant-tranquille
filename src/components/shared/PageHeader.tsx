import { Container } from "@/components/shared/Container";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <section className="border-b border-sand-200 bg-sand-50">
      <Container className="py-14 lg:py-20">
        {eyebrow && (
          <p className="eyebrow mb-4 text-xs text-primary-600">{eyebrow}</p>
        )}
        <p className="display-section font-display font-semibold text-foreground">
          {title}
        </p>
        {subtitle && (
          <p className="subtitle-editorial mt-4 max-w-2xl text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}
