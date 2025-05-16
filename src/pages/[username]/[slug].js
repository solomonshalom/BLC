/** @jsxImportSource @emotion/react */
import Link from 'next/link'
import Head from 'next/head'
import { css } from '@emotion/react'
import sanitize from 'sanitize-html'
import { htmlToText } from 'html-to-text'
import { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

// Helper function to truncate content for meta description
function truncateContent(content, maxLength = 160) {
  const text = htmlToText(content || '');
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

import firebase, { firestore, auth } from '../../lib/firebase'
import { getPostByUsernameAndSlug, getUserByID } from '../../lib/db'

import meta from '../../components/meta'
import Container from '../../components/container'
import { IconButton } from '../../components/button'
import PostContainer from '../../components/post-container'

function AddToReadingListButton({ uid, pid }) {
  const [user, setUser] = useState({ readingList: [] })
  const [inList, setInList] = useState(false)

  useEffect(() => {
    ;(async () => {
      const data = await getUserByID(uid)
      setUser(data)
    })()
  }, [uid])

  useEffect(() => {
    setInList(user.readingList.includes(pid))
  }, [pid, user])

  return (
    <IconButton
      css={css`
        margin-left: auto;
        margin-bottom: 2.5rem;
      `}
      onClick={async () => {
        const arrayAdd = firebase.firestore.FieldValue.arrayUnion
        const arrayRemove = firebase.firestore.FieldValue.arrayRemove

        await firestore
          .collection('users')
          .doc(uid)
          .update({
            readingList: inList ? arrayRemove(pid) : arrayAdd(pid),
          })

        setUser({
          ...user,
          readingList: inList
            ? user.readingList.filter(id => id != pid)
            : [...user.readingList, pid],
        })
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.5rem"
        height="1.5rem"
        fill="var(--grey-3)"
        viewBox="0 0 256 256"
      >
        <rect width="256" height="256" fill="none"></rect>
        {inList ? (
          // Outline reading list icon
          <path d="M192,24H96A16.01833,16.01833,0,0,0,80,40V56H64A16.01833,16.01833,0,0,0,48,72V224a8.00026,8.00026,0,0,0,12.65039,6.50977l51.34277-36.67872,51.35743,36.67872A7.99952,7.99952,0,0,0,176,224V184.6897l19.35059,13.82007A7.99952,7.99952,0,0,0,208,192V40A16.01833,16.01833,0,0,0,192,24Zm0,152.45508-16-11.42676V72a16.01833,16.01833,0,0,0-16-16H96V40h96Z"></path>
        ) : (
          // Filled in reading list icon
          <>
            <path
              d="M168,224l-56.0074-40L56,224V72a8,8,0,0,1,8-8h96a8,8,0,0,1,8,8Z"
              fill="none"
              stroke="var(--grey-3)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            ></path>
            <path
              d="M88,64V40a8,8,0,0,1,8-8h96a8,8,0,0,1,8,8V192l-32-22.85412"
              fill="none"
              stroke="var(--grey-3)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            ></path>
          </>
        )}
      </svg>
    </IconButton>
  )
}

export default function Post({ post }) {
  const [user, _loading, _error] = useAuthState(auth)

  return (
    <Container maxWidth="640px">
      <Head>
        {meta({
          title: `${htmlToText(post.title) || 'Untitled'} - ${post.author.displayName} | Bublr`,
          description: post.excerpt || truncateContent(post.content, 160),
          url: `/${post.author.name}/${post.slug}`,
          type: 'article', 
          keywords: `${post.author.displayName}, ${post.author.name}, writing, blog post, article`
        })}
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href={`https://bublr.life/${post.author.name}/${post.slug}`} />
        
        {/* Article structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "image": post.author.photo,
            "author": {
              "@type": "Person",
              "name": post.author.displayName,
              "url": `https://bublr.life/${post.author.name}`
            },
            "publisher": {
              "@type": "Organization",
              "name": "Bublr",
              "url": "https://bublr.life"
            },
            "url": `https://bublr.life/${post.author.name}/${post.slug}`,
            "datePublished": new Date(post.lastEdited).toISOString(),
            "dateModified": new Date(post.lastEdited).toISOString()
          })
        }} />
      </Head>

      <h1
        css={css`
          font-size: 1.75rem;
          letter-spacing: -0.02em;
          line-height: 1.35;
          margin-bottom: 2rem;
        `}
      >
        {post.title ? htmlToText(post.title) : 'Untitled'}
      </h1>

      <div
        css={css`
          display: flex;
          align-items: center;
          color: var(--grey-3);
        `}
      >
        <img
          src={post.author.photo}
          alt={`${post.author.displayName}'s profile picture`}
          width="32"
          height="32"
          loading="eager"
          css={css`
            width: 2rem;
            height: 2rem;
            border-radius: 1rem;
            margin-right: 1rem;
            object-fit: cover;
          `}
        />
        <p>
          <Link href={`/${post.author.name}`}>
            <a
              style={{
                color: 'inherit',
                textDecoration: 'none',
                borderBottom: `1px dotted var(--grey-2)`,
              }}
            >
              {post.author.displayName}
            </a>
          </Link>{' '}
          / {new Date(post.lastEdited).toDateString()}
        </p>
      </div>

      <PostContainer
        dangerouslySetInnerHTML={{
          __html: sanitize(post.content, {
            allowedTags: sanitize.defaults.allowedTags.concat(['img']),
          }),
        }}
        css={css`
          margin-bottom: 5rem;
        `}
      />

      {user ? (
        <footer>
          <AddToReadingListButton uid={user.uid} pid={post.id} />
        </footer>
      ) : (
        ''
      )}
    </Container>
  )
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const { username, slug } = params

  try {
    const post = await getPostByUsernameAndSlug(username, slug)
    if (!post.published) {
      return { notFound: true }
    }
    const userDoc = await firestore.collection('users').doc(post.author).get()
    post.author = userDoc.data()
    post.lastEdited = post.lastEdited.toDate().getTime()
    return {
      props: { post },
      revalidate: 60, // Revalidate at most once per minute
    }
  } catch (err) {
    console.log(err)
    return { notFound: true }
  }
}