<template>
  <view class="confirm-container">
    <view class="address-section">
      <view class="address-title">收货地址</view>
      <view class="address-info" @click="chooseAddress">
        <view class="address-item">
          <view class="address-name">{{ address.name || '请选择收货地址' }}</view>
          <view class="address-phone">{{ address.phone || '' }}</view>
        </view>
        <view class="address-detail">{{ address.detail || '' }}</view>
        <view class="address-arrow">→</view>
      </view>
    </view>

    <view class="goods-section">
      <view class="section-title">商品信息</view>
      <view class="goods-item">
        <view class="goods-image">
          <view class="image-placeholder">{{ goods.name }}</view>
        </view>
        <view class="goods-info">
          <view class="goods-name">{{ goods.name }}</view>
          <view class="goods-price">¥{{ goods.price }}</view>
        </view>
        <view class="goods-quantity">x{{ quantity }}</view>
      </view>
    </view>

    <view class="price-section">
      <view class="price-item">
        <view class="price-label">商品金额</view>
        <view class="price-value">¥{{ (goods.price * quantity).toFixed(2) }}</view>
      </view>
      <view class="price-item">
        <view class="price-label">运费</view>
        <view class="price-value">¥{{ shippingFee.toFixed(2) }}</view>
      </view>
      <view class="price-item total">
        <view class="price-label">合计</view>
        <view class="price-value total-price">¥{{ totalPrice.toFixed(2) }}</view>
      </view>
    </view>

    <view class="remark-section">
      <view class="remark-title">订单备注</view>
      <input 
        type="text" 
        v-model="remark" 
        placeholder="请输入备注信息"
        placeholder-class="placeholder"
      />
    </view>

    <view class="bottom-bar">
      <view class="total-section">
        <view class="total-label">合计：</view>
        <view class="total-price">¥{{ totalPrice.toFixed(2) }}</view>
      </view>
      <button class="submit-btn" @click="submitOrder">提交订单</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      goodsId: '',
      quantity: 1,
      goods: {
        name: '',
        price: 0
      },
      address: {
        name: '',
        phone: '',
        detail: ''
      },
      shippingFee: 0,
      remark: '',
      totalPrice: 0
    }
  },
  onLoad(options) {
    this.goodsId = options.goodsId
    this.quantity = parseInt(options.quantity)
    this.getGoodsDetail()
  },
  watch: {
    goods: {
      handler() {
        this.calculateTotal()
      },
      deep: true
    },
    quantity() {
      this.calculateTotal()
    },
    shippingFee() {
      this.calculateTotal()
    }
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
    
    calculateTotal() {
      this.totalPrice = this.goods.price * this.quantity + this.shippingFee
    },
    
    chooseAddress() {
      uni.chooseAddress({
        success: (res) => {
          this.address = {
            name: res.userName,
            phone: res.telNumber,
            detail: res.provinceName + res.cityName + res.countyName + res.detailInfo
          }
        },
        fail: () => {
          uni.showToast({
            title: '选择地址失败',
            icon: 'none'
          })
        }
      })
    },
    
    async submitOrder() {
      if (!this.address.name) {
        uni.showToast({
          title: '请选择收货地址',
          icon: 'none'
        })
        return
      }

      const token = uni.getStorageSync('token')
      if (!token) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        return
      }

      try {
        const res = await uniCloud.callFunction({
          name: 'createOrder',
          data: {
            token: token,
            goodsId: this.goodsId,
            quantity: this.quantity,
            address: this.address,
            shippingFee: this.shippingFee,
            totalPrice: this.totalPrice,
            remark: this.remark
          }
        })
        
        if (res.result.code === 0) {
          uni.showToast({
            title: '订单创建成功',
            icon: 'success'
          })
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/module5/orders'
            })
          }, 1500)
        } else {
          uni.showToast({
            title: res.result.message || '订单创建失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style scoped>
.confirm-container {
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.address-section {
  margin-bottom: 30rpx;
}

.address-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx;
  font-weight: bold;
}

.address-info {
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
}

.address-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.address-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.address-phone {
  font-size: 28rpx;
  color: #666;
}

.address-detail {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
  line-height: 1.4;
}

.address-arrow {
  align-self: flex-end;
  font-size: 28rpx;
  color: #999;
}

.goods-section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx;
  font-weight: bold;
}

.goods-item {
  display: flex;
  align-items: center;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 20rpx;
}

.goods-image {
  width: 120rpx;
  height: 120rpx;
  background-color: #f5f5f5;
  margin-right: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  font-size: 20rpx;
  color: #999;
  text-align: center;
  padding: 10rpx;
}

.goods-info {
  flex: 1;
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
  font-size: 28rpx;
  color: #ff6b6b;
  font-weight: bold;
}

.goods-quantity {
  font-size: 28rpx;
  color: #666;
}

.price-section {
  margin-bottom: 30rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 20rpx;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15rpx;
  font-size: 28rpx;
}

.price-item.total {
  margin-top: 15rpx;
  padding-top: 15rpx;
  border-top: 1rpx solid #e0e0e0;
  font-weight: bold;
}

.price-label {
  color: #666;
}

.price-value {
  color: #333;
}

.total-price {
  color: #ff6b6b;
  font-size: 32rpx;
}

.remark-section {
  margin-bottom: 30rpx;
}

.remark-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx;
  font-weight: bold;
}

.remark-section input {
  width: 100%;
  height: 100rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  resize: none;
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
  padding: 0 20rpx;
}

.total-section {
  flex: 1;
  display: flex;
  align-items: center;
}

.total-label {
  font-size: 28rpx;
  color: #666;
}

.submit-btn {
  width: 200rpx;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
  padding: 0;
}

.placeholder {
  color: #999;
}
</style>