'use client'
/** @jsxImportSource @emotion/react */
import Link from 'next/link'
import Head from 'next/head'
import { useEffect } from 'react'
import { css } from '@emotion/react'
import { useRouter } from 'next/router'
import { htmlToText } from 'html-to-text'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { createPostForUser } from '../../lib/db'
import { firestore, auth } from '../../lib/firebase'

import Button from '../../components/button'
import Header from '../../components/header'
import Spinner from '../../components/spinner'
import Container from '../../components/container'
import ProfileSettingsModal from '../../components/profile-settings-modal'

function formatDate(date) {
  const year = date.getFullYear()
  let month = '' + (date.getMonth() + 1)
  let day = '' + date.getDate()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [day, month, year].join('-')
}

export default function DashboardComponent() {
  const router = useRouter()

  const [user, userLoading, userError] = useAuthState(auth)
  const [posts, postsLoading, postsError] = useCollectionData(
    firestore.collection('posts').where('author', '==', user ? user.uid : ''),
    { idField: 'id' },
  )

  useEffect(() => {
    console.log(user, userLoading, userError)
    if (!user && !userLoading && !userError) {
      router.push('/')
      return
    }
  }, [router, user, userLoading, userError])

  return <>
    <Header>

      <Link href="/dashboard/list">
        Reading List
      </Link>

     {/*Adds a new Link to the Contact Page*/}

      <Link href="https://linktr.ee/theabyssofficial">
        Contact
      </Link>

      <ProfileSettingsModal Trigger={() => 'Profile'} uid={user?.uid} />

      <button onClick={() => auth.signOut()}>Sign Out</button>
    </Header>

    {userError || postsError ? (
      <>
        <p>Oop, we&apos;ve had an error:</p>
        <pre>{JSON.stringify(error)}</pre>
      </>
    ) : user && posts ? (
      <>
        <Button
          outline
          css={css`
            font-size: 0.9rem;
            margin-right: auto;
          `}
          onClick={async () => {
            const newPostsId = await createPostForUser(user.uid)
            router.push(`/dashboard/${newPostsId}`)
          }}
        >
          Write A Post
        </Button>

        <div style={{ display: 'inline-flex', textAlign: 'center', position: 'relative', left: '9.8rem', bottom: '1.8rem' }}>
        <p>//</p>
        </div>

         <Link href="https://theabyss.ink/solomonlijo/guideofabyss" legacyBehavior>
          <Button 
            style={{
                      position: 'relative',
                      bottom: '3.6rem',
                      left: '12rem'
                    }}
            outline
            css={css`
                      font-size: 0.9rem;
                        margin-right: auto;
                `}
            >
            Guide Me
          </Button>
        </Link>

        {posts.length === 0 ? (
          <p
            css={css`
              margin-top: .1rem;
            `}
          >
            Welcome to the Abyss! 🔥 A Beautiful Place to Free your Mind ✨
          </p>
        ) : (
          <ul
            css={css`
              margin-top: 0rem;
              list-style: none;
            `}
          >
            {[...posts]
              .sort(
                (a, b) =>
                  b.lastEdited.toDate().getTime() -
                  a.lastEdited.toDate().getTime(),
              )
              .map(post => (
                <li
                  key={post.id}
                  css={css`
                    margin: 2rem 0;
                    display: flex;

                    a {
                      width: 70%;
                      margin-left: auto;
                      display: inline-block;
                      text-decoration: none;
                      color: inherit;
                    }

                    @media (max-width: 720px) {
                      display: block;
                      margin: 2rem 0;

                      a {
                        width: 100%;
                        margin: 0;
                      }

                      p {
                        margin-bottom: 0.75rem;
                      }
                    }
                  `}
                >
                  <p
                    css={css`
                      font-size: 0.9rem;
                      color: var(--grey-3);
                    `}
                  >
                    <time>{formatDate(post.lastEdited.toDate())}</time>
                  </p>
                  <Link href={`/dashboard/${post.id}`}>

                    {!post.published && (
                      <span
                        css={css`
                          display: inline-block;
                          background: var(--grey-2);
                          color: var(--grey-4);
                          opacity: 0.7;
                          padding: 0.25rem;
                          border-radius: 0.25rem;
                          font-size: 0.9rem;
                        `}
                      >
                        DRAFT
                      </span>
                    )}{' '}
                    {post.title ? htmlToText(post.title) : 'Untitled'}

                  </Link>
                </li>
              ))}
          </ul>
        )}
      </>
    ) : (
      <Spinner />
    )}
  </>;
}

DashboardComponent.getLayout = function DashboardComponentLayout(page) {
  return (
    <Container
      maxWidth="640px"
      css={css`
        margin-top: 5rem;
      `}
    >
      <Helmet>
  <title>DashboardComponent / The Abyss</title>
</Helmet>
      {page}
    </Container>
  )
}
