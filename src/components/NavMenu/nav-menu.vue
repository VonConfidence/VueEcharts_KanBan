<template>
  <div class="nav-menu">
    <ul class="nav-ul">
      <li>
        <router-link to="CurrentMsg">当前消息</router-link>
      </li>
      <li>
        <router-link to="AveragePage">平均消息</router-link>
      </li>
      <li>
        <router-link to="MapChart">地图区域消息</router-link>
      </li>
      <!-- <li><a href="/CurrentMsg">当前消息</a></li>
      <li><a href="/AveragePage">平均消息</a></li>
      <li><a href="/MapChart">地图区域消息</a></li> -->
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>
<style scoped>
.nav-ul {
  list-style: none;
  text-align: left;
}

.nav-ul li {
  display: inline-block;
  background: rgb(59, 154, 205);
  padding: 10px;
}

.nav-ul li a {
  text-decoration: none;
  color: white;
}
</style>
