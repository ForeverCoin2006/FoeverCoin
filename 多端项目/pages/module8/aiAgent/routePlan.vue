<template>
  <view class="page">
    <view class="route-plan">
      <text class="title">智能路线规划</text>
      
      <view class="input-area">
        <input v-model="startPoint" placeholder="起点" />
        <input v-model="endPoint" placeholder="终点" />
        <button @click="planRoute">规划路线</button>
      </view>
      
      <view v-if="loading" class="loading">
        <text>规划中...</text>
      </view>
      
      <view v-if="route.length > 0" class="route-result">
        <text class="result-title">推荐路线</text>
        <view v-for="(step, index) in route" :key="index" class="route-step">
          <text class="step-number">{{ index + 1 }}</text>
          <text class="step-info">{{ step }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { callAI } from "@/pages/module8/utils/ai.js";

export default {
  data() {
    return {
      startPoint: "",
      endPoint: "",
      route: [],
      loading: false
    };
  },
  methods: {
    async planRoute() {
      if (!this.startPoint || !this.endPoint) {
        uni.showToast({ title: "请输入起点和终点", icon: "none" });
        return;
      }
      
      this.loading = true;
      try {
        const prompt = `请为从 ${this.startPoint} 到 ${this.endPoint} 规划一条详细的旅游路线，包括沿途景点、预计时间和建议停留时长。`;
        const reply = await callAI(prompt);
        this.route = reply.split('\n').filter(item => item.trim());
      } catch (e) {
        console.error(e);
        uni.showToast({ title: "规划失败，请重试", icon: "none" });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style>
.page {
  padding: 16px;
}

.route-plan {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.input-area {
  margin-bottom: 16px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 14px;
}

button {
  width: 100%;
  padding: 12px;
  background: #007aff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
}

.loading {
  padding: 20px;
  text-align: center;
  color: #666;
}

.route-result {
  margin-top: 20px;
}

.result-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.route-step {
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
}

.step-number {
  width: 24px;
  height: 24px;
  background: #007aff;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 10px;
  flex-shrink: 0;
}

.step-info {
  flex: 1;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
}
</style>