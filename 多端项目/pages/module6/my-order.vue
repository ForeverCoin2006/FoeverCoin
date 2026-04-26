<template>
	<view class="container">
		<!-- 导航条 -->
		<view class="nav-bar">
			<text class="title">我的订单</text>
		</view>

		<!-- 订单列表 -->
		<scroll-view class="list-scroll" scroll-y="true">
			<view v-if="orderList.length > 0">
				<view v-for="(item, index) in orderList" :key="index" class="order-card">
					<view class="card-header">
						<text class="order-id">订单号：{{ item._id.substring(0, 10) }}...</text>
						<text class="status" :class="getStatusClass(item.status)">{{ item.status }}</text>
					</view>
					
					<view class="card-body">
						<view v-for="(prod, pIdx) in item.productList" :key="pIdx" class="product-item">
							<image class="product-img" :src="prod.img || '/static/logo.png'" mode="aspectFill"></image>
							<view class="product-info">
								<text class="product-name">{{ prod.name }}</text>
								<text class="product-spec" v-if="prod.spec">规格：{{ prod.spec }}</text>
								<view class="product-price-row">
									<text class="price">￥{{ prod.price }}</text>
									<text class="count">x{{ prod.count }}</text>
								</view>
							</view>
						</view>
					</view>

					<view class="card-footer">
						<view class="total-row">
							<text class="total-label">实付款：</text>
							<text class="total-price">￥{{ item.totalPrice }}</text>
						</view>
						<view class="action-row" v-if="item.status === '待支付'">
							<button class="action-btn pay-btn" @click="handlePay(item._id)">去支付</button>
						</view>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view v-else class="empty-state">
				<text class="empty-icon">📦</text>
				<text class="empty-text">您还没有任何订单记录</text>
				<button class="go-shop-btn" @click="goToShop">前往商城</button>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderList: [],
			userId: uni.getStorageSync('userId') || 'user_test_01'
		};
	},
	onLoad() {
		this.fetchOrderList();
	},
	methods: {
		async fetchOrderList() {
			uni.showLoading({ title: '加载中...' });
			try {
				const res = await uniCloud.callFunction({
					name: 'order-list-by-user',
					data: { userId: this.userId }
				});
				uni.hideLoading();
				if (res.result.code === 200) {
					this.orderList = res.result.data;
				} else {
					uni.showToast({ title: res.result.msg, icon: 'none' });
				}
			} catch (e) {
				uni.hideLoading();
				uni.showToast({ title: '网络异常', icon: 'none' });
			}
		},
		getStatusClass(status) {
			switch(status) {
				case '待支付': return 'status-pending';
				case '已支付': return 'status-paid';
				case '已发货': return 'status-shipped';
				case '已完成': return 'status-completed';
				default: return '';
			}
		},
		handlePay(id) {
			uni.showToast({ title: '支付功能正在接入中...', icon: 'none' });
		},
		goToShop() {
			uni.switchTab({
				url: '/pages/index/index' // 假设商城在首页
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background-color: #f5f5f5;
	display: flex;
	flex-direction: column;
}

.nav-bar {
	height: 100rpx;
	background-color: #8b0000;
	color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 4rpx 10rpx rgba(139, 0, 0, 0.2);
	
	.title {
		font-size: 34rpx;
		font-weight: bold;
	}
}

.list-scroll {
	flex: 1;
	padding: 20rpx;
	box-sizing: border-box;
}

.order-card {
	background-color: #fff;
	border-radius: 16rpx;
	margin-bottom: 24rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.03);
	
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #eee;
		margin-bottom: 20rpx;
		
		.order-id {
			font-size: 24rpx;
			color: #999;
		}
		
		.status {
			font-size: 26rpx;
			font-weight: bold;
			
			&-pending { color: #8b0000; }
			&-paid { color: #52c41a; }
			&-shipped { color: #1890ff; }
			&-completed { color: #999; }
		}
	}
}

.product-item {
	display: flex;
	margin-bottom: 20rpx;
	
	.product-img {
		width: 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
		background-color: #f9f9f9;
	}
	
	.product-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		
		.product-name {
			font-size: 28rpx;
			color: #333;
			font-weight: bold;
			line-height: 1.4;
		}
		
		.product-spec {
			font-size: 22rpx;
			color: #999;
		}
		
		.product-price-row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.price {
				font-size: 28rpx;
				color: #333;
			}
			
			.count {
				font-size: 24rpx;
				color: #999;
			}
		}
	}
}

.card-footer {
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx dashed #eee;
	
	.total-row {
		display: flex;
		justify-content: flex-end;
		align-items: baseline;
		margin-bottom: 20rpx;
		
		.total-label {
			font-size: 24rpx;
			color: #666;
		}
		
		.total-price {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.action-row {
		display: flex;
		justify-content: flex-end;
		
		.action-btn {
			height: 60rpx;
			line-height: 60rpx;
			font-size: 26rpx;
			border-radius: 30rpx;
			padding: 0 40rpx;
			margin: 0;
			background-color: #8b0000;
			color: #fff;
			
			&::after { border: none; }
		}
	}
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 200rpx;
	
	.empty-icon {
		font-size: 100rpx;
		opacity: 0.2;
		margin-bottom: 30rpx;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #999;
		margin-bottom: 50rpx;
	}
	
	.go-shop-btn {
		width: 300rpx;
		height: 80rpx;
		background-color: #8b0000;
		color: #fff;
		border-radius: 40rpx;
		font-size: 28rpx;
	}
}
</style>
