import Script from "next/script";

interface AnalyticsProps {
  googleAnalyticsId?: string;
}

export default function Analytics({ googleAnalyticsId }: AnalyticsProps) {
  return (
    <>
      {/* Google Analytics */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `}
          </Script>
        </>
      )}

      {/* Web Vitals Reporting */}
      <Script id="web-vitals" strategy="afterInteractive">
        {`
          function sendToAnalytics(metric) {
            if (window.gtag) {
              gtag('event', metric.name, {
                value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                event_category: 'Web Vitals',
                event_label: metric.id,
                non_interaction: true,
              });
            }
          }
          
          // Report Web Vitals
          import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(sendToAnalytics);
            getFID(sendToAnalytics);
            getFCP(sendToAnalytics);
            getLCP(sendToAnalytics);
            getTTFB(sendToAnalytics);
          });
        `}
      </Script>
    </>
  );
}

// Custom analytics events
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, unknown>
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      event_category: "User Interaction",
      ...parameters,
    });
  }
};

// Performance monitoring
export const reportWebVitals = (metric: {
  name: string;
  value: number;
  id: string;
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", metric.name, {
      value: Math.round(
        metric.name === "CLS" ? metric.value * 1000 : metric.value
      ),
      event_category: "Web Vitals",
      event_label: metric.id,
      non_interaction: true,
    });
  }
};

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}
