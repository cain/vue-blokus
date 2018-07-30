import API, { TYPES } from './index'

export default {
  join: data =>
    API(
      TYPES.GET,
      `/room/join/${data.roomId}${data.userId ? '?userId=' + data.userId : ''}`
    ),
  create: roomName =>
    API(
      TYPES.POST,
      '/room/create',
      { roomName }
    ),
  getRoom: id =>
    API(
      TYPES.GET,
      `/room/get/${id}`
    ),
  getAll: id =>
    API(
      TYPES.GET,
      `/room/getAll`
    )
}
