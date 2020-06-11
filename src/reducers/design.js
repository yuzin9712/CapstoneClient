const init = {
  fetching: "INIT",
  likeDesign: [],
}

const designReducer = (state = init, action) => {
    switch (action.type) {
        case 'DESIGN_INITIALIZATION': 
            return init
        case 'DESIGN_SET_LIKE_LIST': 
            return {
                ...state,
                fetching: "SUCCESS",
                likeDesign: action.designs
            }
        case 'DESIGN_LIKE_SUCCESS':
            return {
                ...state,
                fetching: "SUCCESS",
                likeDesign: [...state.likeDesign, action.designId]
            }
        case 'DESIGN_LIKE_FAILURE':
            return {
                ...state,
                fetching: "FAILURE",
            }
        case 'DESIGN_LIKE_CANCEL_SUCCESS':
            return {
                ...state,
                fetching: "SUCCESS",
                likeDesign: state.likeDesign.filter(like => like !== action.designId)
            }
        default:
            return state
    }
  }

export default designReducer