import {yujinserver} from '../restfulapi'

export const requestDesignLikes = (designId) => {
  return (dispatch) => {
    return fetch(yujinserver+"/like/design/"+designId, {
      credentials: 'include',
    })
    .then(
      response => response.text(),
      error => console.error(error)
    )
    .then((text) => {
        if(text === "추천 코디 게시물 좋아요 누르기 성공") dispatch(designLikeSuccess(designId))
        else dispatch(designLikeFailure())
    })
  }
}

export const requestDesignLikesCancel = (designId) => {
  return (dispatch) => {
    return fetch(yujinserver+"/like/design/"+designId, {
      method: 'DELETE',
      credentials: 'include',
    })
    .then(
      response => response.text(),
      error => console.error(error)
    )
    .then((text) => {
        if(text === "추천 코디 게시물 좋아요 취소하기 성공") dispatch(designLikeCancelSuccess(designId))
        else dispatch(designLikeFailure())
    })
  }
}

export const designInitialization = () => ({
  type: 'DESIGN_INITIALIZATION'
})

export const designSetLikeList = (designs) => ({
  type: 'DESIGN_SET_LIKE_LIST', designs
})

export const designLikeSuccess = (designId) => ({
    type: 'DESIGN_LIKE_SUCCESS', designId
})

export const designLikeFailure = () => ({
    type: 'DESIGN_LIKE_FAILURE'
})

export const designLikeCancelSuccess = (designId) => ({
  type: 'DESIGN_LIKE_CANCEL_SUCCESS', designId
})