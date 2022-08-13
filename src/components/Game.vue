<template>
  <p>Game template</p>
  <canvas id="gameCanvas" width="100" height="100"></canvas>
</template>

<script>
import { init as GameInit } from '../js/Game.js';

export default {
  name: 'Game',
  props: {
    msg: String
  },
  mounted() {
    GameInit();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#gameCanvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  /* pointer-events: none; */
  image-rendering: pixelated;
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
