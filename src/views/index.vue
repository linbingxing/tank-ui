<template>
  <div class="dashboard-editor-container">

    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row> -->
    <el-row :gutter="20">
      <el-col>
        <panel-group @handleSetLineChartData="handleSetLineChartData" />
      </el-col>
    </el-row>

    
  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import {validatenull} from '@/utils/validate';
import {getStore} from "@/utils/store.js";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
       //刷新token锁
        refreshLock: false,
        //刷新token的时间
        refreshTime: ''
    }
  },
  created() {
     //实时检测刷新token
      this.refreshToken()
  },
   destroyed() {
      clearInterval(this.refreshTime)
    },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    // 实时检测刷新token
    refreshToken() {
      this.refreshTime = setInterval(() => {
        const token = getStore({
          name: 'access_token',
          debug: true,
        });
        console.log("token=======>"+token)
        if (validatenull(token)) {
          return;
        }

        if (this.expires_in <= 1000 && !this.refreshLock) {
          this.refreshLock = true
          this.$store
            .dispatch('RefreshToken')
            .catch(() => {
              clearInterval(this.refreshTime)
            });
          this.refreshLock = false
        }
        this.$store.commit("SET_EXPIRES_IN", this.expires_in - 10);
      }, 10000);
    }
    
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
