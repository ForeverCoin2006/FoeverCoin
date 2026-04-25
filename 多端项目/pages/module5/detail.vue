<template>
  <view class="detail-container">
    <view class="goods-image">
      <view class="image-placeholder">{{ goods.name }}</view>
    </view>
    
    <view class="goods-info">
      <view class="goods-name">{{ goods.name }}</view>
      <view class="goods-price">¥{{ goods.price }}</view>
      <view class="goods-stock">库存: {{ goods.stock }}</view>
      <view class="goods-category">分类: {{ getCategoryName(goods.category) }}</view>
    </view>

    <view class="goods-desc">
      <view class="desc-title">商品描述</view>
      <view class="desc-content">{{ goods.description }}</view>
    </view>

    <view class="buy-section">
      <view class="quantity-control">
        <button class="quantity-btn" @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
        <view class="quantity">{{ quantity }}</view>
        <button class="quantity-btn" @click="increaseQuantity" :disabled="quantity >= goods.stock">+</button>
      </view>
      
      <view class="buy-buttons">
        <button class="add-cart-btn" @click="addToCart">加入购物车</button>
        <button class="buy-now-btn" @click="buyNow">立即购买</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      goodsId: '',
      goods: {
        name: '',
        price: 0,
        stock: 0,
        category: '',
        description: ''
      },
      quantity: 1
    }
  },
  onLoad(options) {
    this.goodsId = options.id
    this.getGoodsDetail()
  },
  methods: {
    async getGoodsDetail() {
      try {
        const res = await uniCloud.callFunction({
          name: 'getGoodsDetail',
          data: {
            goodsId: this.goodsId
          }
        })
        
        if (res.result.code === 0) {
          this.goods = res.result.data
        } else {
          uni.showToast({
            title: '获取商品详情失败',
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
    
    increaseQuantity() {
      if (this.quantity < this.goods.stock) {
        this.quantity++
      }
    },
    
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
    
    addToCart() {
      uni.showToast({
        title: '已加入购物车',
        icon: 'success'
      })
    },
    
    buyNow() {
      uni.navigateTo({
        url: `/pages/module5/confirm?goodsId=${this.goodsId}&quantity=${this.quantity}`
      })
    },
    
    getCategoryName(category) {
      const categoryMap = {
        'cultural': '文化创意',
        'handcraft': '手工艺品',
        'digital': '数字文创'
      }
      return categoryMap[category] || category
    }
  }
}
</script>

<style scoped>
.detail-container {
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.goods-image {
  width: 100%;
  height: 400rpx;
  background-color: #f5f5f5;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  font-size: 32rpx;
  color: #999;
  text-align: center;
  padding: 40rpx;
}

.goods-info {
  margin-bottom: 30rpx;
}

.goods-name {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx;
  line-height: 1.4;
}

.goods-price {
  font-size: 40rpx;
  color: #ff6b6b;
  font-weight: bold;
  margin-bottom: 15rpx;
}

.goods-stock {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.goods-category {
  font-size: 28rpx;
  color: #666;
}

.goods-desc {
  margin-bottom: 30rpx;
}

.desc-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx;
  font-weight: bold;
}

.desc-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.buy-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: white;
  border-top: 1rpx solid #e0e0e0;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
}

.quantity-control {
  display: flex;
  align-items: center;
  margin-right: 30rpx;
}

.quantity-btn {
  width: 60rpx;
  height: 60rpx;
  line-height: 60rpx;
  border: 1rpx solid #e0e0e0;
  background-color: white;
  font-size: 32rpx;
  padding: 0;
}

.quantity-btn[disabled] {
  color: #ccc;
}

.quantity {
  width: 80rpx;
  text-align: center;
  font-size: 28rpx;
  border-top: 1rpx solid #e0e0e0;
  border-bottom: 1rpx solid #e0e0e0;
  height: 60rpx;
  line-height: 60rpx;
}

.buy-buttons {
  flex: 1;
  display: flex;
  gap: 20rpx;
}

.add-cart-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
  padding: 0;
}

.buy-now-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
  padding: 0;
}
</style>