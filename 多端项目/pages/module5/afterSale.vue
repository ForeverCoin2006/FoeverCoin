<template>
  <view class="after-sale-container">
    <view class="order-info">
      <view class="order-title">订单信息</view>
      <view class="order-item">
        <view class="order-label">订单号：</view>
        <view class="order-value">{{ order.orderNo }}</view>
      </view>
      <view class="order-item">
        <view class="order-label">商品：</view>
        <view class="order-value">{{ order.goodsName }}</view>
      </view>
      <view class="order-item">
        <view class="order-label">数量：</view>
        <view class="order-value">{{ order.quantity }}</view>
      </view>
      <view class="order-item">
        <view class="order-label">金额：</view>
        <view class="order-value">¥{{ order.totalPrice.toFixed(2) }}</view>
      </view>
    </view>

    <view class="reason-section">
      <view class="section-title">售后原因</view>
      <view class="reason-options">
        <view 
          v-for="reason in reasons" 
          :key="reason.value" 
          class="reason-item" 
          :class="{active: selectedReason === reason.value}" 
          @click="selectReason(reason.value)"
        >
          {{ reason.label }}
        </view>
      </view>
    </view>

    <view class="description-section">
      <view class="section-title">问题描述</view>
      <textarea 
        v-model="description" 
        placeholder="请详细描述您遇到的问题"
        placeholder-class="placeholder"
      ></textarea>
    </view>

    <view class="images-section">
      <view class="section-title">上传凭证</view>
      <view class="image-uploader">
        <view 
          v-for="(image, index) in images" 
          :key="index" 
          class="image-item"
        >
          <view class="image-preview">{{ image }}</view>
          <view class="image-remove" @click="removeImage(index)">×</view>
        </view>
        <view 
          v-if="images.length < 3" 
          class="image-add" 
          @click="chooseImage"
        >
          +
        </view>
      </view>
    </view>

    <button class="submit-btn" @click="submitAfterSale">提交售后申请</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderId: '',
      order: {
        orderNo: '',
        goodsName: '',
        quantity: 0,
        totalPrice: 0
      },
      reasons: [
        { label: '商品质量问题', value: 'quality' },
        { label: '商品与描述不符', value: 'description' },
        { label: '商品损坏', value: 'damage' },
        { label: '其他原因', value: 'other' }
      ],
      selectedReason: '',
      description: '',
      images: []
    }
  },
  onLoad(options) {
    this.orderId = options.orderId
    this.getOrderDetail()
  },
  methods: {
    async getOrderDetail() {
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
          name: 'getOrderDetail',
          data: {
            token: token,
            orderId: this.orderId
          }
        })
        
        if (res.result.code === 0) {
          this.order = res.result.data
        } else {
          uni.showToast({
            title: '获取订单详情失败',
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
    
    selectReason(reason) {
      this.selectedReason = reason
    },
    
    chooseImage() {
      uni.chooseImage({
        count: 3 - this.images.length,
        success: (res) => {
          this.images = this.images.concat(res.tempFilePaths)
        }
      })
    },
    
    removeImage(index) {
      this.images.splice(index, 1)
    },
    
    async submitAfterSale() {
      if (!this.selectedReason) {
        uni.showToast({
          title: '请选择售后原因',
          icon: 'none'
        })
        return
      }

      if (!this.description) {
        uni.showToast({
          title: '请描述问题',
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
          name: 'applyAfterSale',
          data: {
            token: token,
            orderId: this.orderId,
            reason: this.selectedReason,
            description: this.description,
            images: this.images
          }
        })
        
        if (res.result.code === 0) {
          uni.showToast({
            title: '售后申请提交成功',
            icon: 'success'
          })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } else {
          uni.showToast({
            title: res.result.message || '提交失败',
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
.after-sale-container {
  padding: 20rpx;
}

.order-info {
  margin-bottom: 30rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 20rpx;
}

.order-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx;
  font-weight: bold;
}

.order-item {
  display: flex;
  margin-bottom: 15rpx;
  font-size: 28rpx;
}

.order-label {
  width: 120rpx;
  color: #666;
}

.order-value {
  flex: 1;
  color: #333;
}

.reason-section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 20rpx;
  font-weight: bold;
}

.reason-options {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.reason-item {
  padding: 15rpx 30rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #666;
}

.reason-item.active {
  border-color: #007aff;
  color: #007aff;
  background-color: #e6f0ff;
}

.description-section {
  margin-bottom: 30rpx;
}

.description-section textarea {
  width: 100%;
  height: 200rpx;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  resize: none;
}

.images-section {
  margin-bottom: 40rpx;
}

.image-uploader {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
}

.image-item {
  position: relative;
  width: 150rpx;
  height: 150rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  overflow: hidden;
}

.image-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #999;
}

.image-remove {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.image-add {
  width: 150rpx;
  height: 150rpx;
  border: 2rpx dashed #e0e0e0;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  color: #999;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 32rpx;
  padding: 0;
}

.placeholder {
  color: #999;
}
</style>