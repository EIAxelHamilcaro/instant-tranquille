import { describe, expect, test } from "bun:test";
import { isReservedPath, isSitePage, sitePath } from "@/lib/redirect-paths";
import { type RedirectRule, resolveRedirect } from "@/lib/redirects";

const SITE = "https://www.instant-tranquille.com";

const rules: RedirectRule[] = [
  {
    from: "/guides/game-fair-lamotte-beuvron-hebergement",
    to: { kind: "guide", slug: "tourisme-equestre-en-sologne" },
  },
  { from: "/livret-accueil", to: { kind: "address", url: "/le-gite" } },
  {
    from: "/reserver",
    to: { kind: "address", url: `${SITE}/en/rates-booking?ref=old` },
  },
  { from: "/avis", to: { kind: "address", url: "https://www.airbnb.fr/x" } },
  { from: "/boucle", to: { kind: "address", url: "/boucle" } },
  {
    from: "/vieux-guide",
    to: { kind: "address", url: "/guides/brame-du-cerf-en-sologne" },
  },
];

const resolve = (path: string, locale: "fr" | "en") =>
  resolveRedirect(path, locale, rules, SITE);

describe("sitePath", () => {
  test("shortens a pasted address to its path, without language or query", () => {
    expect(sitePath(`${SITE}/en/guides/old-name/?utm=x#top`, SITE)).toBe(
      "/guides/old-name",
    );
    expect(sitePath("instant-tranquille.com/guides/old-name", SITE)).toBe(
      "/guides/old-name",
    );
    expect(sitePath("/fr/guides/old-name", SITE)).toBe("/guides/old-name");
  });

  test("refuses an address from another site", () => {
    expect(sitePath("https://www.airbnb.fr/rooms/1", SITE)).toBeNull();
  });
});

describe("old addresses the hosts may not redirect", () => {
  test("pages that still exist, in French or in English", () => {
    expect(isSitePage("/le-gite")).toBe(true);
    expect(isSitePage("/the-cottage")).toBe(true);
    expect(isSitePage("/guides/old-name")).toBe(false);
  });

  test("addresses the site needs to work", () => {
    expect(isReservedPath("/admin/login")).toBe(true);
    expect(isReservedPath("/api/media")).toBe(true);
    expect(isReservedPath("/airbnb")).toBe(true);
    expect(isReservedPath("/robots.txt")).toBe(true);
    expect(isReservedPath("/guides/old-name")).toBe(false);
  });
});

describe("resolveRedirect", () => {
  test("sends a merged guide to its new guide, in each language", () => {
    const merged = "/guides/game-fair-lamotte-beuvron-hebergement";

    expect(resolve(merged, "fr")).toBe("/guides/tourisme-equestre-en-sologne");
    expect(resolve(merged, "en")).toBe(
      "/en/guides/tourisme-equestre-en-sologne",
    );
  });

  test("translates a page of the site into the visitor's language", () => {
    expect(resolve("/livret-accueil", "fr")).toBe("/le-gite");
    expect(resolve("/livret-accueil", "en")).toBe("/en/the-cottage");
    expect(resolve("/reserver", "fr")).toBe("/tarifs-reservation");
    expect(resolve("/reserver", "en")).toBe("/en/rates-booking");
  });

  test("keeps the language on a guide written as an address", () => {
    expect(resolve("/vieux-guide", "en")).toBe(
      "/en/guides/brame-du-cerf-en-sologne",
    );
  });

  test("leaves the site for an address elsewhere", () => {
    expect(resolve("/avis", "en")).toBe("https://www.airbnb.fr/x");
  });

  test("ignores an address nobody redirected and a redirect onto itself", () => {
    expect(resolve("/inconnue", "fr")).toBeNull();
    expect(resolve("/boucle", "fr")).toBeNull();
    expect(resolve("/boucle", "en")).toBeNull();
  });
});
