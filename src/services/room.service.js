import axios from 'axios'
import { API_URL } from '../config'

export default {
  join: (data) => axios.get(`${API_URL}/room/join/${data.roomId}${data.userId ? '?userId=' + data.userId : ''}`),
  create: () => axios.get(`${API_URL}/room/create`),
  getRoom: (id) => axios.get(`${API_URL}/room/get/${id}`),
  getAll: (id) => axios.get(`${API_URL}/room/getAll`)
}
