export const handleDrawer = () => ({
  type: 'SKETCH_HANDLE_DRAWER',
})

export const handleDrawerOpen = () => ({
  type: 'SKETCH_HANDLE_DRAWER_OPEN',
})

export const handleDrawerClose = () => ({
  type: 'SKETCH_HANDLE_DRAWER_CLOSE',
})

export const sketchAddItem = (pid, color, src) => ({
  type: 'SKETCH_ADD_ITEM', pid, color, src
})

export const sketchRemoveItem = (src) => ({
  type: 'SKETCH_REMOVE_ITEM', src
})

export const sketchResetItems = () => ({
  type: 'SKETCH_RESET_ITEMS'
})