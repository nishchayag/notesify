import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.DOMAIN || "https://notesify.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/signup", "/forgotPassword"],
        disallow: [
          "/api/",
          "/dashboard/",
          "/notes/",
          "/createnote/",
          "/editnote/",
          "/verifyEmail/",
          "/resetpassword/",
          "/askToVerify/",
          "/resetEmailSent/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/login", "/signup"],
        disallow: [
          "/api/",
          "/dashboard/",
          "/notes/",
          "/createnote/",
          "/editnote/",
          "/verifyEmail/",
          "/resetpassword/",
          "/askToVerify/",
          "/resetEmailSent/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
