<template>
  <view class="guide-page">
    <view class="map-container">
      <view class="map-view">
        <image class="map-bg" src="https://picsum.photos/800/600?map" mode="aspectFill"></image>
        
        <view class="map-marker" 
              v-for="marker in markers" 
              :key="marker.id"
              :style="{left: marker.x + '%', top: marker.y + '%'}"
              :class="{active: selectedMarker === marker.id}"
              @click="selectMarker(marker)">
          <view class="marker-pin">
            <view class="marker-icon">{{ marker.icon }}</view>
          </view>
          <view class="marker-label">{{ marker.name }}</view>
        </view>

        <view class="heat-overlay" v-if="showHeatmap">
          <view class="heat-point" v-for="heat in heatPoints" :key="heat.id"
                :style="{left: heat.x + '%', top: heat.y + '%', opacity: heat.intensity}">
          </view>
        </view>
      </view>

      <view class="map-controls">
        <view class="control-btn" @click="zoomIn">➕</view>
        <view class="control-btn" @click="zoomOut">➖</view>
        <view class="control-btn" @click="toggleHeatmap">
          {{ showHeatmap ? '🔥' : '🧊' }}
        </view>
        <view class="control-btn" @click="locateMe">📍</view>
      </view>

      <view class="legend-panel">
        <view class="legend-title">人流热力</view>
        <view class="legend-bar">
          <view class="color-block" style="background: #52c41a"></view>
          <view class="color-block" style="background: #faad14"></view>
          <view class="color-block" style="background: #ff4d4f"></view>
        </view>
        <view class="legend-labels">
          <text>舒适</text>
          <text>适中</text>
          <text>拥挤</text>
        </view>
      </view>
    </view>

    <view class="info-panel">
      <view class="quick-actions">
        <view class="action-item" @click="goToRoutePlan">
          <view class="action-icon">🧭</view>
          <view class="action-text">路线规划</view>
        </view>
        <view class="action-item" @click="playAllAudio">
          <view class="action-icon">🎧</view>
          <view class="action-text">语音导览</view>
        </view>
        <view class="action-item" @click="showFacilities">
          <view class="action-icon">🚻</view>
          <view class="action-text">设施服务</view>
        </view>
        <view class="action-item" @click="goToAI">
          <view class="action-icon">🤖</view>
          <view class="action-text">AI助手</view>
        </view>
      </view>

      <view class="section-header">
        <view class="section-title">热门景点</view>
        <view class="section-more" @click="showAllSpots">全部景点 ></view>
      </view>

      <scroll-view class="spots-scroll" scroll-x>
        <view class="spot-card" 
              v-for="spot in spots" 
              :key="spot.id"
              :class="{active: selectedMarker === spot.markerId}"
              @click="goToSpotDetail(spot)">
          <image class="spot-image" :src="spot.image" mode="aspectFill"></image>
          <view class="spot-info">
            <view class="spot-name">{{ spot.name }}</view>
            <view class="spot-meta">
              <view class="distance">📍 {{ spot.distance }}m</view>
              <view class="crowd-level" :class="spot.crowdLevel">
                {{ spot.crowdLevel === 'low' ? '人少' : spot.crowdLevel === 'medium' ? '适中' : '拥挤' }}
              </view>
            </view>
            <view class="open-status" :class="spot.isOpen ? 'open' : 'closed'">
              {{ spot.isOpen ? '开放中' : '已闭馆' }}
            </view>
          </view>
        </view>
      </scroll-view>

      <view class="time-panel">
        <view class="time-title">
          <text>🕐 园区开放时间</text>
          <text class="time-range">08:30 - 18:00</text>
        </view>
        <view class="time-tip">
          停止入场时间: 17:00 | 建议游览时间: 3-4小时
        </view>
        <view class="visitor-count">
          当前在园人数: <text class="highlight">{{ currentVisitors }}</text> 人
        </view>
      </view>
    </view>

    <view class="bottom-bar">
      <view class="bar-item" @click="goToHome">
        <view class="bar-icon">🏠</view>
        <view class="bar-text">首页</view>
      </view>
      <view class="bar-item" @click="goToExhibition">
        <view class="bar-icon">🖼️</view>
        <view class="bar-text">展览</view>
      </view>
      <view class="bar-item active">
        <view class="bar-icon">🗺️</view>
        <view class="bar-text">导览</view>
      </view>
      <view class="bar-item" @click="goToShop">
        <view class="bar-icon">🛒</view>
        <view class="bar-text">商城</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showHeatmap: true,
      selectedMarker: null,
      markers: [
        { id: 1, x: 25, y: 30, name: '主展馆', icon: '🏛️', type: 'building' },
        { id: 2, x: 45, y: 45, name: '文物厅', icon: '🏺', type: 'exhibit' },
        { id: 3, x: 65, y: 25, name: '艺术廊', icon: '🎨', type: 'exhibit' },
        { id: 4, x: 35, y: 65, name: '休息区', icon: '☕', type: 'service' },
        { id: 5, x: 75, y: 55, name: '出口', icon: '🚪', type: 'exit' }
      ],
      heatPoints: [
        { id: 1, x: 28, y: 35, intensity: 0.9 },
        { id: 2, x: 48, y: 48, intensity: 0.7 },
        { id: 3, x: 68, y: 28, intensity: 0.5 },
        { id: 4, x: 40, y: 60, intensity: 0.3 }
      ],
      spots: [
        {
          id: 1,
          markerId: 1,
          name: '主展馆大楼',
          image: 'https://picsum.photos/200/150?s=1',
          distance: 150,
          crowdLevel: 'high',
          isOpen: true
        },
        {
          id: 2,
          markerId: 2,
          name: '青铜器展厅',
          image: 'https://picsum.photos/200/150?s=2',
          distance: 280,
          crowdLevel: 'medium',
          isOpen: true
        },
        {
          id: 3,
          markerId: 3,
          name: '书画艺术馆',
          image: 'https://picsum.photos/200/150?s=3',
          distance: 420,
          crowdLevel: 'low',
          isOpen: true
        },
        {
          id: 4,
          markerId: 4,
          name: '非遗体验区',
          image: 'https://picsum.photos/200/150?s=4',
          distance: 350,
          crowdLevel: 'low',
          isOpen: false
        }
      ],
      currentVisitors: 1256
    }
  },
  methods: {
    selectMarker(marker) {
      this.selectedMarker = marker.id
      uni.showToast({ title: marker.name, icon: 'none' })
    },
    zoomIn() {
      uni.showToast({ title: '放大', icon: 'none', duration: 500 })
    },
    zoomOut() {
      uni.showToast({ title: '缩小', icon: 'none', duration: 500 })
    },
    toggleHeatmap() {
      this.showHeatmap = !this.showHeatmap
      uni.showToast({ 
        title: this.showHeatmap ? '热力图已开启' : '热力图已关闭', 
        icon: 'none' 
      })
    },
    locateMe() {
      uni.showToast({ title: '定位中...', icon: 'none' })
    },
    goToRoutePlan() {
      uni.navigateTo({ url: '/pages/module3/routePlan' })
    },
    playAllAudio() {
      uni.showToast({ title: '开始全景语音导览', icon: 'none' })
    },
    showFacilities() {
      uni.showToast({ title: '显示服务设施', icon: 'none' })
    },
    goToAI() {
      uni.navigateTo({ url: '/pages/module8/aiAgent/aiAgent' })
    },
    showAllSpots() {
      uni.showToast({ title: '查看全部景点列表', icon: 'none' })
    },
    goToSpotDetail(spot) {
      uni.navigateTo({ 
        url: `/pages/module3/spotDetail?id=${spot.id}&name=${spot.name}` 
      })
    },
    goToHome() {
      uni.switchTab({ url: '/pages/index/index' })
    },
    goToExhibition() {
      uni.navigateTo({ url: '/pages/module2/index' })
    },
    goToShop() {
      uni.navigateTo({ url: '/pages/module5/index' })
    }
  }
}
</script>

<style scoped>
.guide-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 120rpx;
}

.map-container {
  position: relative;
  height: 500rpx;
  background: #e8f4f8;
}

.map-view {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.map-bg {
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

.map-marker {
  position: absolute;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -50%);
  transition: all 0.3s;
}

.map-marker.active .marker-pin {
  transform: scale(1.2);
}

.marker-pin {
  width: 60rpx;
  height: 60rpx;
  background: #007aff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.4);
  border: 4rpx solid #fff;
}

.marker-icon {
  font-size: 28rpx;
}

.marker-label {
  margin-top: 6rpx;
  padding: 6rpx 12rpx;
  background: #fff;
  border-radius: 8rpx;
  font-size: 20rpx;
  color: #333;
  white-space: nowrap;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.heat-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.heat-point {
  position: absolute;
  width: 120rpx;
  height: 120rpx;
  background: radial-gradient(circle, #ff4d4f 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.map-controls {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  z-index: 20;
}

.control-btn {
  width: 70rpx;
  height: 70rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.legend-panel {
  position: absolute;
  left: 20rpx;
  top: 20rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12rpx;
  padding: 15rpx 20rpx;
  z-index: 20;
}

.legend-title {
  font-size: 22rpx;
  font-weight: 500;
  margin-bottom: 10rpx;
}

.legend-bar {
  display: flex;
  height: 12rpx;
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: 6rpx;
}

.color-block {
  flex: 1;
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  font-size: 18rpx;
  color: #666;
}

.info-panel {
  background: #fff;
  border-radius: 30rpx 30rpx 0 0;
  margin-top: -20rpx;
  position: relative;
  z-index: 30;
  padding: 30rpx;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.action-icon {
  width: 90rpx;
  height: 90rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-bottom: 10rpx;
}

.action-text {
  font-size: 24rpx;
  color: #666;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.section-more {
  font-size: 24rpx;
  color: #007aff;
}

.spots-scroll {
  white-space: nowrap;
  margin-bottom: 30rpx;
}

.spot-card {
  display: inline-flex;
  width: 280rpx;
  margin-right: 20rpx;
  background: #f9f9f9;
  border-radius: 16rpx;
  overflow: hidden;
  border: 2rpx solid transparent;
}

.spot-card.active {
  border-color: #007aff;
  background: #f0f7ff;
}

.spot-image {
  width: 100rpx;
  height: 100rpx;
}

.spot-info {
  flex: 1;
  padding: 15rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.spot-name {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
}

.spot-meta {
  display: flex;
  justify-content: space-between;
  font-size: 22rpx;
  color: #888;
}

.crowd-level.high {
  color: #ff4d4f;
}

.crowd-level.medium {
  color: #faad14;
}

.crowd-level.low {
  color: #52c41a;
}

.open-status {
  font-size: 20rpx;
  padding: 2rpx 10rpx;
  border-radius: 20rpx;
  align-self: flex-start;
}

.open-status.open {
  background: #e8f5e9;
  color: #52c41a;
}

.open-status.closed {
  background: #fff2e8;
  color: #fa8c16;
}

.time-panel {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 16rpx;
  padding: 25rpx;
}

.time-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 15rpx;
}

.time-range {
  color: #007aff;
  font-weight: bold;
}

.time-tip {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 15rpx;
}

.visitor-count {
  font-size: 24rpx;
  color: #333;
}

.highlight {
  color: #ff4d4f;
  font-weight: bold;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #fff;
  display: flex;
  border-top: 1rpx solid #eee;
  z-index: 100;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.bar-item.active {
  color: #007aff;
}

.bar-icon {
  font-size: 40rpx;
  margin-bottom: 4rpx;
}

.bar-text {
  font-size: 20rpx;
}
</style>
