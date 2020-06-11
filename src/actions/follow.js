import {yujinserver} from '../restfulapi'

export const requestFollow = (userId) => {
  return (dispatch) => {
    dispatch(followFetching())
    return fetch(yujinserver+"/user/"+userId+"/follow", {
      method: 'POST',
      credentials: 'include',
    })
    .then(
      response => response.text(),
      error => dispatch(followFailure())
    )
    .then((text) => {
      if(text === "success") dispatch(followSuccess(userId))
      else dispatch(followFailure())
    })
  }
}

export const requestUnfollow = (userId) => {
  return (dispatch) => {
    dispatch(followFetching())
    return fetch(yujinserver+"/user/"+userId+"/follow", {
      method: 'DELETE',
      credentials: 'include',
    })
    .then(
      response => response.text(),
      error => dispatch(followFailure())
    )
    .then((text) => {
      if(text === "success") dispatch(unfollowSuccess(userId))
      else dispatch(followFailure())
    })
  }
}

export const followInitialization = () => ({
  type: 'FOLLOW_INITIALIZATION'
})

export const followSetList = (users) => ({
  type: 'FOLLOW_SET_LIST', users
})

export const followFetching = () => ({
  type: 'FOLLOW_FETCHING'
})

export const followSuccess = (userId) => ({
    type: 'FOLLOW_SUCCESS', userId
})

export const followFailure = () => ({
    type: 'FOLLOW_FAILURE'
})

export const unfollowSuccess = (userId) => ({
  type: 'UNFOLLOW_SUCCESS', userId
})