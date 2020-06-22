import {yujinserver} from '../restfulapi'

export const requestPostLikes = (postId) => {
  return (dispatch) => {
    return fetch(yujinserver+"/like/post/"+postId, {
      credentials: 'include',
    })
    .then(
      response => response.text(),
      error => console.error(error)
    )
    .then((text) => {
        if(text === "success") dispatch(postLikeSuccess(postId))
        else dispatch(postLikeFailure())
    })
  }
}

export const requestPostLikesCancel = (postId) => {
  return (dispatch) => {
    return fetch(yujinserver+"/like/post/"+postId, {
      method: 'DELETE',
      credentials: 'include',
    })
    .then(
      response => response.text(),
      error => console.error(error)
    )
    .then((text) => {
        if(text === "success") dispatch(postLikeCancelSuccess(postId))
        else dispatch(postLikeFailure())
    })
  }
}

export const postInitialization = () => ({
  type: 'POST_INITIALIZATION'
})

export const postSetLikeList = (posts) => ({
  type: 'POST_SET_LIKE_LIST', posts
})

export const postLikeSuccess = (postId) => ({
    type: 'POST_LIKE_SUCCESS', postId
})

export const postLikeFailure = () => ({
    type: 'POST_LIKE_FAILURE'
})

export const postLikeCancelSuccess = (postId) => ({
  type: 'POST_LIKE_CANCEL_SUCCESS', postId
})