<template>
  <div class="data-item" :class="{active: isActiveItem}" @click="itemClick">
    <div class="item-top">
      <span class="title">{{data.title}}</span>
      <div class="icon">?</div>
      <!-- <span class="activeIcon" v-if="data.isActive"></span> -->
    </div>
    <div class="item-content">
      <span class="dateTitle">{{data.dateTitle}}</span>
      <span class="data">{{data.data | currency}}</span>
      <!-- <span class="rate" :class="{isRise: data.isRise}">{{data.rate}}</span> -->
    </div>
    <!--   {{data.title}}
    {{data.isActive}}
    {{data.dateTitle}}
    {{data.data}}
    {{data.rate}}
    {{data.isRise}} -->
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: null
    },
    isActiveItem: {
      type: Boolean,
      dafault: false
    },
    index: {
      type:Number,
      default: 0
    }
  },
  data() {
    return {

    }
  }, // end data
  methods: {
    itemClick() {
      this.$emit('changeActiveItem', this.index)
    }
  }
}

</script>
<style scoped="scoped">
.data-item {
  cursor: pointer;
  text-align: left;
  display: inline-block;
  margin-right: 20px;
  margin-top: 10px;
  padding-top: 15px;
  padding-left: 40px;
  border: 1px solid rgb(216, 217, 221);
  width: 320px;
  height: 110px;
  background-color: rgb(255, 255, 255);
  position: relative;
}

.data-item.active {
  background-color: rgb(200, 200, 200)
}

.item-top .title {
  font-size: 18px;
  font-weight: bold;
}

.item-top .icon {
  /*  position: absolute;
  right: 40px;
  top: 20px;*/
  display: inline-block;
  width: 15px;
  height: 15px;
  line-height: 18px;
  vertical-align: center;
  text-align: center;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
  background: rgb(169, 169, 169);
  border-radius: 50%;
  margin-left: 10px;
}

.item-content {
  margin-top: 30px;
}

.item-content .dateTitle {
  font-size: 12px;
  color: #888;
}

.item-content .data {
  font-weight: bold;
  font-size: 22px;
}

.item-content .rate {
  font-size: 15px;
  color: rgb(178, 195, 139);
  margin-left: 40px;
}

.item-content .rate.isRise {
  color: rgb(249, 176, 188);
}

</style>
