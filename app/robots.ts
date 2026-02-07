import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/admin", "/dashboard", "/dashboard/"],
    },
    sitemap: [
      "https://mlbbtopup.in/sitemap.xml",
      "https://mlbbtopup.in/sitemap.txt",
    ],

  };
}
