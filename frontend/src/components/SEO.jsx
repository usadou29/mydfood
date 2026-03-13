import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://mydfood.com';
const DEFAULT_IMAGE = `${BASE_URL}/logo.svg`;

export function SEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_IMAGE,
}) {
  const fullTitle = title ? `${title} | DFOOD` : 'DFOOD | Cuisine Camerounaise 100% Halal';
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
