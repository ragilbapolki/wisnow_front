import {
  http,
  HttpResponse
} from 'msw'
import {
  faker
} from "@faker-js/faker/locale/zh_CN";


const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [

  http.post('/dev-api/user/login', async ({
    request
  }) => {
    const {
      username
    } = await request.json()
    const token = tokens[username]

    // mock error
    if (!token) {
      return HttpResponse({
        code: 60204,
        message: 'Account and password are incorrect.'
      })
    }
    return HttpResponse.json({
      code: 20000,
      body: token
    })
  }),

  http.get('/dev-api/user/info', async ({
    request
  }) => {
    const token = request.headers.get('token')
    const info = users[token]

    // mock error
    if (!info) {
      return HttpResponse({
        code: 50008,
        message: 'Login failed, unable to get user details.'
      })
    }

    return HttpResponse.json({
      code: 20000,
      body: info
    })
  }),

  http.post('/dev-api/user/logout', async () => {
    return HttpResponse.json({
      code: 20000,
      message: 'success'
    })
  }),






];


// return res(
//     ctx.status(200),
//     ctx.delay(1000),
//     ctx.json(
//       Array.from({
//         length: 10
//       }).map(() => ({
//         fullname: faker.person.fullName(),
//         email: faker.internet.email(),
//         avatar: faker.image.avatar(),
//         address: faker.location.streetAddress(),
//       }))
//     )
//   );
// }),
