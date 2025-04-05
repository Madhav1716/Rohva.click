export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Rohva",
    "applicationCategory": "PhotoEditor",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "description": "Transform your photos into timeless memories with Rohva's vintage photo booth. Create, customize, and share beautiful vintage-style photos instantly.",
    "image": "https://rohva.click/og-image.jpg",
    "url": "https://rohva.click",
    "author": {
      "@type": "Person",
      "name": "Maddy",
      "url": "https://rohva.click"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Vintage photo filters",
      "Instant photo capture",
      "Photo customization",
      "Easy sharing",
      "No account needed"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 