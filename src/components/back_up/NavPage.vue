<template>
  <div id="nav-header">
    <el-tabs type="border-card">
      <el-tab-pane label="平均消息" class="tab-pane">
        <slot name="average_msg"></slot>
      </el-tab-pane>
      <el-tab-pane label="当前消息数" class="tab-pane">
        <slot name="current_msg"></slot>
      </el-tab-pane>
      <el-tab-pane label="聊天室" class="tab-pane">
        <slot name="chatmsg"></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  }
}

</script>
<style>
#nav-header {
  min-height: 380px;
}
#nav-header ,tab-pane{
  text-align: left;
}
#nav-header  .el-tabs__item {
  width: 150px;
  height: 50px;
  line-height: 50px;
}

</style>
