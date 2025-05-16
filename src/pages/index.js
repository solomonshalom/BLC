/** @jsxImportSource @emotion/react */
import Head from 'next/head'
import { css } from '@emotion/react'
import { useAuthState } from 'react-firebase-hooks/auth'

import firebase, { auth } from '../lib/firebase'
import { setUser, userWithIDExists } from '../lib/db'

import meta from '../components/meta'
import Spinner from '../components/spinner'
import Container from '../components/container'
import PeepWalk from '../components/PeepWalk'
import Button, { LinkButton } from '../components/button'

const dicebearStyles = [
  'notionists-neutral',
  'notionists',
  'lorelei-neutral',
  'lorelei',
  'dylan',
]

function generateDiceBearAvatar(uid) {
  const hash = uid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const style = dicebearStyles[hash % dicebearStyles.length]
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${uid}`
}

export default function Home() {
  const [user, loading, error] = useAuthState(auth)

  if (error) {
    return (
      <>
        <p>Oop, we&apos;ve had an error:</p>
        <pre>{JSON.stringify(error)}</pre>
      </>
    )
  }

  return (
    <div>
      <div
        css={css`
          margin-top: 0rem;
          margin-bottom: 2.5rem;

          @media (max-width: 720px) {
            margin-bottom: 10rem;
          }

          width: 2rem;
          height: 2rem;

          background-image: url('/images/logo-dark.png');
          background-position: center;
          background-repeat: no-repeat;
          background-size: 2rem;

          html[data-theme='dark'] & {
            background-image: url('/images/logo.png');
          }
        `}
      ></div>
      <h1
        css={css`
          font-size: 1.5rem;
          letter-spacing: -0.02rem;
          margin-bottom: 1.5rem;
        `}
      >
        An open-source, ultra-minimal community for writers, to write.
      </h1>
      <ul
        css={css`
          list-style: none;
          color: var(--grey-3);
          margin-bottom: 2.5rem;

          li {
            margin: 0.75rem 0;
          }

          li::before {
            display: inline-block;
            content: '';
            font-size: 0.9rem;
            margin-right: 0.5rem;
          }
        `}
      >
        <li>No ads</li>
        <li>No paywalls</li>
        <li>Open-source</li>
      </ul>
      {loading ? (
        <Button>
          <Spinner />
        </Button>
      ) : user ? (
        <div
          css={css`
            display: flex;
          `}
        >
          <LinkButton href="/dashboard">Dashboard</LinkButton>
          <Button
            css={css`
              margin-left: 1rem;
            `}
            outline
            onClick={() => auth.signOut()}
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <div
          css={css`
            display: flex;
            button:first-of-type {
              margin-right: 1rem;
            }
          `}
        >
          <Button
            onClick={() => {
              const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
              auth.signInWithPopup(googleAuthProvider).then(async cred => {
                let userExists = await userWithIDExists(cred.user.uid)
                if (!userExists) {
                  await setUser(cred.user.uid, {
                    name: cred.user.uid,
                    displayName: cred.user.displayName || 'Anonymous',
                    about: 'Nothing to say about you.',
                    posts: [],
                    photo: generateDiceBearAvatar(cred.user.uid),
                    readingList: [],
                  })
                }
              })
            }}
          >
            Google Sign In
          </Button>
          <Button
            onClick={() => {
              const githubAuthProvider = new firebase.auth.GithubAuthProvider()
              auth.signInWithPopup(githubAuthProvider).then(async cred => {
                let userExists = await userWithIDExists(cred.user.uid)

                console.log(cred.user)

                if (!userExists) {
                  await setUser(cred.user.uid, {
                    name: cred.user.uid,
                    displayName: cred.user.displayName || 'Anonymous',
                    about: 'Nothing to say about you.',
                    posts: [],
                    photo: generateDiceBearAvatar(cred.user.uid),
                    readingList: [],
                  })
                }
              })
            }}
          >
            GitHub Sign In
          </Button>
        </div>
      )}
      <div
        css={css`
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: -1;
        `}
      >
        <PeepWalk height="450px" width="100%" />
      </div>
    </div>
  )
}

Home.getLayout = function HomeLayout(page) {
  return (
    <Container maxWidth="420px">
      <Head>
        {meta({
          title: 'Bublr - A Minimal Writing Community',
          description:
            'Bublr is an open-source, ultra-minimal community for writers to share their thoughts, stories, and ideas without ads or paywalls.',
          url: '/',
          image: '/images/socials.png',
        })}
        <link rel="canonical" href="https://bublr.life/" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://bublr.life/",
            "name": "Bublr",
            "description": "An open-source, ultra-minimal community for writers to share their thoughts, stories, and ideas without ads or paywalls.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://bublr.life/{search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }} />
      </Head>
      {page}
    </Container>
  )
}