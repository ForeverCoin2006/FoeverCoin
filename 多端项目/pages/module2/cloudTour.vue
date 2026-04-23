<template>
  <view class="cloud-tour-page">
    <view class="player-container">
      <view class="panorama-view">
        <image class="panorama-img" src="https://picsum.photos/800/450?panorama" mode="aspectFill"></image>
        <view class="view-controls">
          <view class="control-btn" @click="toggleMode('panorama')" :class="{active: viewMode === 'panorama'}">
            360°全景
          </view>
          <view class="control-btn" @click="toggleMode('vr')" :class="{active: viewMode === 'vr'}">
            VR模式
          </view>
          <view class="control-btn" @click="toggleMode('guide')" :class="{active: viewMode === 'guide'}">
            自动导览
          </view>
        </view>
        <view class="hotspot" v-for="spot in hotspots" :key="spot.id" 
              :style="{left: spot.x + '%', top: spot.y + '%'}"
              @click="clickHotspot(spot)">
          <view class="spot-pulse"></view>
          <view class="spot-icon">{{ spot.icon }}</view>
        </view>
        <view class="direction-controls">
          <view class="dir-btn up" @click="moveView('up')">↑</view>
          <view class="dir-row">
            <view class="dir-btn" @click="moveView('left')">←</view>
            <view class="dir-btn center" @click="resetView">⬤</view>
            <view class="dir-btn" @click="moveView('right')">→</view>
          </view>
          <view class="dir-btn down" @click="moveView('down')">↓</view>
        </view>
      </view>
    </view>

    <view class="info-panel">
      <view class="panel-header">
        <view class="hall-title">{{ currentHall.name }}</view>
        <view class="hall-switch" @click="showHallSelector = true">
          切换展厅 ▼
        </view>
      </view>

      <scroll-view class="panel-content" scroll-y>
        <view class="intro-section">
          <view class="section-label">展厅介绍</view>
          <view class="intro-text">{{ currentHall.intro }}</view>
        </view>

        <view class="audio-section" v-if="currentHall.audioUrl">
          <view class="section-label">语音讲解</view>
          <view class="audio-player">
            <view class="play-btn" @click="toggleAudio">
              {{ isPlaying ? '⏸️' : '▶️' }}
            </view>
            <view class="progress-bar">
              <view class="progress" :style="{width: audioProgress + '%'}"></view>
            </view>
            <view class="time-display">{{ audioTime }}</view>
          </view>
        </view>

        <view class="exhibits-section">
          <view class="section-label">展厅展品</view>
          <view class="exhibit-list">
            <view class="exhibit-item" v-for="item in currentHall.exhibits" :key="item.id" @click="viewExhibit(item)">
              <image class="exhibit-img" :src="item.image" mode="aspectFill"></image>
              <view class="exhibit-name">{{ item.name }}</view>
            </view>
          </view>
        </view>

        <view class="stats-section">
          <view class="stat-item">
            <view class="stat-value">{{ currentHall.onlineCount }}</view>
            <view class="stat-label">当前在线</view>
          </view>
          <view class="stat-item">
            <view class="stat-value">{{ currentHall.totalViews }}</view>
            <view class="stat-label">累计访问</view>
          </view>
          <view class="stat-item">
            <view class="stat-value">{{ currentHall.exhibitCount }}</view>
            <view class="stat-label">展品数量</view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="hall-selector" v-if="showHallSelector" @click="showHallSelector = false">
      <view class="selector-content" @click.stop>
        <view class="selector-title">选择展厅</view>
        <view class="hall-list">
          <view class="hall-option" 
                v-for="hall in hallList" 
                :key="hall.id"
                :class="{active: hall.id === currentHall.id}"
                @click="selectHall(hall)">
            <image class="hall-thumb" :src="hall.thumb" mode="aspectFill"></image>
            <view class="hall-info">
              <view class="hall-name">{{ hall.name }}</view>
              <view class="hall-desc">{{ hall.shortDesc }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      viewMode: 'panorama',
      isPlaying: false,
      audioProgress: 35,
      audioTime: '01:23',
      showHallSelector: false,
      hotspots: [
        { id: 1, x: 25, y: 45, icon: '🏺', name: '青铜鼎' },
        { id: 2, x: 60, y: 38, icon: '🎨', name: '古画真迹' },
        { id: 3, x: 78, y: 55, icon: '📜', name: '古籍善本' }
      ],
      currentHall: {
        id: 1,
        name: '文物数字馆',
        intro: '文物数字馆采用最新3D扫描技术，高精度还原百余件国宝级文物。通过数字技术，让珍贵文物突破时空限制，观众可在线全方位观赏文物细节，甚至放大观察肉眼难以察觉的纹理。',
        audioUrl: true,
        onlineCount: 156,
        totalViews: '128.5万',
        exhibitCount: 86,
        exhibits: [
          { id: 1, name: '司母戊鼎', image: 'https://picsum.photos/100/100?e=1' },
          { id: 2, name: '清明上河图', image: 'https://picsum.photos/100/100?e=2' },
          { id: 3, name: '四羊方尊', image: 'https://picsum.photos/100/100?e=3' },
          { id: 4, name: '越王勾践剑', image: 'https://picsum.photos/100/100?e=4' }
        ]
      },
      hallList: [
        { id: 1, name: '文物数字馆', shortDesc: '国宝级文物数字化展示', thumb: 'https://picsum.photos/80/80?h=1' },
        { id: 2, name: '艺术沉浸厅', shortDesc: '光影艺术沉浸式体验', thumb: 'https://picsum.photos/80/80?h=2' },
        { id: 3, name: '360°全景展厅', shortDesc: '实景漫游真实场景还原', thumb: 'https://picsum.photos/80/80?h=3' },
        { id: 4, name: '非遗体验馆', shortDesc: '传统技艺互动演示', thumb: 'https://picsum.photos/80/80?h=4' }
      ]
    }
  },
  methods: {
    toggleMode(mode) {
      this.viewMode = mode
      const modeText = { panorama: '360°全景', vr: 'VR模式', guide: '自动导览' }
      uni.showToast({ title: `切换至${modeText[mode]}`, icon: 'none' })
    },
    moveView(dir) {
      uni.showToast({ title: `移动视角: ${dir}`, icon: 'none', duration: 500 })
    },
    resetView() {
      uni.showToast({ title: '重置视角', icon: 'none', duration: 500 })
    },
    clickHotspot(spot) {
      uni.showToast({ title: `查看: ${spot.name}`, icon: 'none' })
    },
    toggleAudio() {
      this.isPlaying = !this.isPlaying
      uni.showToast({ title: this.isPlaying ? '开始播放' : '暂停播放', icon: 'none' })
    },
    viewExhibit(item) {
      uni.showToast({ title: `查看展品: ${item.name}`, icon: 'none' })
    },
    selectHall(hall) {
      this.currentHall.id = hall.id
      this.currentHall.name = hall.name
      this.showHallSelector = false
      uni.showToast({ title: `切换至: ${hall.name}`, icon: 'none' })
    }
  }
}
</script>

<style scoped>
.cloud-tour-page {
  min-height: 100vh;
  background: #1a1a2e;
}

.player-container {
  position: relative;
  height: 420rpx;
  background: #000;
}

.panorama-view {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.panorama-img {
  width: 100%;
  height: 100%;
  filter: brightness(0.85);
}

.view-controls {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  display: flex;
  gap: 15rpx;
  z-index: 10;
}

.control-btn {
  padding: 12rpx 24rpx;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10rpx);
  border-radius: 30rpx;
  color: #fff;
  font-size: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.control-btn.active {
  background: #007aff;
  border-color: #007aff;
}

.hotspot {
  position: absolute;
  z-index: 5;
}

.spot-pulse {
  width: 60rpx;
  height: 60rpx;
  background: rgba(255, 77, 79, 0.4);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.spot-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36rpx;
  height: 36rpx;
  background: #ff4d4f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: #fff;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
}

.direction-controls {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.dir-row {
  display: flex;
  gap: 8rpx;
}

.dir-btn {
  width: 50rpx;
  height: 50rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24rpx;
}

.dir-btn.center {
  background: rgba(0, 122, 255, 0.6);
}

.info-panel {
  background: #fff;
  border-radius: 30rpx 30rpx 0 0;
  margin-top: -20rpx;
  position: relative;
  z-index: 20;
  min-height: calc(100vh - 400rpx);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.hall-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
}

.hall-switch {
  padding: 10rpx 20rpx;
  background: #f5f7fa;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #007aff;
}

.panel-content {
  height: calc(100vh - 500rpx);
  padding: 30rpx;
}

.section-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.intro-section {
  margin-bottom: 30rpx;
}

.intro-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.8;
}

.audio-section {
  margin-bottom: 30rpx;
  padding: 25rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
}

.audio-section .section-label {
  color: #fff;
}

.audio-player {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.play-btn {
  width: 70rpx;
  height: 70rpx;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.progress-bar {
  flex: 1;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4rpx;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #fff;
  border-radius: 4rpx;
}

.time-display {
  color: #fff;
  font-size: 24rpx;
  min-width: 80rpx;
  text-align: right;
}

.exhibits-section {
  margin-bottom: 30rpx;
}

.exhibit-list {
  display: flex;
  gap: 20rpx;
  overflow-x: auto;
  padding-bottom: 10rpx;
}

.exhibit-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120rpx;
}

.exhibit-img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 12rpx;
  margin-bottom: 10rpx;
}

.exhibit-name {
  font-size: 22rpx;
  color: #666;
  text-align: center;
}

.stats-section {
  display: flex;
  justify-content: space-around;
  padding: 25rpx;
  background: #f5f7fa;
  border-radius: 16rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #007aff;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 22rpx;
  color: #888;
}

.hall-selector {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: flex-end;
}

.selector-content {
  width: 100%;
  background: #fff;
  border-radius: 30rpx 30rpx 0 0;
  padding: 30rpx;
  max-height: 80vh;
}

.selector-title {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
}

.hall-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.hall-option {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
}

.hall-option.active {
  border-color: #007aff;
  background: #f0f7ff;
}

.hall-thumb {
  width: 100rpx;
  height: 80rpx;
  border-radius: 8rpx;
}

.hall-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hall-name {
  font-size: 28rpx;
  font-weight: 500;
  margin-bottom: 6rpx;
}

.hall-desc {
  font-size: 22rpx;
  color: #888;
}
</style>
