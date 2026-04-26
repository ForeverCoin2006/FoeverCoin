<template>
  <view class="exhibition-page">
    <view class="header-banner">
      <image class="banner-img" src="https://picsum.photos/750/300" mode="aspectFill"></image>
      <view class="banner-text">
        <view class="banner-title">智游文创展览中心</view>
        <view class="banner-desc">探索数字文化新体验</view>
      </view>
    </view>

    <scroll-view class="content-area" scroll-y>
      <view class="section digital-hall">
        <view class="section-header">
          <view class="section-title">数字展厅</view>
          <view class="section-more" @click="goToCloudTour">进入云游 ></view>
        </view>
        <view class="hall-grid">
          <view class="hall-card" v-for="hall in digitalHalls" :key="hall.id" @click="openHall(hall)">
            <image class="hall-img" :src="hall.image" mode="aspectFill"></image>
            <view class="hall-info">
              <view class="hall-name">{{ hall.name }}</view>
              <view class="hall-status" :class="hall.status === '开放' ? 'open' : 'close'">
                {{ hall.status }}
              </view>
            </view>
            <view class="hall-tag">VR体验</view>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <view class="section-title">近期展览</view>
          <view class="section-more">查看全部 ></view>
        </view>
        <view class="exhibition-list">
          <view class="exhibition-item" v-for="ex in exhibitions" :key="ex.id" @click="goToDetail(ex)">
            <image class="ex-img" :src="ex.image" mode="aspectFill"></image>
            <view class="ex-content">
              <view class="ex-title">{{ ex.title }}</view>
              <view class="ex-meta">
                <view class="meta-item">📍 {{ ex.location }}</view>
                <view class="meta-item">📅 {{ ex.date }}</view>
              </view>
              <view class="ex-desc">{{ ex.desc }}</view>
              <view class="ex-footer">
                <view class="visitor-count">👥 {{ ex.visitorCount }}人已观看</view>
                <view class="ex-tag" v-if="ex.isHot">热门</view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="section news-section">
        <view class="section-header">
          <view class="section-title">最新资讯</view>
          <view class="section-more">更多资讯 ></view>
        </view>
        <view class="news-list">
          <view class="news-item" v-for="news in newsList" :key="news.id">
            <view class="news-content">
              <view class="news-title">{{ news.title }}</view>
              <view class="news-summary">{{ news.summary }}</view>
              <view class="news-footer">
                <view class="news-date">{{ news.date }}</view>
                <view class="news-views">👁 {{ news.views }}</view>
              </view>
            </view>
            <image class="news-img" :src="news.image" mode="aspectFill"></image>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="bottom-bar">
      <view class="bar-item" @click="goToHome">
        <view class="bar-icon">🏠</view>
        <view class="bar-text">首页</view>
      </view>
      <view class="bar-item active">
        <view class="bar-icon">🖼️</view>
        <view class="bar-text">展览</view>
      </view>
      <view class="bar-item" @click="goToMap">
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
      digitalHalls: [
        { id: 1, name: '文物数字馆', image: 'https://picsum.photos/200/150?a=1', status: '开放', type: 'vr' },
        { id: 2, name: '艺术沉浸厅', image: 'https://picsum.photos/200/150?a=2', status: '开放', type: '3d' },
        { id: 3, name: '非遗体验馆', image: 'https://picsum.photos/200/150?a=3', status: '维护中', type: 'ar' },
        { id: 4, name: '360°全景展厅', image: 'https://picsum.photos/200/150?a=4', status: '开放', type: 'panorama' }
      ],
      exhibitions: [
        {
          id: 1,
          title: '千年文明 - 古代文物精品展',
          location: '主展馆A厅',
          date: '2024.01.15 - 2024.06.30',
          image: 'https://picsum.photos/200/150?b=1',
          desc: '汇集百件国家级珍贵文物，穿越时空对话历史',
          visitorCount: 12580,
          isHot: true
        },
        {
          id: 2,
          title: '数字敦煌 - 艺术沉浸展',
          location: '数字展厅B区',
          date: '2024.02.01 - 2024.05.31',
          image: 'https://picsum.photos/200/150?b=2',
          desc: '数字化还原敦煌壁画，沉浸式感受丝路文化',
          visitorCount: 8920,
          isHot: true
        },
        {
          id: 3,
          title: '非遗传承 - 传统工艺作品展',
          location: '非遗馆C区',
          date: '2024.03.01 - 2024.12.31',
          image: 'https://picsum.photos/200/150?b=3',
          desc: '国家级非遗大师作品，现场互动体验',
          visitorCount: 5670,
          isHot: false
        }
      ],
      newsList: [
        {
          id: 1,
          title: '数字展厅五一期间开放夜场参观',
          summary: '为满足观众需求，五一假期数字展厅延长开放至21:00...',
          date: '2024-04-10',
          views: 1520,
          image: 'https://picsum.photos/120/90?c=1'
        },
        {
          id: 2,
          title: '新展预告：丝绸之路文物特展五月开幕',
          summary: '汇集十余家博物馆馆藏精品，展现丝路文明璀璨...',
          date: '2024-04-08',
          views: 2340,
          image: 'https://picsum.photos/120/90?c=2'
        },
        {
          id: 3,
          title: 'AI智能导览系统全新上线',
          summary: '引入AI大模型技术，智能回答景点相关问题...',
          date: '2024-04-05',
          views: 3180,
          image: 'https://picsum.photos/120/90?c=3'
        }
      ]
    }
  },
  methods: {
    goToCloudTour() {
      uni.navigateTo({ url: '/pages/module2/cloudTour' })
    },
    openHall(hall) {
      uni.showToast({ title: `进入${hall.name}`, icon: 'none' })
    },
    goToDetail(ex) {
      uni.showToast({ title: '查看展览详情', icon: 'none' })
    },
    goToHome() {
      uni.switchTab({ url: '/pages/index/index' })
    },
    goToMap() {
      uni.navigateTo({ url: '/pages/module3/index' })
    },
    goToShop() {
      uni.navigateTo({ url: '/pages/module5/index' })
    }
  }
}
</script>

<style scoped>
.exhibition-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 120rpx;
}

.header-banner {
  position: relative;
  height: 320rpx;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
}

.banner-text {
  position: absolute;
  bottom: 40rpx;
  left: 30rpx;
  color: #fff;
}

.banner-title {
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.banner-desc {
  font-size: 24rpx;
  opacity: 0.9;
}

.content-area {
  height: calc(100vh - 320rpx - 120rpx);
}

.section {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
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

.hall-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.hall-card {
  position: relative;
  border-radius: 12rpx;
  overflow: hidden;
  background: #f9f9f9;
}

.hall-img {
  width: 100%;
  height: 160rpx;
}

.hall-info {
  padding: 15rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hall-name {
  font-size: 26rpx;
  font-weight: 500;
}

.hall-status {
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.hall-status.open {
  background: #e8f5e9;
  color: #52c41a;
}

.hall-status.close {
  background: #fff2e8;
  color: #fa8c16;
}

.hall-tag {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  background: rgba(0, 122, 255, 0.85);
  color: #fff;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.exhibition-list {
  display: flex;
  flex-direction: column;
  gap: 25rpx;
}

.exhibition-item {
  display: flex;
  background: #f9f9f9;
  border-radius: 12rpx;
  overflow: hidden;
}

.ex-img {
  width: 220rpx;
  height: 160rpx;
}

.ex-content {
  flex: 1;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ex-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 8rpx;
}

.ex-meta {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  margin-bottom: 8rpx;
}

.meta-item {
  font-size: 22rpx;
  color: #666;
}

.ex-desc {
  font-size: 24rpx;
  color: #888;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ex-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8rpx;
}

.visitor-count {
  font-size: 22rpx;
  color: #999;
}

.ex-tag {
  background: #ff4d4f;
  color: #fff;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.news-item {
  display: flex;
  gap: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.news-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
}

.news-summary {
  font-size: 24rpx;
  color: #666;
  margin: 8rpx 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.news-footer {
  display: flex;
  gap: 20rpx;
  font-size: 22rpx;
  color: #999;
}

.news-img {
  width: 160rpx;
  height: 120rpx;
  border-radius: 8rpx;
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
