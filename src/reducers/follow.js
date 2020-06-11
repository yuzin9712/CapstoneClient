const init = {
  fetching: "INIT",
  follow: [],
  follower: [],
}

const followReducer = (state = init, action) => {
    switch (action.type) {
        case 'FOLLOW_INITIALIZATION': 
            return init
        case 'FOLLOW_SET_LIST': 
            return {
                ...state,
                fetching: "SUCCESS",
                follow: action.users
            }
        case 'FOLLOW_FETCHING':
            return {
                ...state,
                fetching: "FETCHING"
            }
        case 'FOLLOW_SUCCESS':
            return {
                ...state,
                fetching: "SUCCESS",
                follow: [...state.follow, action.userId]
            }
        case 'FOLLOW_FAILURE':
            return {
                ...state,
                fetching: "FAILURE",
            }
        case 'UNFOLLOW_SUCCESS':
            return {
                ...state,
                fetching: "SUCCESS",
                follow: state.follow.filter(user => user !== action.userId)
            }
        default:
            return state
    }
  }

export default followReducer