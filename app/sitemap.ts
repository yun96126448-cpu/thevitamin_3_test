import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/visit-care`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/family-care`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/welfare-equipment`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/caregiver`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/notices`, lastModified, changeFrequency: "weekly", priority: 0.7 },
  ];
}
