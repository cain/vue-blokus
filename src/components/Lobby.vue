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
                {{scope.row.name}}
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
                {{ fromAgo(scope.row.updatedAt) }} ago
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
          <el-button @click="createRoomPrompt" size="mini">Create Room</el-button>
        </el-col>
     </el-row>
     <el-footer class="text-center">
     </el-footer>
    </el-row>
</template>

<script>
import RoomService from '../services/room.service'
import { setItem, getItem } from '../utilities/localStorage'
import { distanceInWordsStrict } from 'date-fns'

export default {
  data () {
    return {
      rooms: []
    }
  },
  mounted () {
    this.getRooms()
  },
  methods: {
    fromAgo: function (date) {
      return distanceInWordsStrict(date, new Date())
    },
    joinRoom: function (id) {
      RoomService.join({roomId: id, userId: getItem('userId')}).then(res => {
        setItem('userId', res.data.player._id)
        this.$message({ type: 'success', message: 'You have joined a room' })
        this.$router.push({ path: `/room/${res.data.room._id}` })
      }).catch(e => {
        this.$message({ type: 'error', message: e })
      })
    },
    createRoom: function (roomName) {
      RoomService.create(roomName).then(res => {
        setItem('userId', res.data.userId)
        this.$router.push({ path: `/room/${res.data.room._id}` })
        this.$message({
          type: 'success',
          message: 'You have created a room'
        })
      }).catch(e => {
        this.$message({ type: 'error', message: e })
      })
    },
    getRooms: function () {
      RoomService.getAll().then(res => {
        this.rooms = res.data.rooms
      }).catch(e => {
        this.$message({ type: 'error', message: e })
      })
    },
    createRoomPrompt: function () {
      this.$prompt('', 'Enter a room name', {
        confirmButtonText: 'OK',
        center: true,
        cancelButtonText: 'Cancel'
      }).then(res => {
        this.createRoom(res.value)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
