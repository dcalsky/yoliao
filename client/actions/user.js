import { createAction } from 'redux-actions'


export const syncUser = createAction('sync user')
export const login = createAction('login')
export const register = createAction('register')
export const logout = createAction('logout')
export const updateInfo = createAction('update info')
export const getOrder = createAction('get order')
export const updatePassword = createAction('update password')