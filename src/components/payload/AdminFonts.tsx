import { bricolage, newsreader } from "@/lib/fonts";
import "@/styles/admin.css";
import EditingLocale from "./EditingLocale";

interface AdminFontsProps {
  children?: React.ReactNode;
}

const FONT_VARIABLES = `:root{--font-body:${bricolage.style.fontFamily},system-ui,sans-serif;--font-serif:${newsreader.style.fontFamily},Georgia,serif}`;

export default function AdminFonts({ children }: AdminFontsProps) {
  return (
    <>
      <style>{FONT_VARIABLES}</style>
      <EditingLocale />
      {children}
    </>
  );
}
