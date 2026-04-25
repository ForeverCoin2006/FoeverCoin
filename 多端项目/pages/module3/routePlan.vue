<template>
  <view class="route-page">
    <view class="header">
      <view class="back-btn" @click="goBack">←</view>
      <view class="header-title">智能路线规划</view>
    </view>

    <view class="route-types">
      <view 
        class="type-tab" 
        v-for="type in routeTypes" 
        :key="type.id"
        :class="{active: selectedType === type.id}"
        @click="selectRouteType(type.id)"
      >
        <view class="type-icon">{{ type.icon }}</view>
        <view class="type-name">{{ type.name }}</view>
      </view>
    </view>

    <scroll-view class="content-area" scroll-y>
      <view class="recommend-routes">
        <view class="route-card" 
              v-for="route in recommendedRoutes" 
              :key="route.id"
              :class="{selected: selectedRoute === route.id}"
              @click="selectRoute(route)">
          <view class="route-header">
            <view class="route-name">{{ route.name }}</view>
            <view class="route-features">
              <view class="feature-tag" v-for="f in route.features" :key="f">{{ f }}</view>
            </view>
          </view>
          
          <view class="route-stats">
            <view class="stat-item">
              <view class="stat-value">{{ route.distance }}</view>
              <view class="stat-label">总路程</view>
            </view>
            <view class="stat-item">
              <view class="stat-value">{{ route.duration }}</view>
              <view class="stat-label">预计时间</view>
            </view>
            <view class="stat-item">
              <view class="stat-value">{{ route.spotCount }}</view>
              <view class="stat-label">景点数量</view>
            </view>
            <view class="stat-item">
              <view class="stat-value">{{ route.steps }}</view>
              <view class="stat-label">预计步数</view>
            </view>
          </view>

          <view class="route-path">
            <view class="path-point" v-for="(spot, idx) in route.spots" :key="spot.id">
              <view class="point-marker">
                <view class="marker-num">{{ idx + 1 }}</view>
              </view>
              <view class="point-info">
                <view class="spot-name">{{ spot.name }}</view>
                <view class="spot-duration">⏱ 建议停留 {{ spot.duration }}</view>
              </view>
              <view class="line" v-if="idx < route.spots.length - 1"></view>
            </view>
          </view>

          <view class="route-footer">
            <view class="difficulty">
              <text>难度：</text>
              <view class="stars">
                ★★★☆☆
              </view>
            </view>
            <view class="suitable">适合：{{ route.suitable }}</view>
          </view>
        </view>
      </view>

      <view class="custom-section">
        <view class="section-title">
          <text>🎯 自定义路线</text>
          <view class="add-btn" @click="addSpots">+ 添加景点</view>
        </view>
        
        <view class="custom-tip" v-if="customSpots.length === 0">
          点击上方按钮添加您感兴趣的景点
        </view>
        
        <view class="custom-list" v-else>
          <view class="custom-item" v-for="(spot, idx) in customSpots" :key="spot.id">
            <view class="item-num">{{ idx + 1 }}</view>
            <view class="item-name">{{ spot.name }}</view>
            <view class="item-remove" @click="removeSpot(idx)">✕</view>
          </view>
          <view class="generate-btn" @click="generateRoute">
            生成我的专属路线
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="bottom-bar" v-if="selectedRoute">
      <view class="route-summary">
        <view class="summary-text">
          已选择：{{ currentRoute.name }}
        </view>
        <view class="summary-detail">
          {{ currentRoute.distance }} · {{ currentRoute.duration }} · {{ currentRoute.spotCount }}个景点
        </view>
      </view>
      <view class="start-btn" @click="startNavigation">
        开始导航
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      selectedType: 1,
      selectedRoute: null,
      routeTypes: [
        { id: 1, name: '经典路线', icon: '⭐' },
        { id: 2, name: '深度游览', icon: '🔍' },
        { id: 3, name: '轻松打卡', icon: '📸' },
        { id: 4, name: '亲子路线', icon: '👨‍👩‍👧' }
      ],
      recommendedRoutes: [
        {
          id: 1,
          name: '经典必游路线',
          features: ['网红打卡', '不走回头路'],
          distance: '2.5km',
          duration: '2.5小时',
          spotCount: 6,
          steps: '3500步',
          suitable: '大多数游客',
          spots: [
            { id: 1, name: '主展馆入口广场', duration: '15分钟' },
            { id: 2, name: '青铜器展厅', duration: '30分钟' },
            { id: 3, name: '书画艺术馆', duration: '30分钟' },
            { id: 4, name: '文化休闲区', duration: '20分钟' },
            { id: 5, name: '数字体验馆', duration: '25分钟' },
            { id: 6, name: '文创商店', duration: '20分钟' }
          ]
        },
        {
          id: 2,
          name: '深度文化之旅',
          features: ['专家推荐', '内涵丰富'],
          distance: '4km',
          duration: '4.5小时',
          spotCount: 9,
          steps: '6000步',
          suitable: '文化爱好者',
          spots: [
            { id: 1, name: '序厅历史长廊', duration: '20分钟' },
            { id: 2, name: '青铜器展厅', duration: '45分钟' },
            { id: 3, name: '陶瓷精品馆', duration: '40分钟' },
            { id: 4, name: '书画艺术馆', duration: '45分钟' },
            { id: 5, name: '非遗活态展示', duration: '30分钟' },
            { id: 6, name: '珍品密室', duration: '30分钟' },
            { id: 7, name: '古籍阅览室', duration: '25分钟' },
            { id: 8, name: '数字体验馆', duration: '25分钟' },
            { id: 9, name: '学术交流中心', duration: '20分钟' }
          ]
        },
        {
          id: 3,
          name: '网红打卡路线',
          features: ['出片率高', '省时省力'],
          distance: '1.5km',
          duration: '1.5小时',
          spotCount: 4,
          steps: '2000步',
          suitable: '拍照达人',
          spots: [
            { id: 1, name: '建筑外景打卡', duration: '20分钟' },
            { id: 2, name: '光影艺术厅', duration: '25分钟' },
            { id: 3, name: '镜花水月装置', duration: '20分钟' },
            { id: 4, name: '星空穹顶剧场', duration: '25分钟' }
          ]
        }
      ],
      customSpots: []
    }
  },
  computed: {
    currentRoute() {
      return this.recommendedRoutes.find(r => r.id === this.selectedRoute) || {}
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    selectRouteType(id) {
      this.selectedType = id
      uni.showToast({ title: `切换至${this.routeTypes.find(t => t.id === id).name}`, icon: 'none' })
    },
    selectRoute(route) {
      this.selectedRoute = route.id
      uni.showToast({ title: `选择：${route.name}`, icon: 'none' })
    },
    addSpots() {
      uni.showToast({ title: '打开景点选择器', icon: 'none' })
    },
    removeSpot(idx) {
      this.customSpots.splice(idx, 1)
    },
    generateRoute() {
      uni.showToast({ title: '正在生成专属路线...', icon: 'none' })
    },
    startNavigation() {
      uni.showToast({ title: '开始导航，祝您游览愉快！', icon: 'success' })
    }
  }
}
</script>

<style scoped>
.route-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 130rpx;
}

.header {
  display: flex;
  align-items: center;
  padding: 60rpx 30rpx 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.back-btn {
  width: 70rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  margin-right: 20rpx;
}

.header-title {
  font-size: 34rpx;
  font-weight: 500;
}

.route-types {
  display: flex;
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 10rpx;
}

.type-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 10rpx;
  border-radius: 12rpx;
  transition: all 0.3s;
}

.type-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.type-tab.active .type-name,
.type-tab.active .type-icon {
  color: #fff;
}

.type-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.type-name {
  font-size: 24rpx;
  color: #666;
}

.content-area {
  height: calc(100vh - 280rpx - 130rpx);
}

.recommend-routes {
  padding: 0 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.route-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 25rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s;
}

.route-card.selected {
  border-color: #007aff;
  background: linear-gradient(to right, #f0f7ff, #fff);
}

.route-header {
  margin-bottom: 25rpx;
}

.route-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx;
}

.route-features {
  display: flex;
  gap: 15rpx;
}

.feature-tag {
  padding: 6rpx 16rpx;
  background: #fff7e6;
  color: #fa8c16;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.route-stats {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  background: #f5f7fa;
  border-radius: 12rpx;
  margin-bottom: 25rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 30rpx;
  font-weight: bold;
  color: #007aff;
  margin-bottom: 6rpx;
}

.stat-label {
  font-size: 22rpx;
  color: #888;
}

.route-path {
  background: #fafafa;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.path-point {
  position: relative;
  display: flex;
  align-items: center;
  padding: 15rpx 0;
}

.point-marker {
  width: 50rpx;
  height: 50rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  z-index: 2;
}

.marker-num {
  color: #fff;
  font-size: 24rpx;
  font-weight: bold;
}

.point-info {
  flex: 1;
}

.spot-name {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 6rpx;
}

.spot-duration {
  font-size: 22rpx;
  color: #888;
}

.line {
  position: absolute;
  left: 24rpx;
  top: 65rpx;
  width: 2rpx;
  height: 50rpx;
  background: #d9d9d9;
  z-index: 1;
}

.route-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.difficulty {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #666;
}

.stars {
  color: #faad14;
  letter-spacing: 4rpx;
}

.suitable {
  font-size: 24rpx;
  color: #888;
}

.custom-section {
  margin: 30rpx 20rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 25rpx;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.add-btn {
  padding: 10rpx 20rpx;
  background: #e8f4ff;
  color: #007aff;
  border-radius: 30rpx;
  font-size: 24rpx;
  font-weight: normal;
}

.custom-tip {
  text-align: center;
  padding: 40rpx;
  color: #999;
  font-size: 26rpx;
}

.custom-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.custom-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #f5f7fa;
  border-radius: 12rpx;
}

.item-num {
  width: 45rpx;
  height: 45rpx;
  background: #007aff;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  margin-right: 20rpx;
}

.item-name {
  flex: 1;
  font-size: 26rpx;
  color: #333;
}

.item-remove {
  width: 45rpx;
  height: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff4d4f;
  font-size: 28rpx;
}

.generate-btn {
  margin-top: 20rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.route-summary {
  flex: 1;
}

.summary-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 6rpx;
}

.summary-detail {
  font-size: 22rpx;
  color: #888;
}

.start-btn {
  width: 200rpx;
  height: 70rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 35rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28rpx;
}
</style>
