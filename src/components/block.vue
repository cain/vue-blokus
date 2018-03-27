<template>
  <div class="block"
  @click="onClick(block)"
  v-bind:style="{ top: `${block.y * GRID_SIZE}px`, left: `${block.x * GRID_SIZE}px`}">
    <div class="block-id">{{ block._id.slice(block._id.length - 3, block._id.length) }}</div>
    <div class="helper" v-bind:style="{ width: `${(block.grid.x + 10) * GRID_SIZE}px`, height: `${(block.grid.y + 10) * GRID_SIZE}px`, left: `-${((block.grid.x + 10) * GRID_SIZE) / 2 - ((block.grid.x / 2) * GRID_SIZE)}px`, top: `-${((block.grid.y + 5) * GRID_SIZE)}px`}"></div>
    <div
    class="piece"
    v-for="piece in block.pieces"
    v-bind:key="block.id + 'x' + piece.x + 'y' + piece.y"
    v-bind:style="{ left: `${(piece.x - 1) * GRID_SIZE}px`, bottom: `${(piece.y - 1) * GRID_SIZE}px`, background: team }"
    >
    </div>
  </div>
</template>

<script>

export default {
  name: 'block',
  props: ['block', 'GRID_SIZE', 'onClick', 'team']
}
</script>

<style lang="scss">
  $block-size: 20px;
  .helper {
    position: absolute;
    outline: 1px solid rgba(255,0,0,0.2);
    background-size: 20px 20px;
    // background-image: linear-gradient(to right, #e7e7e7 1px, transparent 1px), linear-gradient(to bottom, #e7e7e7 1px, transparent 1px);
  }
  .block-id {
    position: absolute;
    font-size: 10px;
    z-index: 999;
    bottom: -20px;
    left: 0px;
  }
  .block {
    cursor: pointer;
    opacity:1;
    position: relative;
  }
  .piece {
    min-width: $block-size;
    min-height: $block-size;
    background: red;
    color: white;
    font-size: 8px;
    max-width: $block-size;
    position: absolute;
    outline: 1px solid rgba(0,0,0,1);
    outline-offset: -1px;
    box-shadow: 0px 0px 21px -4px rgba(0,0,0,1);
  }
</style>
