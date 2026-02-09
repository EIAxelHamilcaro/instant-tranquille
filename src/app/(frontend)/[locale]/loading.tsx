import { Container } from "@/components/shared/Container";

export default function Loading() {
  return (
    <Container className="py-20">
      <div className="animate-pulse space-y-8">
        <div className="mx-auto h-10 w-64 rounded-lg bg-sand-200" />
        <div className="mx-auto h-4 w-96 rounded bg-sand-100" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-lg bg-sand-100" />
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-sand-100" />
          <div className="h-4 w-5/6 rounded bg-sand-100" />
          <div className="h-4 w-4/6 rounded bg-sand-100" />
        </div>
      </div>
    </Container>
  );
}
