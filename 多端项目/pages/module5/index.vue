<template>
  <view class="shop-container">
    <view class="search-bar">
      <input 
        type="text" 
        v-model="keyword" 
        placeholder="搜索商品"
        placeholder-class="placeholder"
      />
      <button class="search-btn" @click="search">搜索</button>
    </view>
    
    <view class="category-tabs">
      <view 
        class="tab-item" 
        :class="{active: activeCategory === 'all'}" 
        @click="switchCategory('all')"
      >
        全部
      </view>
      <view 
        class="tab-item" 
        :class="{active: activeCategory === 'cultural'}" 
        @click="switchCategory('cultural')"
      >
        文化创意
      </view>
      <view 
        class="tab-item" 
        :class="{active: activeCategory === 'handcraft'}" 
        @click="switchCategory('handcraft')"
      >
        手工艺品
      </view>
      <view 
        class="tab-item" 
        :class="{active: activeCategory === 'digital'}" 
        @click="switchCategory('digital')"
      >
        数字文创
      </view>
    </view>

    <view class="goods-list">
      <view 
        v-for="goods in goodsList" 
        :key="goods._id" 
        class="goods-item" 
        @click="goToDetail(goods._id)"
      >
        <view class="goods-image">
          <view class="image-placeholder">{{ goods.name }}</view>
        </view>
        <view class="goods-info">
          <view class="goods-name">{{ goods.name }}</view>
          <view class="goods-price">¥{{ goods.price }}</view>
          <view class="goods-stock">库存: {{ goods.stock }}</view>
        </view>
      </view>
      
      <view v-if="goodsList.length === 0" class="empty">
        暂无商品
      </view>
    </view>

    <view class="bottom-bar">
      <view class="bar-item" @click="goToHome">
        <view class="bar-icon">首页</view>
        <view class="bar-text">首页</view>
      </view>
      <view class="bar-item active" @click="goToShop">
        <view class="bar-icon">商城</view>
        <view class="bar-text">商城</view>
      </view>
      <view class="bar-item" @click="goToOrders">
        <view class="bar-icon">订单</view>
        <view class="bar-text">订单</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      activeCategory: 'all',
      goodsList: []
    }
  },
  onLoad() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      try {
        const res = await uniCloud.callFunction({
          name: 'getGoodsList',
          data: {
            category: this.activeCategory === 'all' ? '' : this.activeCategory,
            keyword: this.keyword
          }
        })
        
        if (res.result.code === 0) {
          this.goodsList = res.result.data
        } else {
          uni.showToast({
            title: '获取商品列表失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    },
    
    search() {
      this.getGoodsList()
    },
    
    switchCategory(category) {
      this.activeCategory = category
      this.getGoodsList()
    },
    
    goToDetail(goodsId) {
      uni.navigateTo({
        url: `/pages/module5/detail?id=${goodsId}`
      })
    },
    
    goToHome() {
      uni.navigateTo({
        url: '/pages/index/index'
      })
    },
    
    goToShop() {
      // 已在商城页
    },
    
    goToOrders() {
      uni.navigateTo({
        url: '/pages/module5/orders'
      })
    }
  }
}
</script>

<style scoped>
.shop-container {
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.search-bar {
  display: flex;
  margin-bottom: 30rpx;
}

.search-bar input {
  flex: 1;
  height: 80rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx 0 0 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.search-btn {
  width: 120rpx;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 0 8rpx 8rpx 0;
  font-size: 28rpx;
  padding: 0;
}

.category-tabs {
  display: flex;
  border-bottom: 1rpx solid #e0e0e0;
  margin-bottom: 30rpx;
  overflow-x: auto;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
  white-space: nowrap;
}

.tab-item.active {
  color: #007aff;
  border-bottom: 4rpx solid #007aff;
}

.goods-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.goods-item {
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  overflow: hidden;
  padding: 20rpx;
}

.goods-image {
  width: 100%;
  height: 200rpx;
  background-color: #f5f5f5;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  font-size: 24rpx;
  color: #999;
  text-align: center;
  padding: 20rpx;
}

.goods-info {
  display: flex;
  flex-direction: column;
}

.goods-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-price {
  font-size: 32rpx;
  color: #ff6b6b;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.goods-stock {
  font-size: 24rpx;
  color: #999;
}

.empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: white;
  border-top: 1rpx solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100rpx;
}

.bar-item.active {
  color: #007aff;
}

.bar-icon {
  font-size: 36rpx;
  margin-bottom: 8rpx;
}

.bar-text {
  font-size: 20rpx;
}

.placeholder {
  color: #999;
}
</style>