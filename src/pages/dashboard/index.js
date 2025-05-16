/** @jsxImportSource @emotion/react */
import Link from 'next/link'
import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
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
import Search from '../../components/search'
import ProfileSettingsModal from '../../components/profile-settings-modal'

function formatDate(date) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

export default function Dashboard() {
  const router = useRouter()

  const [user, userLoading, userError] = useAuthState(auth)
  const [posts, postsLoading, postsError] = useCollectionData(
    firestore.collection('posts').where('author', '==', user ? user.uid : ''),
    { idField: 'id' },
  )
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    console.log(user, userLoading, userError)
    if (!user && !userLoading && !userError) {
      router.push('/')
      return
    }
  }, [router, user, userLoading, userError])

  // Set initial filteredPosts
  useEffect(() => {
    setFilteredPosts(posts)
  }, posts)

  // Get the filtered posts from Search component
  const getFilteredPosts = (fp) => {
    setFilteredPosts(fp)
  }

  // Get the searchInput from Search component
  const getSearchInput = (searchInput) => {
    return searchInput
  }

  return (
    <>
      <Header>

        <Link href="/dashboard/list">
          Reading List
        </Link>

       {/*Adds a new Link to the Contact Page*/}

        <Link href="https://linktr.ee/bublr">
          Contact
        </Link>

        {/* Profile settings */}
        <Link href="#" onClick={() => console.log('Profile clicked')}>
          <ProfileSettingsModal Trigger={() => 'Profile'} uid={user?.uid} />
        </Link>

          {/* Sign out */}
        <Link href="#" onClick={() => auth.signOut()}>
        Sign Out
        </Link>
      </Header>

      {userError || postsError ? (
        <>
        <p>Oop, we&apos;ve had an error:</p>
        <pre>{JSON.stringify(userError || postsError)}</pre>
        </>
    ) : user && filteredPosts && posts ? (
        <>
        <div css={css`
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          width: 100%;
        `}>
          <Button
            outline
            css={css`
              font-size: 1.3rem;
              padding: 0;
              width: 2.15em;
              height: 2.15em;
            `}
            onClick={async () => {
              const newPostsId = await createPostForUser(user.uid)
              router.push(`/dashboard/${newPostsId}`)
            }}
          >
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="21px"
  height="21px"
  fill="none"
  stroke-width="1.5"
  viewBox="0 0 24 24"
  color="#ffffff"
  css={css`
    margin: 0.2em 0 0 0.1em;

    path {
      stroke: black;
    }

    @media (prefers-color-scheme: dark) {
      path {
        stroke: white;
      }
    }
  `}
>
  <path
    stroke="#ffffff"
    stroke-width="1.3"
    stroke-linecap="round"
    stroke-linejoin="round"
    d="m14.363 5.652 1.48-1.48a2 2 0 0 1 2.829 0l1.414 1.414a2 2 0 0 1 0 2.828l-1.48 1.48m-4.243-4.242-9.616 9.615a2 2 0 0 0-.578 1.238l-.242 2.74a1 1 0 0 0 1.084 1.085l2.74-.242a2 2 0 0 0 1.24-.578l9.615-9.616m-4.243-4.242 4.243 4.242"
  ></path>
</svg>
          </Button>

          <Search
            posts={posts}
            isGlobalSearch={false}
            getFilteredPosts={getFilteredPosts}
            getSearchInput={getSearchInput}
            css={css`
              width: 3em
            `}
          ></Search>
          
          <Link href="https://bublr.life/solomonlijo/guideofbublr">
            <Button
              outline
              css={css`
                font-size: 1.3rem;
                padding: 0;
                border-radius: 100%;
                position: fixed;
                bottom: 2em;
                right: 2em;
                width: 2.2em;
                height: 2.2em;
                text-align: center;
              `}
              >
              <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" fill="none" stroke-width="1.5" viewBox="0 0 24 24" color="#ffffff"css={css`
                  margin: 0.25em 0 0 0.05em
                `}><path stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M7.9 8.08c0-4.773 7.5-4.773 7.5 0 0 3.409-3.409 2.727-3.409 6.818M12 19.01l.01-.011"></path>
              </svg>
            </Button>
          </Link>
        </div>
          { posts.length > 0 ?
          <div>
            { filteredPosts?.length === 0 && getSearchInput.length > 0 ? (
              <p
                css={css`
                  margin-top: 2rem;
                `}
              >
                Yep, nothing matches your search results, I wonder why 🤔
              </p>
              ) : (
                <ul
                  css={css`
                    margin-top: 0rem;
                    list-style: none;
                  `}
                >
                  {[...filteredPosts]
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
                          <a>
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
                          </a>
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
          </div>
          :
            <div>
              <p
                css={css`
                  margin-top: 2rem;
                `}
              >
                Welcome to Bublr! 🔥 A Beautiful Place to Free your Mind ✨
              </p>
            </div>
          }
        </>
      ) : (
        <Spinner />
      )}
    </>
  )
}

Dashboard.getLayout = function DashboardLayout(page) {
  return (
    <Container
      maxWidth="640px"
      css={css`
        margin-top: 5rem;
      `}
    >
      <Head>
        <title>Dashboard / Bublr</title>
      </Head>
      {page}
    </Container>
  )
}
