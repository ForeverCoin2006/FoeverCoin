<template>
	<view class="container">
		<!-- 用户信息头部 -->
		<view class="user-header">
			<view class="avatar-box">
				<image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
			</view>
			<view class="user-info">
				<text class="nickname">智游友</text>
				<text class="user-id">ID: {{ userId.substring(0, 8) }}</text>
			</view>
		</view>

		<!-- 订单与预约状态卡片 -->
		<view class="status-card">
			<view class="status-item" @click="goToOrder">
				<text class="icon">📦</text>
				<text class="label">我的订单</text>
			</view>
			<view class="status-item" @click="goToReserve">
				<text class="icon">🎟️</text>
				<text class="label">我的预约</text>
			</view>
			<view class="status-item">
				<text class="icon">⭐</text>
				<text class="label">我的收藏</text>
			</view>
			<view class="status-item">
				<text class="icon">🛍️</text>
				<text class="label">文创订单</text>
			</view>
		</view>

		<!-- 功能列表区 -->
		<view class="function-list">
			<view class="list-item" @click="goToUserInfo">
				<view class="item-left">
					<text class="item-icon">🆔</text>
					<text class="item-label">实名信息管理</text>
				</view>
				<text class="arrow">></text>
			</view>
			<view class="list-item">
				<view class="item-left">
					<text class="item-icon">📍</text>
					<text class="item-label">收货地址管理</text>
				</view>
				<text class="arrow">></text>
			</view>
			<view class="list-item">
				<view class="item-left">
					<text class="item-icon">🎧</text>
					<text class="item-label">在线客服咨询</text>
				</view>
				<text class="arrow">></text>
			</view>
			<view class="list-item" @click="goToSettings">
				<view class="item-left">
					<text class="item-icon">⚙️</text>
					<text class="item-label">设置</text>
				</view>
				<text class="arrow">></text>
			</view>
			<view class="list-item" @click="goToAbout">
				<view class="item-left">
					<text class="item-icon">📜</text>
					<text class="item-label">关于智游文创</text>
				</view>
				<text class="arrow">></text>
			</view>
		</view>

		<!-- 退出登录按钮 (仅为演示展示，实际逻辑在设置页面) -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			userId: uni.getStorageSync('userId') || 'user_test_01'
		};
	},
	onShow() {
		// 确保 userId 最新
		this.userId = uni.getStorageSync('userId') || 'user_test_01';
	},
	methods: {
		goToUserInfo() {
			uni.navigateTo({
				url: '/pages/module6/user-info'
			});
		},
		goToOrder() {
			uni.navigateTo({
				url: '/pages/module6/my-order'
			});
		},
		goToReserve() {
			uni.navigateTo({
				url: '/pages/module4/reserve-list'
			});
		},
		goToSettings() {
			uni.navigateTo({
				url: '/pages/module6/settings'
			});
		},
		goToAbout() {
			uni.showModal({
				title: '关于智游文创',
				content: '智游文创是一款致力于弘扬中华优秀传统文化的智慧导览与文创商城小程序。',
				showCancel: false
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background-color: #f8f8f8;
	padding-bottom: 50rpx;
}

.user-header {
	height: 350rpx;
	background-color: #8b0000; // 故宫红
	display: flex;
	align-items: center;
	padding: 0 40rpx;
	color: #fff;
	border-bottom-left-radius: 40rpx;
	border-bottom-right-radius: 40rpx;

	.avatar-box {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		background-color: #fff;
		overflow: hidden;
		margin-right: 30rpx;
		border: 4rpx solid rgba(255, 255, 255, 0.3);

		.avatar {
			width: 100%;
			height: 100%;
		}
	}

	.user-info {
		.nickname {
			font-size: 36rpx;
			font-weight: bold;
			display: block;
			margin-bottom: 10rpx;
		}

		.user-id {
			font-size: 24rpx;
			opacity: 0.8;
		}
	}
}

.status-card {
	margin: -60rpx 30rpx 0;
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx 0;
	display: flex;
	justify-content: space-around;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

	.status-item {
		display: flex;
		flex-direction: column;
		align-items: center;

		.icon {
			font-size: 50rpx;
			margin-bottom: 10rpx;
		}

		.label {
			font-size: 24rpx;
			color: #333;
		}
	}
}

.function-list {
	margin: 30rpx;
	background-color: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

	.list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 35rpx 30rpx;
		border-bottom: 1rpx solid #f5f5f5;

		&:last-child {
			border-bottom: none;
		}

		&:active {
			background-color: #f9f9f9;
		}

		.item-left {
			display: flex;
			align-items: center;

			.item-icon {
				font-size: 36rpx;
				margin-right: 20rpx;
			}

			.item-label {
				font-size: 28rpx;
				color: #333;
			}
		}

		.arrow {
			font-size: 24rpx;
			color: #ccc;
		}
	}
}
</style>
