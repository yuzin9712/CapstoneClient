const init = {
  opened: false,
  list: [],
}

const sketchReducer = (state = init, action) => {
  switch (action.type) {
    case 'SKETCH_HANDLE_DRAWER': 
      return {
        ...state,
        opened: !state.opened
      }
    case 'SKETCH_HANDLE_DRAWER_OPEN':
      return {
        ...state,
        opened: true
      }
    case 'SKETCH_HANDLE_DRAWER_CLOSE':
      return {
        ...state,
        opened: false
      }
    case 'SKETCH_ADD_ITEM': {
      const duplicate = state.list.some((item) => item.src === action.src)
      if(duplicate) return state
      else return {
        ...state,
        list: [...state.list, {
          pid: action.pid,
          color: action.color,
          src: action.src
        }]
      }
    }
    case 'SKETCH_REMOVE_ITEM': {
      // likePost: state.likePost.filter(like => like !== action.postId)
      return {
        ...state,
        list: state.list.filter((item) => item.src !== action.src)
      }
    }
    case 'SKETCH_RESET_ITEMS': 
      return {
        ...state,
        list: []
      }
    default:
      return state
  }
}

export default sketchReducer
