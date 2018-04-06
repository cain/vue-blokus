<template>
    <el-row>
      <el-row>
        <el-col class="text-center" :span="24">
          <small style="color: #606262; margin-top: 100px; width: 100%">Made by <a target="_blank" href="https://github.com/cainhall">cain</a>, source code <a target="_blank" href="https://github.com/cainhall/vue-blokus">github</a></small>
          <h2>
            Blokus
          </h2>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" :offset="4">
          <el-table
          :data="rooms"
          style="">
            <el-table-column
              label="Name">
              <template slot-scope="scope">
                {{scope.row._id}}
              </template>
            </el-table-column>
            <el-table-column
              label="Players">
              <template slot-scope="scope">
                <i class="el-icon-view"></i>
                {{scope.row.players.length}}/4 Players
              </template>
            </el-table-column>
            <el-table-column
              label="Last Update">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                5 minutes ago
              </template>
            </el-table-column>
            <el-table-column
              label="">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  style="float: right;"
                  @click="joinRoom(scope.row._id)">Join</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row class="text-center">
        <el-col :span="24">
          <p>OR</p>
          <el-button @click="createRoom" size="mini">Create Room</el-button>
        </el-col>
     </el-row>
     <el-footer class="text-center">
     </el-footer>
    </el-row>
</template>

<script>
import RoomService from '../services/room.service'

export default {
  data () {
    return {
      roomInput: '',
      responseMessage: '',
      rooms: []
    }
  },
  mounted () {
    this.getRooms()
  },
  methods: {
    joinRoom: function (id) {
      RoomService.join({roomId: id, userId: window.localStorage.getItem('userId')}).then(res => {
        window.localStorage.setItem('userId', res.data.player._id)
        this.$router.push({ path: `/room/${res.data.room._id}` })
      }).catch(e => { this.responseMessage = {...e}.response.data.message })
    },
    createRoom: function () {
      RoomService.create().then(res => {
        window.localStorage.setItem('userId', res.data.userId)
        this.$router.push({ path: `/room/${res.data.room._id}` })
      }).catch(e => { this.responseMessage = {...e}.response.data.message })
    },
    getRooms: function () {
      RoomService.getAll().then(res => {
        this.rooms = res.data.rooms
      }).catch(e => { this.responseMessage = {...e}.response.data.message })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
