<template>
  <view class="spot-detail-page">
    <view class="spot-header">
      <image class="spot-banner" :src="spotInfo.image" mode="aspectFill"></image>
      <view class="back-btn" @click="goBack">←</view>
      <view class="spot-title-overlay">
        <view class="spot-name">{{ spotInfo.name }}</view>
        <view class="spot-tags">
          <view class="tag">{{ spotInfo.level }}</view>
          <view class="tag">{{ spotInfo.type }}</view>
        </view>
      </view>
    </view>

    <view class="audio-section">
      <view class="audio-header">
        <view class="audio-title">🎧 语音讲解</view>
        <view class="audio-duration">{{ spotInfo.audioDuration }}</view>
      </view>
      <view class="audio-player">
        <view class="play-control" @click="toggleAudio">
          {{ isPlaying ? '⏸️' : '▶️' }}
        </view>
        <view class="progress-area">
          <view class="progress-bar">
            <view class="progress" :style="{width: audioProgress + '%'}"></view>
            <view class="progress-handle" :style="{left: audioProgress + '%'}"></view>
          </view>
          <view class="time-display">
            <text>{{ currentTime }}</text>
            <text>{{ totalTime }}</text>
          </view>
        </view>
        <view class="audio-speed" @click="changeSpeed">
          {{ speed }}x
        </view>
      </view>
      <view class="audio-script">
        <view class="script-title">讲解文稿</view>
        <view class="script-content">{{ spotInfo.audioScript }}</view>
      </view>
    </view>

    <scroll-view class="content-area" scroll-y>
      <view class="info-cards">
        <view class="info-card">
          <view class="card-icon">🕐</view>
          <view class="card-content">
            <view class="card-label">开放时间</view>
            <view class="card-value">{{ spotInfo.openTime }}</view>
          </view>
        </view>
        <view class="info-card">
          <view class="card-icon">⏱️</view>
          <view class="card-content">
            <view class="card-label">建议游览</view>
            <view class="card-value">{{ spotInfo.suggestTime }}</view>
          </view>
        </view>
        <view class="info-card">
          <view class="card-icon">📍</view>
          <view class="card-content">
            <view class="card-label">距您距离</view>
            <view class="card-value">{{ spotInfo.distance }}m</view>
          </view>
        </view>
        <view class="info-card">
          <view class="card-icon">👥</view>
          <view class="card-content">
            <view class="card-label">当前客流</view>
            <view class="card-value crowd" :class="spotInfo.crowdLevel">
              {{ spotInfo.crowdLevel === 'low' ? '舒适' : spotInfo.crowdLevel === 'medium' ? '适中' : '拥挤' }}
            </view>
          </view>
        </view>
      </view>

      <view class="intro-section">
        <view class="section-title">景点介绍</view>
        <view class="intro-content">{{ spotInfo.intro }}</view>
      </view>

      <view class="highlights-section">
        <view class="section-title">参观亮点</view>
        <view class="highlight-list">
          <view class="highlight-item" v-for="(item, index) in spotInfo.highlights" :key="index">
            <view class="highlight-num">{{ index + 1 }}</view>
            <view class="highlight-text">{{ item }}</view>
          </view>
        </view>
      </view>

      <view class="gallery-section">
        <view class="section-title">实景图集</view>
        <view class="gallery-grid">
          <image 
            class="gallery-item" 
            v-for="(img, index) in spotInfo.gallery" 
            :key="index"
            :src="img"
            mode="aspectFill"
            @click="previewImage(index)"
          ></image>
        </view>
      </view>

      <view class="location-section">
        <view class="section-title">位置信息</view>
        <view class="map-preview">
          <image class="map-img" src="https://picsum.photos/700/300?map" mode="aspectFill"></image>
          <view class="location-info">
            <view class="location-address">📍 {{ spotInfo.address }}</view>
            <view class="location-nav" @click="startNavigation">开始导航</view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="bottom-action">
      <view class="action-btn route-btn" @click="addToRoute">
        🧭 加入游览路线
      </view>
      <view class="action-btn nav-btn" @click="startNavigation">
        🚶 立即导航
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isPlaying: false,
      audioProgress: 35,
      currentTime: '01:23',
      totalTime: '04:05',
      speed: 1.0,
      spotInfo: {
        name: '主展馆大楼',
        image: 'https://picsum.photos/750/400?spot=1',
        level: '5A景区',
        type: '核心景点',
        audioDuration: '4分05秒',
        openTime: '08:30 - 18:00',
        suggestTime: '45-60分钟',
        distance: 150,
        crowdLevel: 'high',
        address: '北京市朝阳区文化园区A区1号',
        audioScript: '欢迎来到主展馆大楼！这里是整个文化园区的核心建筑，建筑面积达5万平方米。您现在看到的这座建筑采用了传统与现代相结合的设计理念，曾获得多项建筑设计大奖。馆内收藏有各类珍贵文物逾万件，其中国家一级文物超过300件...',
        intro: '主展馆大楼是文化园区的标志性建筑，采用"天圆地方"的设计理念，融合传统建筑美学与现代工程技术。大楼共五层，设有常设展厅8个，临展厅3个，常年举办各类高品质文化展览，是了解中华五千年文明的重要窗口。',
        highlights: [
          '镇馆之宝——司母戊鼎复制品展示',
          '沉浸式环幕影院体验',
          'VR穿越古代都城互动',
          '文物修复现场观摩区'
        ],
        gallery: [
          'https://picsum.photos/200/200?g=1',
          'https://picsum.photos/200/200?g=2',
          'https://picsum.photos/200/200?g=3',
          'https://picsum.photos/200/200?g=4',
          'https://picsum.photos/200/200?g=5',
          'https://picsum.photos/200/200?g=6'
        ]
      }
    }
  },
  onLoad(options) {
    if (options.name) {
      this.spotInfo.name = options.name
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    toggleAudio() {
      this.isPlaying = !this.isPlaying
      uni.showToast({ 
        title: this.isPlaying ? '开始播放' : '已暂停', 
        icon: 'none',
        duration: 1000
      })
    },
    changeSpeed() {
      const speeds = [0.75, 1.0, 1.25, 1.5, 2.0]
      const idx = speeds.indexOf(this.speed)
      this.speed = speeds[(idx + 1) % speeds.length]
      uni.showToast({ title: `${this.speed}倍速`, icon: 'none' })
    },
    previewImage(index) {
      uni.previewImage({
        urls: this.spotInfo.gallery,
        current: index
      })
    },
    startNavigation() {
      uni.showToast({ title: '启动导航到景点', icon: 'none' })
    },
    addToRoute() {
      uni.showToast({ title: '已加入智能游览路线', icon: 'success' })
    }
  }
}
</script>

<style scoped>
.spot-detail-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 130rpx;
}

.spot-header {
  position: relative;
  height: 450rpx;
}

.spot-banner {
  width: 100%;
  height: 100%;
}

.back-btn {
  position: absolute;
  top: 60rpx;
  left: 30rpx;
  width: 70rpx;
  height: 70rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 36rpx;
  z-index: 10;
}

.spot-title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
}

.spot-name {
  font-size: 38rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
}

.spot-tags {
  display: flex;
  gap: 15rpx;
}

.tag {
  padding: 6rpx 16rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
  font-size: 22rpx;
}

.audio-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: -20rpx 20rpx 20rpx;
  border-radius: 20rpx;
  padding: 25rpx;
  position: relative;
  z-index: 10;
}

.audio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  margin-bottom: 20rpx;
}

.audio-title {
  font-size: 30rpx;
  font-weight: 500;
}

.audio-duration {
  font-size: 24rpx;
  opacity: 0.8;
}

.audio-player {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.play-control {
  width: 80rpx;
  height: 80rpx;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
}

.progress-area {
  flex: 1;
}

.progress-bar {
  position: relative;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4rpx;
  margin-bottom: 10rpx;
}

.progress {
  height: 100%;
  background: #fff;
  border-radius: 4rpx;
}

.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 24rpx;
  height: 24rpx;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.time-display {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.8);
  font-size: 22rpx;
}

.audio-speed {
  width: 70rpx;
  height: 50rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 25rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24rpx;
}

.audio-script {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12rpx;
  padding: 20rpx;
}

.script-title {
  color: #fff;
  font-size: 26rpx;
  margin-bottom: 10rpx;
}

.script-content {
  color: rgba(255, 255, 255, 0.85);
  font-size: 24rpx;
  line-height: 1.6;
}

.content-area {
  height: calc(100vh - 450rpx - 220rpx - 130rpx);
}

.info-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15rpx;
  padding: 0 20rpx 20rpx;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 15rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
}

.card-icon {
  font-size: 40rpx;
}

.card-label {
  font-size: 22rpx;
  color: #888;
  margin-bottom: 6rpx;
}

.card-value {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
}

.card-value.crowd.high {
  color: #ff4d4f;
}

.card-value.crowd.medium {
  color: #faad14;
}

.card-value.crowd.low {
  color: #52c41a;
}

.intro-section,
.highlights-section,
.gallery-section,
.location-section {
  background: #fff;
  margin: 0 20rpx 20rpx;
  border-radius: 16rpx;
  padding: 25rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 20rpx;
}

.intro-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.8;
}

.highlight-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.highlight-num {
  width: 45rpx;
  height: 45rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: bold;
  flex-shrink: 0;
}

.highlight-text {
  font-size: 26rpx;
  color: #333;
}

.gallery-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10rpx;
}

.gallery-item {
  width: 100%;
  height: 150rpx;
  border-radius: 8rpx;
}

.map-preview {
  position: relative;
  border-radius: 12rpx;
  overflow: hidden;
}

.map-img {
  width: 100%;
  height: 300rpx;
}

.location-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.location-address {
  font-size: 26rpx;
  color: #333;
}

.location-nav {
  padding: 10rpx 20rpx;
  background: #007aff;
  color: #fff;
  border-radius: 30rpx;
  font-size: 24rpx;
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  gap: 20rpx;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.action-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.route-btn {
  background: #f5f7fa;
  color: #333;
}

.nav-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}
</style>
