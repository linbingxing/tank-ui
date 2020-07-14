import { login, logout, getInfo,refreshToken } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import {deepClone, encryption} from '@/utils/util'
import {getStore, setStore} from '@/utils/store.js'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },

  mutations: {
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token
      setStore({
        name: 'access_token',
        content: state.access_token,
        type: 'session'
      })
    },
    SET_EXPIRES_IN: (state, expires_in) => {
      state.expires_in = expires_in
      setStore({
        name: 'expires_in',
        content: state.expires_in,
        type: 'session'
      })
    },
    SET_REFRESH_TOKEN: (state, rfToken) => {
      state.refresh_token = rfToken
      setStore({
        name: 'refresh_token',
        content: state.refresh_token,
        type: 'session'
      })
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const user = encryption({
        data: userInfo,
        key: '1234567812345678',
        param: ['password']
      })
      const username = user.username.trim()
      const password = user.password
      const code = user.code
      const uuid = user.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.access_token)
          commit('SET_ACCESS_TOKEN', res.access_token)
          commit('SET_REFRESH_TOKEN', res.refresh_token)
          commit('SET_EXPIRES_IN', res.expires_in)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
          const user = res.data.sysUser
          const avatar = user.avatar == "" ? require("@/assets/image/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
          if (res.data.roles && res.data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.data.roles)
            commit('SET_PERMISSIONS', res.data.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.loginName)
          commit('SET_AVATAR', avatar)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

     // 刷新token
     RefreshToken({commit, state}) {
      return new Promise((resolve, reject) => {
        refreshToken(state.refresh_token).then(response => {
          setToken(response.access_token)
          commit('SET_ACCESS_TOKEN', response.access_token)
          commit('SET_REFRESH_TOKEN', response.refresh_token)
          commit('SET_EXPIRES_IN', response.expires_in)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    
    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_ACCESS_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_ACCESS_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
