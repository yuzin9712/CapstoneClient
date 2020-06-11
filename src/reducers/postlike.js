const init = {
  fetching: "INIT",
  likePost: [],
}

const postReducer = (state = init, action) => {
    switch (action.type) {
        case 'POST_INITIALIZATION': 
            return init
        case 'POST_SET_LIKE_LIST': 
            return {
                ...state,
                fetching: "SUCCESS",
                likePost: action.posts
            }
        case 'POST_LIKE_SUCCESS':
            return {
                ...state,
                fetching: "SUCCESS",
                likePost: [...state.likePost, action.postId]
            }
        case 'POST_LIKE_FAILURE':
            return {
                ...state,
                fetching: "FAILURE",
            }
        case 'POST_LIKE_CANCEL_SUCCESS':
            return {
                ...state,
                fetching: "SUCCESS",
                likePost: state.likePost.filter(like => like !== action.postId)
            }
        default:
            return state
    }
  }

export default postReducer