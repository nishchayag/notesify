import Script from "next/script";

interface StructuredDataProps {
  type: "WebApplication" | "WebSite" | "Article" | "BreadcrumbList";
  data: Record<string, unknown>;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <Script
      id={`structured-data-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

// Pre-built structured data for common pages
export const webApplicationStructuredData = {
  name: "Notesify",
  description:
    "Smart note-taking and task management application with real-time sync and secure authentication.",
  url: process.env.DOMAIN || "https://notesify.vercel.app",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Nishchay Agarwal",
    url: "https://github.com/nishchayag",
  },
  featureList: [
    "Note Creation and Management",
    "Task Organization",
    "Real-time Synchronization",
    "Email Verification",
    "Secure Authentication",
    "Dark/Light Theme Support",
    "Responsive Design",
  ],
};

export const webSiteStructuredData = {
  name: "Notesify",
  description: "Smart note-taking and task management application",
  url: process.env.DOMAIN || "https://notesify.vercel.app",
  potentialAction: {
    "@type": "SearchAction",
    target: `${process.env.DOMAIN || "https://notesify.vercel.app"}/notes?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};
