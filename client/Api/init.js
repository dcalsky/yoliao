import AV from 'avoscloud-sdk'

export const init = () => {
  AV.initialize('puVuQSL2x1iceX0V99MXST4p-gzGzoHsz', 'JezXUL3qvLQB04w5vlKbl6Q3')
}

export const User = AV.User()
export const Food = AV.Object.extend('Food')
export const Order = AV.Object.extend('Order')
export const Type = AV.Object.extend('Type')