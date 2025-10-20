import request from '@/utils/request'

// login user
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// ambil info user
export function getInfo(token) {
  return request({
    url: '/user',
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// logout
export function logout(token) {
  return request({
    url: '/logout',
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
