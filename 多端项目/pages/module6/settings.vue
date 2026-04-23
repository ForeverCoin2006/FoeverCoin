<template>
	<view class="container">
		<!-- 导航条 -->
		<view class="nav-bar">
			<text class="title">设置</text>
		</view>

		<!-- 设置列表 -->
		<view class="settings-list">
			<view class="list-item" @click="goToAbout">
				<text class="item-label">关于智游文创</text>
				<text class="arrow">></text>
			</view>
			<view class="list-item">
				<text class="item-label">服务协议</text>
				<text class="arrow">></text>
			</view>
			<view class="list-item">
				<text class="item-label">隐私政策</text>
				<text class="arrow">></text>
			</view>
			<view class="list-item">
				<text class="item-label">版本信息</text>
				<text class="value">v1.0.0</text>
			</view>
		</view>

		<!-- 退出登录按钮 -->
		<button class="logout-btn" @click="handleLogout">退出登录</button>
	</view>
</template>

<script>
export default {
	methods: {
		handleLogout() {
			uni.showModal({
				title: '确认退出',
				content: '退出登录后将无法进行预约和购买，是否继续？',
				success: (res) => {
					if (res.confirm) {
						uni.removeStorageSync('userId');
						uni.showToast({ title: '已退出登录' });
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/index/index' // 跳转回首页
							});
						}, 1500);
					}
				}
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

.settings-list {
	margin-top: 30rpx;
	background-color: #fff;
	
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

		.item-label {
			font-size: 28rpx;
			color: #333;
		}

		.arrow {
			font-size: 24rpx;
			color: #ccc;
		}
		
		.value {
			font-size: 26rpx;
			color: #999;
		}
	}
}

.logout-btn {
	margin: 100rpx 30rpx;
	height: 90rpx;
	background-color: #fff;
	color: #8b0000;
	border: 1rpx solid #8b0000;
	border-radius: 45rpx;
	font-size: 32rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	
	&::after { border: none; }
	
	&:active {
		background-color: #fff1f1;
	}
}
</style>
