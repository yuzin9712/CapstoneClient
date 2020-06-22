import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import sketchReducer from './sketch'
import orderListReducer from './orderList'
import designReducer from './design'
import postReducer from './postlike'
import followReducer from './follow'
import authReducer from './auth'

const rootReducer = (history) => combineReducers({
  sketch: sketchReducer,
  orderList: orderListReducer,
  auth: authReducer,
  design: designReducer,
  post: postReducer,
  follow: followReducer,
  router: connectRouter(history)
})

export default rootReducer
