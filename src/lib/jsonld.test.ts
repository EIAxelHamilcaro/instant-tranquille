import { describe, expect, test } from "bun:test";
import { rateOffersJsonLd } from "@/components/rates/rate-offers";
import { guideWordCount } from "@/components/surroundings/guide-content";
import {
  cottageBeds,
  cottageJsonLd,
  overallRating,
  withoutEmpty,
} from "@/lib/jsonld";
import type {
  CottagePage,
  Guide,
  Media,
  PricingConfig,
  SiteSetting,
  Testimonial,
} from "@/payload-types";

const AIRBNB = "https://www.airbnb.fr/rooms/1605140748799580144";
const BOOKING = "https://www.booking.com/hotel/fr/linstant-tranquille.fr.html";

const photo = (id: number) =>
  ({ id, url: `/api/media/file/photo-${id}.webp` }) as Media;

const settings = {
  siteDescription: "Une maison familiale en Sologne.",
  contact: { phone: null, email: "", address: "1 rue du Test" },
  propertyDetails: { bedrooms: 3, maxGuests: 6 },
  platforms: [
    {
      platform: "airbnb",
      url: AIRBNB,
      rating: 5,
      ratingScale: 5,
      reviewCount: 15,
    },
    {
      platform: "booking",
      url: BOOKING,
      rating: 9.6,
      ratingScale: 10,
      reviewCount: 13,
    },
  ],
  socialLinks: { facebook: null, instagram: AIRBNB },
} as unknown as SiteSetting;

const pricing = {
  currency: "EUR",
  nightlyRates: [
    { guests: "4", price: 110 },
    { guests: "2", price: 100 },
  ],
} as unknown as PricingConfig;

const cottage = {
  rooms: [{ photos: [{ image: photo(1) }, { image: photo(2) }] }],
  gallery: [{ image: photo(1) }, { image: photo(3) }],
} as unknown as CottagePage;

const nullPaths = (value: unknown, path = "$"): string[] => {
  if (value === null || value === undefined || value === "") return [path];
  if (typeof value !== "object") return [];

  return Object.entries(value).flatMap(([key, item]) =>
    nullPaths(item, `${path}.${key}`),
  );
};

describe("cottage JSON-LD", () => {
  const node = cottageJsonLd({
    locale: "fr",
    settings,
    pricing,
    amenities: [],
    reviews: [],
    cottage,
  }) as Record<string, unknown>;

  test("given a review without a stay date, when the node is built, then it is dated by the day it was recorded", () => {
    const review = {
      guestName: "Claire",
      text: "Maison calme.",
      rating: 5,
      stayDate: null,
      createdAt: "2026-10-06T09:12:00.000Z",
    } as Testimonial;
    const dated = { ...review, stayDate: "2026-08-01T00:00:00.000Z" };

    const { review: reviews } = cottageJsonLd({
      locale: "fr",
      settings,
      pricing,
      amenities: [],
      reviews: [review, dated],
      cottage,
    }) as { review: { datePublished: string }[] };

    expect(reviews.map(({ datePublished }) => datePublished)).toEqual([
      "2026-10-06",
      "2026-08-01",
    ]);
  });

  test("given base prices of 100 and 110 per night, when the node is built, then the price range spans them", () => {
    expect(node.priceRange).toBe("100\u00a0€ - 110\u00a0€");
  });

  test("given rooms described in French or in English, when beds are counted, then doubles and singles are totalled by type", () => {
    const rooms = (details: string[]) =>
      ({ rooms: details.map((text) => ({ details: text })) }) as CottagePage;

    const expected = [
      { "@type": "BedDetails", numberOfBeds: 2, typeOfBed: "Double" },
      { "@type": "BedDetails", numberOfBeds: 2, typeOfBed: "Single" },
    ];

    expect(
      cottageBeds(
        rooms([
          "Deux canapés",
          "1 lit double",
          "1 lit double",
          "2 lits simples",
        ]),
      ),
    ).toEqual(expected);
    expect(
      cottageBeds(rooms(["1 double bed", "1 double bed", "2 single beds"])),
    ).toEqual(expected);
    expect(cottageBeds(rooms(["Baby-foot"]))).toEqual([]);
  });

  test("given an empty phone and email, when the node is built, then no empty property is emitted", () => {
    expect(node).not.toHaveProperty("telephone");
    expect(node).not.toHaveProperty("email");
    expect(node).not.toHaveProperty("review");
    expect(nullPaths(node)).toEqual([]);
  });

  test("given a photo used in a room and in the gallery, when the node is built, then the image is listed once", () => {
    expect(node.image).toHaveLength(3);
    expect(new Set(node.image as string[]).size).toBe(3);
  });

  test("given the listings of the CMS, when the node is built, then sameAs holds Airbnb and Booking once each", () => {
    expect(node.sameAs).toEqual([AIRBNB, BOOKING]);
  });

  test("given any page, when the node is built, then it carries both lodging types", () => {
    expect(node["@type"]).toEqual(["VacationRental", "LodgingBusiness"]);
  });
});

describe("overall rating", () => {
  test("given 15 reviews at 5 out of 5 and 13 at 9.6 out of 10, when averaged, then it is 4.9 out of 5 on 28 reviews", () => {
    expect(overallRating(settings)).toEqual({
      ratingValue: 4.9,
      bestRating: 5,
      worstRating: 1,
      reviewCount: 28,
    });
  });

  test("given no rated listing, when averaged, then there is no rating", () => {
    expect(overallRating({ platforms: [] } as unknown as SiteSetting)).toBe(
      null,
    );
  });
});

describe("offers JSON-LD", () => {
  const description = "Prix de base par nuit, hors frais de la plateforme.";
  const offers =
    rateOffersJsonLd({
      pricing,
      locale: "fr",
      description,
      nameFor: (guests) => `Prix de base pour ${guests}`,
    })?.["@graph"] ?? [];

  test("given base prices per night, when offers are built, then each one is a price per night that says what it leaves out, never a stay total", () => {
    expect(offers.map((offer) => offer.priceSpecification)).toEqual([
      {
        "@type": "UnitPriceSpecification",
        price: 100,
        priceCurrency: "EUR",
        unitCode: "DAY",
      },
      {
        "@type": "UnitPriceSpecification",
        price: 110,
        priceCurrency: "EUR",
        unitCode: "DAY",
      },
    ]);
    expect(offers.map((offer) => offer.description)).toEqual([
      description,
      description,
    ]);

    for (const offer of offers) {
      expect(offer).not.toHaveProperty("price");
      expect(offer).not.toHaveProperty("eligibleDuration");
      expect(offer).not.toHaveProperty("validFrom");
      expect(Object.keys(offer.itemOffered)).toEqual(["@id"]);
    }
  });

  test("given no base price, when offers are built, then nothing is emitted", () => {
    expect(
      rateOffersJsonLd({
        pricing: { nightlyRates: [] } as unknown as PricingConfig,
        locale: "fr",
        description,
        nameFor: String,
      }),
    ).toBe(null);
  });
});

describe("empty values", () => {
  test("given nested empty values, when pruned, then only filled properties and references remain", () => {
    expect(
      withoutEmpty({
        name: "Gîte",
        telephone: null,
        petsAllowed: false,
        floor: 0,
        geo: { "@type": "GeoCoordinates", latitude: undefined },
        publisher: { "@id": "https://example.com/#gite" },
        review: [],
      }),
    ).toEqual({
      name: "Gîte",
      petsAllowed: false,
      floor: 0,
      publisher: { "@id": "https://example.com/#gite" },
    });
  });
});

describe("guide word count", () => {
  test("given paragraphs, a list and a table, when counted, then words of neighbouring blocks stay separate", () => {
    const text = (value: string) => ({ type: "text", text: value });
    const body = {
      root: {
        type: "root",
        children: [
          { type: "paragraph", children: [text("Deux "), text("mots")] },
          {
            type: "list",
            children: [
              { type: "listitem", children: [text("un")] },
              { type: "listitem", children: [text("deux")] },
            ],
          },
          {
            type: "table",
            children: [
              {
                type: "tablerow",
                children: [
                  {
                    type: "tablecell",
                    children: [{ type: "paragraph", children: [text("a")] }],
                  },
                  {
                    type: "tablecell",
                    children: [{ type: "paragraph", children: [text("b c")] }],
                  },
                ],
              },
            ],
          },
        ],
      },
    } as unknown as Guide["body"];

    expect(guideWordCount(body)).toBe(7);
  });
});
