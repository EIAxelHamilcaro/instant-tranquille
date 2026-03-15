import { Link } from "@/i18n/navigation";
import { getFooterData, getSiteSettings } from "@/lib/queries";
import { getTranslations } from "next-intl/server";
import { Trees, Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

type NavColumn = {
  title: string;
  links?: { label: string; url: string; isExternal?: boolean | null }[];
};

export async function Footer({ locale }: { locale: string }) {
  const [footerData, siteSettings, t] = await Promise.all([
    getFooterData(locale),
    getSiteSettings(locale),
    getTranslations({ locale, namespace: "footer" }),
  ]);

  const footer = footerData as Record<string, any>;
  const settings = siteSettings as Record<string, any>;

  const siteName = settings.siteName || "L'Instant Tranquille";
  const contact = settings.contact as { email?: string; phone?: string; address?: string } | undefined;
  const navColumns: NavColumn[] = (footer.navColumns || []) as NavColumn[];
  const description = footer.description as string | undefined;
  const legalText = footer.legalText as string | undefined;
  const socialLinks = settings.socialLinks as { facebook?: string; instagram?: string; pinterest?: string; youtube?: string; tiktok?: string } | undefined;

  const totalColumns = navColumns.length + (contact ? 1 : 0);
  const gridClass = totalColumns === 2 ? "md:grid-cols-2"
    : totalColumns >= 3 ? "md:grid-cols-3"
    : "";

  return (
    <footer className="border-t border-sand-200 bg-primary-900 text-sand-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className={`grid gap-8 ${gridClass}`}>
          <div>
            <div className="flex items-center gap-2">
              <Trees className="h-6 w-6 text-primary-300" />
              <span className="font-heading text-lg font-bold text-white">
                {siteName}
              </span>
            </div>
            {description && (
              <p className="mt-3 text-sm leading-relaxed text-sand-300">
                {description}
              </p>
            )}
            {socialLinks && (socialLinks.facebook || socialLinks.instagram || socialLinks.pinterest || socialLinks.youtube || socialLinks.tiktok) && (
              <div className="mt-4 flex items-center gap-3">
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="rounded-md text-sand-400 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:outline-none"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="rounded-md text-sand-400 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:outline-none"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {socialLinks.pinterest && (
                  <a
                    href={socialLinks.pinterest}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Pinterest"
                    className="rounded-md text-xs font-bold text-sand-400 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:outline-none"
                  >
                    P
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="rounded-md text-xs font-bold text-sand-400 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:outline-none"
                  >
                    YT
                  </a>
                )}
                {socialLinks.tiktok && (
                  <a
                    href={socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="rounded-md text-xs font-bold text-sand-400 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:outline-none"
                  >
                    TT
                  </a>
                )}
              </div>
            )}
          </div>

          {navColumns.map((column, i) => (
            <div key={i}>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-sand-400">
                {column.title}
              </h3>
              <nav className="mt-4 flex flex-col gap-1" aria-label={column.title}>
                {(column.links || []).map((link, j) =>
                  link.isExternal ? (
                    <a
                      key={j}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md py-1 text-sm text-sand-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:outline-none"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={j}
                      href={link.url as "/"}
                      className="rounded-md py-1 text-sm text-sand-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:outline-none"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
              </nav>
            </div>
          ))}

          {contact && (
            <div>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-sand-400">
                {t("contact")}
              </h3>
              <div className="mt-4 flex flex-col gap-3 text-sm text-sand-300">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 rounded-md py-1 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:outline-none"
                  >
                    <Mail className="h-4 w-4 text-primary-300" />
                    {contact.email}
                  </a>
                )}
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 rounded-md py-1 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:outline-none"
                  >
                    <Phone className="h-4 w-4 text-primary-300" />
                    {contact.phone}
                  </a>
                )}
                {contact.address && (
                  <div className="flex items-start gap-2 py-1">
                    <MapPin className="mt-0.5 h-4 w-4 text-primary-300" />
                    <span>{contact.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-primary-800 pt-6 text-center text-xs text-sand-500">
          <p>
            &copy; {new Date().getFullYear()} {siteName}.{" "}
            {legalText || "Tous droits réservés."}
          </p>
        </div>
      </div>
    </footer>
  );
}
