import { getAllUsersWithPublishedPosts } from '../lib/db'

const SITE_URL = 'https://bublr.life'

// Generate the XML sitemap with the blog data
function generateSiteMap(users) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
           xmlns:xhtml="http://www.w3.org/1999/xhtml"
           xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
     <!-- Add the home page as an entry -->
     <url>
       <loc>${SITE_URL}</loc>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
       <image:image>
         <image:loc>${SITE_URL}/images/socials.png</image:loc>
         <image:title>Bublr - A Minimal Writing Community</image:title>
       </image:image>
     </url>
     
     <!-- Add user profile pages -->
     ${users
       .map(user => {
         return `
       <url>
           <loc>${`${SITE_URL}/${user.name}`}</loc>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
           ${user.photo ? `
           <image:image>
             <image:loc>${user.photo}</image:loc>
             <image:title>${user.name}'s profile picture</image:title>
           </image:image>` : ''}
       </url>
       `
       })
       .join('')}
       
     <!-- Add individual post pages -->
     ${users
       .map(user => {
         return user.posts
           .map(post => {
             return `
           <url>
               <loc>${`${SITE_URL}/${user.name}/${post.slug}`}</loc>
               <lastmod>${new Date(post.lastEdited.toDate()).toISOString()}</lastmod>
               <changefreq>monthly</changefreq>
               <priority>0.7</priority>
               <xhtml:link 
                 rel="alternate"
                 hreflang="en"
                 href="${`${SITE_URL}/${user.name}/${post.slug}`}"
               />
           </url>
           `
           })
           .join('')
       })
       .join('')}
   </urlset>
 `
}

export async function getServerSideProps({ res }) {
  // Get all users with published posts
  const users = await getAllUsersWithPublishedPosts()

  // Generate the XML sitemap
  const sitemap = generateSiteMap(users)

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default function Sitemap() {
  // This component doesn't need to render anything
  return null
}