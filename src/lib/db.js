import firebase, { firestore } from './firebase'

// Function to get all users with published posts for sitemap generation
export async function getAllUsersWithPublishedPosts() {
  const usersSnapshot = await firestore.collection('users').get()
  const users = []
  
  for (const userDoc of usersSnapshot.docs) {
    const userData = userDoc.data()
    if (userData.posts && userData.posts.length > 0) {
      // Get all posts for this user
      const postDocs = await Promise.all(
        userData.posts.map(postId => firestore.collection('posts').doc(postId).get())
      )
      
      // Filter to only published posts and extract necessary data
      const publishedPosts = postDocs
        .filter(postDoc => postDoc.exists && postDoc.data().published)
        .map(postDoc => {
          const postData = postDoc.data()
          return {
            id: postDoc.id,
            slug: postData.slug,
            lastEdited: postData.lastEdited,
            title: postData.title // Include title for better SEO
          }
        })
      
      // Only include users who have at least one published post
      if (publishedPosts.length > 0) {
        users.push({
          id: userDoc.id,
          name: userData.name,
          photo: userData.photo, // Include photo for image sitemap
          displayName: userData.displayName, // Include displayName for better titles
          posts: publishedPosts
        })
      }
    }
  }
  
  return users
}

export async function userWithIDExists(id) {
  const doc = await firestore.collection('users').doc(id).get()
  return doc.exists
}

export async function userWithNameExists(name) {
  const query = await firestore
    .collection('users')
    .where('name', '==', name)
    .get()

  return !query.empty
}

export async function getUserByID(id) {
  const doc = await firestore.collection('users').doc(id).get()
  if (!doc.exists) {
    throw { code: 'user/not-found' }
  }

  const user = doc.data()
  const postDocPromises = user.posts.map(postId => getPostByID(postId))
  user.posts = await Promise.all(postDocPromises)

  return { id: doc.id, ...user }
}

export async function getUserByName(name) {
  const query = await firestore
    .collection('users')
    .where('name', '==', name)
    .get()

  if (query.empty || !query.docs[0].exists) {
    throw { code: 'user/not-found' }
  }

  const user = { id: query.docs[0].id, ...query.docs[0].data() }
  const postDocPromises = user.posts.map(postId => getPostByID(postId))
  user.posts = await Promise.all(postDocPromises)

  return user
}

export async function getPostByID(id) {
  const doc = await firestore.collection('posts').doc(id).get()
  if (!doc.exists) {
    throw { code: 'post/not-found' }
  }

  return { id: doc.id, ...doc.data() }
}

export async function removePostForUser(uid, pid) {
  await firestore.collection('posts').doc(pid).delete()
  firestore
    .collection('users')
    .doc(uid)
    .update({ posts: firebase.firestore.FieldValue.arrayRemove(pid) })
}

export async function postWithIDExists(id) {
  const doc = await firestore.collection('posts').doc(id).get()
  return doc.exists
}

export async function postWithUsernameAndSlugExists(username, slug) {
  const user = await getUserByName(username)
  return user.posts.find(post => post.slug === slug)
}

export async function postWithUserIDAndSlugExists(uid, slug) {
  const user = await getUserByID(uid)
  return user.posts.find(post => post.slug === slug)
}

export async function getPostByUsernameAndSlug(username, slug) {
  const user = await getUserByName(username)
  const post = user.posts.find(post => post.slug === slug)
  if (!post) {
    throw { code: 'post/not-found' }
  }

  return post
}

export async function setUser(id, data) {
  await firestore.collection('users').doc(id).set(data)
}

export async function setPost(id, data) {
  await firestore.collection('posts').doc(id).set(data)
}

export async function createPostForUser(userId) {
  const doc = await firestore.collection('posts').add({
    title: '',
    excerpt: '',
    content: '',
    author: userId,
    published: false,
    lastEdited: firebase.firestore.Timestamp.now(),
  })

  await firestore.collection('posts').doc(doc.id).update({ slug: doc.id })

  await firestore
    .collection('users')
    .doc(userId)
    .update({ posts: firebase.firestore.FieldValue.arrayUnion(doc.id) })

  return doc.id
}