// https://velopert.com/1967
import {yujinserver} from '../restfulapi'
import { designInitialization, designSetLikeList } from './design'
import { followInitialization, followSetList } from './follow'
import { postSetLikeList } from './postlike'

export const requestLogin = (email, password) => {
  return (dispatch) => {
    dispatch(login());
    return fetch(yujinserver+"/auth/login", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
        'Cache': 'no-cache'
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
      credentials: 'include',
    })
    .then(
      res => res.json(),
      err => {console.error(err); return dispatch(loginFailure())}
    )
    .then((data) => {
      if(data.loginStatus) {
        dispatch(designSetLikeList(data.designLike))
        dispatch(postSetLikeList(data.postLike))
        dispatch(followSetList(data.followingInfo))
        return dispatch(loginSuccess(data.name, data.id, data.shopStatus))
      }
      else return dispatch(loginFailure());
    })
  }
}

export const fetchLoginStatus = (initialId) => {
  return (dispatch) => {
    dispatch(login());
    return fetch(yujinserver+"/auth/status", {
      credentials: 'include',
    })
    .then(
      res => res.json(),
      err => {console.error(err);}
    )
    .then(data => {
      if(data.loginStatus){
        dispatch(designSetLikeList(data.designLike))
        dispatch(postSetLikeList(data.postLike))
        dispatch(followSetList(data.followingInfo))
        return dispatch(loginSuccess(data.name, data.id, data.shopStatus))
      }
      else if(initialId !== -1){
        return dispatch(loginFailure())
      }
      else return dispatch(loginStatusNotFound())
    })
  }
}

export const requestLogout = () => {
  return (dispatch) => {
    dispatch(login());
    return fetch((yujinserver+"/auth/logout"), {
      credentials: 'include',
    })
    .then(
      res => res.json(),
      err => {console.error(err); return dispatch(loginFailure())}
    )
    .then(data => {
      if(data.loginStatus){
        dispatch(designInitialization())
        dispatch(followInitialization())
        return dispatch(logoutSuccess())
      }
      else return dispatch(loginFailure())
    })
  }
}

export const getLoginStatus = () => ({
  type: 'AUTH_LOGIN_STATUS',
})

export const login = () => ({
  type: 'AUTH_LOGIN',
})

export const loginSuccess = (name, id, shopAdmin) => ({
  type: 'AUTH_LOGIN_SUCCESS', name, id, shopAdmin
})

export const loginFailure = () => ({
  type: 'AUTH_LOGIN_FAILURE',
})

export const loginStatusNotFound = () => ({
  type: 'AUTH_LOGIN_STATUS_NOT_FOUND'
})

export const logoutSuccess = () => ({
  type: 'AUTH_LOGOUT',
})