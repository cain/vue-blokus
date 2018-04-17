import axios from 'axios'
import { API_URL } from '../config'

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
