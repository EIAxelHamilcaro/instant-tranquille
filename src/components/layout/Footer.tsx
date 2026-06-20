import { Facebook, Instagram, Mail, MapPin, Phone, Trees } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { getFooterData, getSiteSettings } from "@/lib/queries";

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z" />
    </svg>
  );
}

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

  const footer = footerData as Record<string, unknown>;
  const settings = siteSettings as Record<string, unknown>;

  const siteName =
    (settings.siteName as string | undefined) || "L'Instant Tranquille";
  const contact = settings.contact as
    | { email?: string; phone?: string; address?: string }
    | undefined;
  const navColumns: NavColumn[] = (footer.navColumns || []) as NavColumn[];
  const description = footer.description as string | undefined;
  const legalText = footer.legalText as string | undefined;
  const socialLinks = settings.socialLinks as
    | {
        facebook?: string;
        instagram?: string;
        pinterest?: string;
        youtube?: string;
        tiktok?: string;
      }
    | undefined;

  const totalColumns = 1 + navColumns.length + (contact ? 1 : 0);
  const gridClass =
    totalColumns === 2
      ? "md:grid-cols-2"
      : totalColumns >= 3
        ? "md:grid-cols-3"
        : "";

  return (
    <footer className="border-t border-sand-200 bg-primary-900 text-sand-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className={`grid gap-8 ${gridClass}`}>
          <div>
            <div className="flex items-center gap-2">
              <Trees className="h-6 w-6 text-primary-300" aria-hidden="true" />
              <span className="font-heading text-lg font-bold text-white">
                {siteName}
              </span>
            </div>
            {description && (
              <p className="mt-3 text-sm leading-relaxed text-sand-300">
                {description}
              </p>
            )}
            {socialLinks &&
              (socialLinks.facebook ||
                socialLinks.instagram ||
                socialLinks.pinterest ||
                socialLinks.youtube ||
                socialLinks.tiktok) && (
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
                      className="rounded-md text-sand-400 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:outline-none"
                    >
                      <PinterestIcon className="h-5 w-5" />
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a
                      href={socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="rounded-md text-sand-400 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:outline-none"
                    >
                      <YouTubeIcon className="h-5 w-5" />
                    </a>
                  )}
                  {socialLinks.tiktok && (
                    <a
                      href={socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="TikTok"
                      className="rounded-md text-sand-400 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:outline-none"
                    >
                      <TikTokIcon className="h-5 w-5" />
                    </a>
                  )}
                </div>
              )}
          </div>

          {navColumns.map((column) => (
            <div key={column.title}>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-sand-400">
                {column.title}
              </h3>
              <nav
                className="mt-4 flex flex-col gap-1"
                aria-label={column.title}
              >
                {(column.links || []).map((link) =>
                  link.isExternal ? (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md py-1 text-sm text-sand-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:outline-none"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
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
                    <Mail
                      className="h-4 w-4 text-primary-300"
                      aria-hidden="true"
                    />
                    {contact.email}
                  </a>
                )}
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 rounded-md py-1 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:outline-none"
                  >
                    <Phone
                      className="h-4 w-4 text-primary-300"
                      aria-hidden="true"
                    />
                    {contact.phone}
                  </a>
                )}
                {contact.address && (
                  <div className="flex items-start gap-2 py-1">
                    <MapPin
                      className="mt-0.5 h-4 w-4 text-primary-300"
                      aria-hidden="true"
                    />
                    <span>{contact.address}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Separator className="mt-10 bg-primary-800" />
        <div className="pt-6 text-center text-xs text-sand-500">
          <p>
            &copy; {new Date().getFullYear()} {siteName}.{" "}
            {legalText || t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
