<template>
  <div>
    <div class="container" :class="{ active: activeBlock !== false}">

      <!-- Player information -->
      <div class="player-info">
        Player ID: {{ player.id }} <br />
        Team: {{ player.team }}
      </div>

      <!-- Click Overlay -->
      <div class="click-overlay" v-if="activeBlock" @click="unselect()">
      </div>

      <!-- Board -->
      <div class="board" :style="{ top: `${3 * GRID_SIZE}px`, left: `${3 * GRID_SIZE}px` }">
        <div v-for="row in rows" v-bind:key="row" class="row">
          <div v-for="col in cols" class="grid" v-bind:key="col">
          </div>
        </div>
      </div>

      <!-- Blocks -->
      <block
        v-for="block in blocks"
        :team="block.team"
        :ref="block._id + block.team"
        :block="block"
        :GRID_SIZE="GRID_SIZE"
        :onClick="selectPiece"
        v-bind:key="block._id + block.team" />

    </div>
  </div>
</template>

<script>
import cursorPosition from '../utilities/cursorPosition'
import roomService from '../services/room.service'
import block from './block'
import config from '../config'
const intersectionWith = require('lodash/intersectionWith')
const isEqual = require('lodash/isEqual')

export default {
  name: 'Board',
  props: ['roomId'],
  components: {
    block
  },
  sockets: {
    connected: function () {
      console.log('socket connected')
    },
    blockMove: function (res) {
      console.log('SOCKET SERVER BLOCK MOVE', res)
      this.moveBlock(res.block)
    }
  },
  data () {
    return {
      GRID_SIZE: config.GRID_SIZE,
      blocks: [],
      rows: Array.apply(null, Array(20)).map(function (x, i) { return i }),
      cols: Array.apply(null, Array(20)).map(function (x, i) { return i }),
      activeBlock: false,
      board: [],
      gridCords: {x: 0, y: 0},
      player: {}
    }
  },
  mounted () {
    this.joinRoom()
    document.addEventListener('mousemove', () => {
      this.controller()
    }, false)
    this.gridCords = {
      x: Math.round(Math.round(Math.round(window.innerWidth / config.GRID_SIZE) / 2 - 10)),
      y: Math.round(Math.round(Math.round(window.innerHeight / config.GRID_SIZE) / 2 - 10))
    }
  },
  methods: {
    controller: function () {
      if (this.activeBlock) {
        // Calculate grid positioning
        const mouse = this.mousePosition()
        const x = Math.round(mouse.x / config.GRID_SIZE)
        const y = Math.round(mouse.y / config.GRID_SIZE)
        const activeBlock = this.blocks.find(x => x._id === this.activeBlock._id)
        // Trigger ONLY on grid change
        if (x === activeBlock.x && y === activeBlock.y) {
          return
        }
        // Set selectedBlock axis
        activeBlock.x = x
        activeBlock.y = y
        this.$socket.emit('block_move', {block: activeBlock, roomId: this.roomId, userId: window.localStorage.getItem('userId')})
      }
    },
    moveBlock: function (block) {
      const blockToMove = this.blocks.find(x => x._id === block._id)
      if (blockToMove.x === block.x && blockToMove.y === block.y) {
        return
      }
      blockToMove.x = block.x
      blockToMove.y = block.y
    },
    mousePosition: function () {
      return cursorPosition()
    },
    getActiveElement: function () {
      return this.$refs[this.activeBlock._id + this.activeBlock.team][0].$el
    },
    selectPiece: function (block) {
      if (block._id === this.activeBlock._id) {
        this.unselect()
      } else {
        this.activeBlock = block
        this.$socket.emit('block_select', {block})
      }
    },
    getBlockGrid: function (el) {
      el = el.getBoundingClientRect()
      return {
        left: (el.left + window.scrollX) / config.GRID_SIZE,
        right: (el.right) / config.GRID_SIZE,
        bottom: (el.bottom) / config.GRID_SIZE,
        top: (el.top + window.scrollY) / config.GRID_SIZE
      }
    },
    unselect: function () {
      // find blocks around selected block
      const blocksAround = this.findNearbyBlocks(this.activeBlock)
      console.log(this.isPlacementValid(this.activeBlock, blocksAround))
      // is the placement valid
      if (this.isPlacementValid(this.activeBlock, blocksAround)) {
        this.activeBlock = false
      }
    },
    joinRoom: function () {
      roomService.join({roomId: this.roomId, userId: window.localStorage.getItem('userId')}).then(res => {
        window.localStorage.setItem('userId', res.data.player._id)
        this.player = {
          id: res.data.player._id,
          team: res.data.player.team
        }
        this.blocks = res.data.room.blocks
      })
    },
    findNearbyBlocks: function (block) {
      const areaRadius = 1
      const area = {
        c1: [block.x - areaRadius, block.y - areaRadius],
        c2: [block.x + block.grid.x + areaRadius, block.y + block.grid.y + areaRadius]
      }

      // blocks around active block
      const blocksAround = this.blocks.filter(
        (b) =>
          (b.x + b.grid.x + areaRadius > area.c1[0] && b.x - areaRadius < area.c2[0]) &&
          (b.y + b.grid.y + areaRadius > area.c1[1] && b.y - areaRadius < area.c2[1]) &&
          b._id !== block._id)
      return blocksAround
    },
    isPlacementValid: function (selectedBlock, blocksAround) {
      const arr = []
      const sBpieces = selectedBlock.pieces.map(a =>
        ({ x: a.x + selectedBlock.x, y: selectedBlock.y - a.y + 1 }))

      blocksAround.forEach(block => {
        // times each piece by the grid location to get each piece location
        const pieces1 = block.pieces.map(a =>
          ({ x: a.x + block.x, y: block.y - a.y + 1 }))
        const invalidPieces = intersectionWith(sBpieces, pieces1, isEqual)
        if (invalidPieces.length) arr.push(invalidPieces)
      })
      return arr.length === 0
    }
  },
  computed: {

  }
}
</script>

<style lang="scss" scoped >
$block-size: 20px;
.container {
    height: 100vh;
    width: 100vw;
    position: relative;
}
.grid {
  min-width: $block-size;
  min-height: $block-size;
  font-size: 7px;
  display: inline;
}

.dragging {
  position: absolute;
}

.board {
  outline: 1px solid grey;
  outline-offset: -1px;
  box-shadow: 0px 0px 21px -4px rgba(168, 168, 168, 0.75);
  background-size: 20px 20px;
  position: absolute;
  background-image: linear-gradient(to right, #e7e7e7 1px, transparent 1px), linear-gradient(to bottom, #e7e7e7 1px, transparent 1px);

  // Board colour corners
  .row:last-child .grid:last-child {
    background: rgba(255, 0, 0, 0.45);
  }
  .row:last-child .grid:first-child {
    background: rgba(255, 255, 0, 0.45);
  }
  .row:first-child .grid:first-child {
    background: rgba(0, 255, 0, 0.45);
  }
  .row:first-child .grid:last-child {
    background: rgba(0, 0, 255, 0.45);
  }
}

.player-info {
  position: fixed;
  right: 0;
  text-align: right;
  bottom: 0px;
  text-transform: capitalize;
  font-size: 12px;
}

.dragging .piece, .block:hover {
  opacity: 1;
}

.click-overlay {
  width: 100%;
  position: fixed;
  height: 100%;
  z-index: 999;
  cursor: none;
}
.row {
  display: flex;
  align-items: center;
}
</style>
