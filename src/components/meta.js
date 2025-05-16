// Use as a function, not a component. For example:
//   meta({title: 'cool title', description: 'cool desc', url: '/cool'})
// Instead of:
//   <Meta title="cool title" description="cool desc" url="/cool" />
export default function meta({ title, description, url, image, type, keywords }) {
  // We prefix relative urls with the VERCEL_URL that vercel sets for us on deployments
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://bublr.life'
      : 'https://' + process.env.VERCEL_URL

  if (url) {
    url = url.startsWith('/') ? baseUrl + url : url
  }

  if (image) {
    image = image.startsWith('/') ? baseUrl + image : image
  }

  // Default keywords for the site
  const defaultKeywords = 'writing, blog, minimal, writing community, open source';
  
  return (
    <>
      {/* Primary meta tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords || defaultKeywords} />

      {/* Open Graph/Facebook */}
      <meta property="og:type" content={type || 'website'} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Bublr" />
      {image && (
        <>
          <meta property="og:image" content={image} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={title} />
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@bublr" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && (
        <>
          <meta name="twitter:image" content={image} />
          <meta name="twitter:image:alt" content={title} />
        </>
      )}
    </>
  )
}