import React from 'react';
import { Helmet } from 'react-helmet';

const SEOHead = ({
  title = "Webshop oversigt - Find Danmarks Bedste Webshops",
  description = "Danmarks største webshop directory med over 1000+ verificerede webshops. Find de bedste tilbud og sammenlign priser.",
  keywords = "danske webshops,online shopping,e-handel Danmark",
  image = "/og-image.jpg",
  url = "https://webshop-oversigt.dk"
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Webshop oversigt",
    "description": "Danmarks største webshop directory",
    "url": url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="da_DK" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Hreflang */}
      <link rel="alternate" hreflang="da" href={url} />
      <link rel="alternate" hreflang="x-default" href={url} />
    </Helmet>
  );
};

export default SEOHead;