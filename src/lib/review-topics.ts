import type { Testimonial } from "@/payload-types";

export type ReviewTopic = NonNullable<Testimonial["topics"]>[number];

export const REVIEW_TOPIC_OPTIONS: { label: string; value: string }[] = [
  { label: "La maison", value: "house" },
  { label: "L'accueil", value: "welcome" },
  { label: "Le prix", value: "value" },
];

export function reviewsAbout(reviews: Testimonial[], topic: ReviewTopic) {
  return reviews.filter((review) => review.topics?.includes(topic));
}

export function reviewsLedBy(reviews: Testimonial[], topic: ReviewTopic) {
  const onTopic = reviewsAbout(reviews, topic);

  return [...onTopic, ...reviews.filter((review) => !onTopic.includes(review))];
}
