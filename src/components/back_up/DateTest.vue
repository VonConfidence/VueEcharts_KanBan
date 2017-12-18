<template>
  <div class="date-test">
    <div class="block">
      <span class="demonstration">请选择日期:  </span>
      <el-date-picker v-model="selectedDateRange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :change="emitDateChange()"
      :editable="false"
      :clearable="false"
      >
      </el-date-picker>
    </div>
  </div>
</template>
<script>
import Config from '@/config/config'

export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      // 默认是最近Config中配置的天数numOfDaysData的数据
      selectedDateRange: [new Date(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * Config.numOfDaysData)), new Date()]
    };
  },

  methods: {
    emitDateChange() {
      console.log(this.selectedDateRange)
      // 触发时间改变的函数
    }
  }
};

</script>
