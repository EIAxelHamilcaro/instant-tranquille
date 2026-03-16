import { Container } from "@/components/shared/Container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="py-20">
      <div className="space-y-8">
        <Skeleton className="mx-auto h-10 w-64 rounded-lg bg-sand-200" />
        <Skeleton className="mx-auto h-4 w-96 bg-sand-100" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg bg-sand-100" />
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full bg-sand-100" />
          <Skeleton className="h-4 w-5/6 bg-sand-100" />
          <Skeleton className="h-4 w-4/6 bg-sand-100" />
        </div>
      </div>
    </Container>
  );
}
