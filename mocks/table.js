import {
  http,
  HttpResponse
} from 'msw'
// import { faker } from "@faker-js/faker/locale/zh_CN";
import {
  faker
} from "@faker-js/faker";

import {
  users
} from './my'
import {
  formatDate
} from '@/utils'






function createRandomUser() {
  return {
    id: faker.string.uuid(),
    author: faker.internet.username(), // before version 9.1.0, use userName()

    title: faker.word.words({
      // count: {
      //   min: 5,
      //   max: 10
      // }
    }),
    status: faker.helpers.arrayElement(['published', 'draft', 'deleted']),
    display_time: formatDate('yyyy-MM-dd hh:mm:ss', faker.date.anytime({
      refDate: '2020-01-01T00:00:00.000Z'
    })), // '2020-12-13T22:45:10.252Z'
    pageviews: faker.number.int({
      max: 5000
    }),

    avatar: faker.image.avatar(),
    // registeredAt: faker.date.past(),
  };
}

const list = faker.helpers.multiple(createRandomUser, {
  count: 30,
});

export default [

  http.get('/dev-api/table/list', async ({
    request
  }) => {
    const token = request.headers.get('token')
    const info = users[token]

    // mock error
    if (!info) {
      return HttpResponse.json({
        code: 50008,
        message: 'Login failed, unable to get user details.'
      })
    }

    return HttpResponse.json({
      code: 20000,
      body: {
        items: list,
        total: list.length,
      }
    })
  }),
]


// const data = Mock.mock({
//   'items|30': [{
//     id: '@id',
//     title: '@sentence(10, 20)',
//     'status|1': ['published', 'draft', 'deleted'],
//     author: 'name',
//     display_time: '@datetime',
//     pageviews: '@integer(300, 5000)'
//   }]
// })

// module.exports = [
//   {
//     url: '/vue-admin-template/table/list',
//     type: 'get',
//     response: config => {
//       const items = data.items
//       return {
//         code: 20000,
//         data: {
//           total: items.length,
//           items: items
//         }
//       }
//     }
//   }
// ]
