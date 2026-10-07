import { ViewTransition } from "react";

interface TemplateProps {
  children: React.ReactNode;
}

export default function Template({ children }: TemplateProps) {
  return (
    <ViewTransition enter="page-entre" exit="page-sort" default="none">
      {children}
    </ViewTransition>
  );
}
