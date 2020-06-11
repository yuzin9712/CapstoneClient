const orderListReducer = (state = [], action) => {
    switch (action.type) {
      case 'PUSH_TO_ORDER_LIST': 
        return [...state, {
          pid: action.order.pid,
          pname: action.order.pname,
          color: action.order.color,
          size: action.order.size,
          quantity: action.order.quantity,
          price: action.order.price,
          img: action.order.img,
        }];  
      case 'CLEAN_ORDER_LIST':
        return []
      default:
        return state
    }
  }
  
  export default orderListReducer
  