<template>
  <view class="page">
    <view class="map-area">
      <text>定位讲解已启动（真机测试）</text>
    </view>

    <view v-if="activeSpot" class="popup">
      <text class="title">{{ activeSpot.name }}</text>
      <text class="brief">{{ activeSpot.brief }}</text>
      <button @click="playAudio">播放讲解</button>
      <button @click="closePopup">关闭</button>
    </view>
  </view>
</template>

<script>
import { callAI } from "@/pages/module8/utils/ai.js";

const spots = [
  { id: "spot1", name: "太和殿", lat: 39.916, lng: 116.397, audio: "", brief: "太和殿是故宫三大殿之一..." },
  { id: "spot2", name: "午门", lat: 39.915, lng: 116.3975, audio: "", brief: "午门是故宫正门..." }
];

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export default {
  data() {
    return { activeSpot: null, lastTriggered: {} };
  },
  onShow() {
    this.startLocate();
  },
  onHide() {
    this.stopLocate();
  },
  methods: {
    startLocate() {
      // 检查定位权限
      uni.getSetting({
        success: (res) => {
          if (!res.authSetting['scope.userLocation']) {
            uni.authorize({
              scope: 'scope.userLocation',
              success: () => {
                this.startLocationTimer();
              },
              fail: () => {
                uni.showToast({ title: "需要定位权限才能使用智能导览", icon: "none" });
                uni.openSetting({
                  success: (res) => {
                    if (res.authSetting['scope.userLocation']) {
                      this.startLocationTimer();
                    }
                  }
                });
              }
            });
          } else {
            this.startLocationTimer();
          }
        }
      });
    },
    startLocationTimer() {
      this.locTimer = setInterval(() => {
        uni.getLocation({
          type: "gcj02",
          success: (res) => this.checkNearby(res.latitude, res.longitude),
          fail: (err) => console.error("定位失败", err)
        });
      }, 10000); // 每10秒检测一次
    },
    stopLocate() {
      clearInterval(this.locTimer);
    },
    async checkNearby(lat, lng) {
      for (const s of spots) {
        const d = getDistance(lat, lng, s.lat, s.lng);
        if (d < 50) {
          const now = Date.now();
          if (!this.lastTriggered[s.id] || now - this.lastTriggered[s.id] > 30000) {
            this.lastTriggered[s.id] = now;
            // 可选：调用 AI 生成更详细讲解
            try {
              const reply = await callAI(`为景点 ${s.name} 生成一段 60 秒的中文讲解，语言生动，适合游客听。`);
              s.brief = reply;
            } catch (e) {
              console.error(e);
            }
            this.activeSpot = s;
            return;
          }
        }
      }
      // 若无附近景点，关闭弹窗
      this.activeSpot = null;
    },
    playAudio() {
      // 若有音频文件，可播放；此处仅示例文本播放
      uni.showToast({ title: "播放讲解（示例）", icon: "none" });
    },
    closePopup() {
      this.activeSpot = null;
    }
  }
};
</script>

<style>
.map-area { padding:12px; background:#f0f0f0; height:60vh; }
.popup { position:fixed; bottom:0; left:0; right:0; background:#fff; padding:12px; border-top-left-radius:8px; border-top-right-radius:8px; box-shadow:0 -2px 8px rgba(0,0,0,0.1); }
.title { font-weight:700; font-size:16px; }
.brief { margin-top:8px; color:#333; }
</style>
