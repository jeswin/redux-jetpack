import { getState, updateState } from "../redux-jetpack";

export function selectReddit(reddit) {
  updateState(
    "selectedReddit",
    () => reddit,
    "SELECT_REDDIT"
  )
}

export function invalidateReddit(reddit) {
  updateState(
    "postsByReddit",
    state => ({
      ...state,
      [reddit]: { ...state[reddit], didInvalidate: true }
    }),
    "INVALIDATE_REDDIT"
  );
}

export function requestPosts(reddit) {
  updateState(
    "postsByReddit",
    state => ({
      ...state,
      [reddit]: { ...state[reddit], isFetching: true, didInvalidate: false }
    }),
    "REQUEST_POSTS"
  );
}

export function receivePosts(reddit, json) {
  updateState(
    "postsByReddit",
    state => ({
      ...state,
      [reddit]: {
        isFetching: false,
        didInvalidate: false,
        items: json.data.children.map(child => child.data),
        lastUpdated: Date.now()
      }
    }),
    "RECEIVE_POSTS"
  );
}

export async function fetchPosts(reddit) {
  requestPosts(reddit);

  const response = await fetch(`https://www.reddit.com/r/${reddit}.json`);
  const json = await response.json();

  receivePosts(reddit, json)
}

export function shouldFetchPosts(reddit) {
  const postsByReddit = getState(state => state.postsByReddit);

  const posts = postsByReddit[reddit];

  if (!posts) {
    return true;
  }
  if (posts.isFetching) {
    return false;
  }

  return posts.didInvalidate;
}

export function fetchPostsIfNeeded(reddit) {
  if (shouldFetchPosts(reddit)) {
    fetchPosts(reddit);
  }
}
