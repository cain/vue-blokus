import axios from 'axios'
const API_URL = process.env.API_URL

export default function (type, route, data) {
  return new Promise(function (resolve, reject) {
    axios[type](API_URL + route, data)
      .then(res => resolve(res))
      .catch(err => reject({ ...err }.response.data.message))
  })
}

export const TYPES = {
  GET: 'get',
  POST: 'post'
}
