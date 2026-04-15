<template>
	<view class="home-page">
		<view class="header">
			<image class="logo" src="/static/logo.png"></image>
			<view class="app-title">智游文创多端平台</view>
			<view class="app-subtitle">文化+科技 融合创新体验</view>
		</view>

		<view class="module-grid">
			<view class="module-card exhibition" @click="goToModule2">
				<view class="module-icon">🖼️</view>
				<view class="module-name">展览资讯</view>
				<view class="module-desc">数字展厅、云游体验、最新展览</view>
			</view>

			<view class="module-card guide" @click="goToModule3">
				<view class="module-icon">🗺️</view>
				<view class="module-name">景区导览</view>
				<view class="module-desc">智能地图、语音讲解、路线规划</view>
			</view>

			<view class="module-card shop" @click="goToModule5">
				<view class="module-icon">🛒</view>
				<view class="module-name">文创商城</view>
				<view class="module-desc">文化周边、创意商品</view>
			</view>

			<view class="module-card ai" @click="goToAI">
				<view class="module-icon">🤖</view>
				<view class="module-name">AI助手</view>
				<view class="module-desc">智能咨询、景点讲解</view>
			</view>
		</view>

		<view class="quick-links">
			<view class="link-title">快捷页面</view>
			<view class="link-list">
				<view class="link-item" @click="goToPage('/pages/module2/cloudTour')">
					🎮 云游数字展厅
				</view>
				<view class="link-item" @click="goToPage('/pages/module3/routePlan')">
					🧭 智能路线规划
				</view>
				<view class="link-item" @click="goToPage('/pages/module3/spotDetail')">
					🎧 景点语音讲解
				</view>
				<view class="link-item" @click="goToPage('/pages/module5/orders')">
					📋 我的订单
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			goToModule2() {
				uni.navigateTo({ url: '/pages/module2/index' })
			},
			goToModule3() {
				uni.navigateTo({ url: '/pages/module3/index' })
			},
			goToModule5() {
				uni.navigateTo({ url: '/pages/module5/index' })
			},
			goToAI() {
				uni.navigateTo({ url: '/pages/module8/aiAgent/aiAgent' })
			},
			goToPage(path) {
				uni.navigateTo({ url: path })
			}
		}
	}
</script>

<style scoped>
.home-page {
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 40rpx 30rpx;
}

.header {
	text-align: center;
	margin-bottom: 50rpx;
}

.logo {
	height: 160rpx;
	width: 160rpx;
	margin-bottom: 30rpx;
}

.app-title {
	font-size: 42rpx;
	font-weight: bold;
	color: #fff;
	margin-bottom: 15rpx;
}

.app-subtitle {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.8);
}

.module-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20rpx;
	margin-bottom: 40rpx;
}

.module-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.module-icon {
	font-size: 60rpx;
	margin-bottom: 15rpx;
}

.module-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.module-desc {
	font-size: 22rpx;
	color: #888;
	text-align: center;
	line-height: 1.4;
}

.quick-links {
	background: rgba(255, 255, 255, 0.15);
	backdrop-filter: blur(10rpx);
	border-radius: 20rpx;
	padding: 30rpx;
}

.link-title {
	font-size: 28rpx;
	font-weight: 500;
	color: #fff;
	margin-bottom: 25rpx;
}

.link-list {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.link-item {
	background: rgba(255, 255, 255, 0.2);
	padding: 20rpx 25rpx;
	border-radius: 12rpx;
	font-size: 26rpx;
	color: #fff;
	display: flex;
	align-items: center;
	gap: 15rpx;
}
</style>
