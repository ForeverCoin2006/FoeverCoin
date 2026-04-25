<template>
  <view class="orders-container">
    <view class="order-tabs">
      <view 
        class="tab-item" 
        :class="{active: activeStatus === 'all'}" 
        @click="switchStatus('all')"
      >
        全部
      </view>
      <view 
        class="tab-item" 
        :class="{active: activeStatus === 'pending'}" 
        @click="switchStatus('pending')"
      >
        待付款
      </view>
      <view 
        class="tab-item" 
        :class="{active: activeStatus === 'paid'}" 
        @click="switchStatus('paid')"
      >
        待发货
      </view>
      <view 
        class="tab-item" 
        :class="{active: activeStatus === 'shipped'}" 
        @click="switchStatus('shipped')"
      >
        待收货
      </view>
      <view 
        class="tab-item" 
        :class="{active: activeStatus === 'completed'}" 
        @click="switchStatus('completed')"
      >
        已完成
      </view>
    </view>

    <view class="order-list">
      <view 
        v-for="order in orderList" 
        :key="order._id" 
        class="order-item"
      >
        <view class="order-header">
          <view class="order-time">{{ formatTime(order.createTime) }}</view>
          <view class="order-status" :class="getStatusClass(order.status)">{{ getStatusText(order.status) }}</view>
        </view>
        
        <view class="order-goods">
          <view class="goods-item">
            <view class="goods-image">
              <view class="image-placeholder">{{ order.goodsName }}</view>
            </view>
            <view class="goods-info">
              <view class="goods-name">{{ order.goodsName }}</view>
              <view class="goods-price">¥{{ order.goodsPrice }}</view>
            </view>
            <view class="goods-quantity">x{{ order.quantity }}</view>
          </view>
        </view>
        
        <view class="order-footer">
          <view class="order-total">
            共{{ order.quantity }}件商品，合计：
            <view class="total-price">¥{{ order.totalPrice.toFixed(2) }}</view>
          </view>
          <view class="order-actions">
            <button 
              v-if="order.status === 'pending'" 
              class="action-btn pay-btn" 
              @click="payOrder(order._id)"
            >
              立即付款
            </button>
            <button 
              v-if="order.status === 'shipped'" 
              class="action-btn confirm-btn" 
              @click="confirmReceipt(order._id)"
            >
              确认收货
            </button>
            <button 
              v-if="order.status === 'completed'" 
              class="action-btn after-sale-btn" 
              @click="goToAfterSale(order._id)"
            >
              申请售后
            </button>
          </view>
        </view>
      </view>
      
      <view v-if="orderList.length === 0" class="empty">
        暂无订单
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeStatus: 'all',
      orderList: []
    }
  },
  onLoad() {
    this.getOrders()
  },
  methods: {
    async getOrders() {
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
          name: 'getOrders',
          data: {
            token: token,
            status: this.activeStatus === 'all' ? '' : this.activeStatus
          }
        })
        
        if (res.result.code === 0) {
          this.orderList = res.result.data
        } else {
          uni.showToast({
            title: '获取订单列表失败',
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
    
    switchStatus(status) {
      this.activeStatus = status
      this.getOrders()
    },
    
    payOrder(orderId) {
      uni.showToast({
        title: '支付功能开发中',
        icon: 'none'
      })
    },
    
    confirmReceipt(orderId) {
      uni.showToast({
        title: '确认收货成功',
        icon: 'success'
      })
      setTimeout(() => {
        this.getOrders()
      }, 1500)
    },
    
    goToAfterSale(orderId) {
      uni.navigateTo({
        url: `/pages/module5/afterSale?orderId=${orderId}`
      })
    },
    
    getStatusText(status) {
      const statusMap = {
        'pending': '待付款',
        'paid': '待发货',
        'shipped': '待收货',
        'completed': '已完成',
        'cancelled': '已取消'
      }
      return statusMap[status] || status
    },
    
    getStatusClass(status) {
      return `status-${status}`
    },
    
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString()
    }
  }
}
</script>

<style scoped>
.orders-container {
  padding: 20rpx;
}

.order-tabs {
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

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.order-item {
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #f5f5f5;
}

.order-time {
  font-size: 24rpx;
  color: #666;
}

.order-status {
  font-size: 24rpx;
  font-weight: bold;
}

.status-pending {
  color: #ff9500;
}

.status-paid {
  color: #007aff;
}

.status-shipped {
  color: #34c759;
}

.status-completed {
  color: #999;
}

.status-cancelled {
  color: #ff3b30;
}

.order-goods {
  padding: 20rpx;
  border-bottom: 1rpx solid #e0e0e0;
}

.goods-item {
  display: flex;
  align-items: center;
}

.goods-image {
  width: 100rpx;
  height: 100rpx;
  background-color: #f5f5f5;
  margin-right: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  font-size: 16rpx;
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

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
}

.order-total {
  font-size: 28rpx;
  color: #666;
}

.total-price {
  color: #ff6b6b;
  font-weight: bold;
}

.order-actions {
  display: flex;
  gap: 10rpx;
}

.action-btn {
  padding: 0 20rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 24rpx;
  border: 1rpx solid #e0e0e0;
  background-color: white;
  border-radius: 8rpx;
}

.pay-btn {
  background-color: #ff6b6b;
  color: white;
  border: none;
}

.confirm-btn {
  background-color: #007aff;
  color: white;
  border: none;
}

.after-sale-btn {
  color: #007aff;
  border-color: #007aff;
}

.empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>