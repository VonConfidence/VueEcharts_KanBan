<template>
  <div id="app">
    <!-- 123 -->
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'app',
  data() {
    return {

    }
  },
  mounted() {
    // this.$router.push({name: 'NavMenu'})
  },
  methods: {

  }
}

</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*  margin-top: 60px;*/
}

.chart-container {
  text-align: left;
  position: relative;
  margin-top: 20px;
}

.chart-container .chart-header {
  height: 50px;
  line-height: 50px;
  padding-left: 50px;
  background: rgb(241, 245, 248);
}

.chart-container .chart-date-picker {
  display: inline-block;
  position: absolute;
  right: 50px;
}

.chart-container .chart-date-picker .demonstration {
  padding-right: 10px;
}

.chart-main {
  width: 100%;
}

.chart-main .chart-content {
  /*border: 1px solid #666;*/
  height: 400px;
  margin-top: 10px;
}

</style>
