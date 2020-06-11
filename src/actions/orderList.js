export const pushToOrderList = (order) => ({
  type: 'PUSH_TO_ORDER_LIST', order
})

export const cleanOrderList = () => ({
  type: 'CLEAN_ORDER_LIST',
})