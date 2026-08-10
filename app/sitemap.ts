import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const locations = ["mokpo", "gwangju", "jeonnam"];

  const basePages = [
    { url: SITE_URL, lastModified, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${SITE_URL}/visit-care`, lastModified, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${SITE_URL}/family-care`, lastModified, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${SITE_URL}/welfare-equipment`, lastModified, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${SITE_URL}/caregiver`, lastModified, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/notices`, lastModified, changeFrequency: "weekly" as const, priority: 0.7 },
  ];

  const locationPages = locations.flatMap((location) => [
    { url: `${SITE_URL}/visit-care/${location}`, lastModified, changeFrequency: "monthly" as const, priority: 0.85 },
    { url: `${SITE_URL}/family-care/${location}`, lastModified, changeFrequency: "monthly" as const, priority: 0.85 },
    { url: `${SITE_URL}/welfare-equipment/${location}`, lastModified, changeFrequency: "monthly" as const, priority: 0.85 },
    { url: `${SITE_URL}/caregiver/${location}`, lastModified, changeFrequency: "monthly" as const, priority: 0.85 },
  ]);

  return [...basePages, ...locationPages];
}
