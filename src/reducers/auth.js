const init = {
    fetching: 'INIT',
    session: "LOGOUT",
    currentUser: '',
    currentId: -1,
}

const authReducer = (state = init, action) => {
    switch (action.type) {
        case 'AUTH_LOGIN':
            return {
                ...state,
                fetching: 'FETCHING',
            }
        case 'AUTH_LOGIN_SUCCESS':
            return {
                fetching: 'SUCCESS',
                session: action.shopAdmin,
                currentUser: action.name,
                currentId: action.id,
            }
        case 'AUTH_LOGIN_FAILURE':
            return {
                fetching: 'FAILURE',
                session: "LOGOUT",
                currentUser: action.name,
                currentId: -1,
            }
        case 'AUTH_LOGIN_STATUS_NOT_FOUND':
            return {
                fetching: 'NOTFOUND',
                session: "LOGOUT",
                currentUser: '',
                currentId: -1,
            }
        case 'AUTH_LOGOUT':
            return {
                fetching: 'SUCCESS',
                session: "LOGOUT",
                currentUser: '',
                currentId: -1,
            }
        default:
            return state
    }
  }
  
  export default authReducer
  