<template>
	<view class="container">
		<!-- 导航条 -->
		<view class="nav-bar">
			<text class="title">实名信息管理</text>
		</view>

		<!-- 信息展示/编辑区域 -->
		<view class="info-box">
			<view class="info-item">
				<text class="label">姓名</text>
				<input class="input" type="text" v-model="userInfo.name" placeholder="请输入您的真实姓名" />
			</view>
			<view class="info-item">
				<text class="label">手机号码</text>
				<view class="phone-display" v-if="!isEditingPhone" @click="isEditingPhone = true">
					<text class="value">{{ desensitizePhone(userInfo.phone) || '点击设置' }}</text>
					<text class="edit-tip">修改</text>
				</view>
				<input class="input" type="number" v-else v-model="userInfo.phone" placeholder="请输入11位手机号" @blur="isEditingPhone = false" />
			</view>
			<view class="info-item">
				<text class="label">身份证号</text>
				<view class="id-display" v-if="!isEditingID" @click="isEditingID = true">
					<text class="value">{{ desensitizeID(userInfo.idCard) || '点击设置' }}</text>
					<text class="edit-tip">修改</text>
				</view>
				<input class="input" type="idcard" v-else v-model="userInfo.idCard" placeholder="请输入18位身份证号" @blur="isEditingID = false" />
			</view>
		</view>

		<!-- 提交按钮 -->
		<button class="submit-btn" @click="handleUpdate">保存修改</button>
		
		<view class="tip-box">
			<text class="tip-title">温馨提示：</text>
			<text class="tip-content">实名信息将用于门票预约及文创商品购买，请确保信息真实有效。智游文创将严格保护您的隐私信息。</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {
				name: '',
				phone: '',
				idCard: ''
			},
			isEditingPhone: false,
			isEditingID: false,
			userId: uni.getStorageSync('userId') || 'user_test_01'
		};
	},
	onLoad() {
		this.fetchUserInfo();
	},
	methods: {
		async fetchUserInfo() {
			uni.showLoading({ title: '加载中...' });
			try {
				const res = await uniCloud.callFunction({
					name: 'user-info',
					data: { userId: this.userId, action: 'get' }
				});
				uni.hideLoading();
				if (res.result.code === 200) {
					this.userInfo = res.result.data;
				}
			} catch (e) {
				uni.hideLoading();
				uni.showToast({ title: '获取失败', icon: 'none' });
			}
		},
		async handleUpdate() {
			// 校验
			if (!this.userInfo.name) return this.toast('请输入姓名');
			if (!/^1[3-9]\d{9}$/.test(this.userInfo.phone)) return this.toast('请输入正确的手机号');
			if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.userInfo.idCard)) return this.toast('请输入正确的身份证号');

			uni.showLoading({ title: '保存中...' });
			try {
				const res = await uniCloud.callFunction({
					name: 'user-info',
					data: {
						userId: this.userId,
						action: 'update',
						data: this.userInfo
					}
				});
				uni.hideLoading();
				if (res.result.code === 200) {
					uni.showToast({ title: '保存成功' });
					setTimeout(() => uni.navigateBack(), 1500);
				} else {
					this.toast(res.result.msg);
				}
			} catch (e) {
				uni.hideLoading();
				this.toast('保存失败，请稍后重试');
			}
		},
		desensitizePhone(phone) {
			if (!phone) return '';
			return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
		},
		desensitizeID(id) {
			if (!id) return '';
			return id.replace(/(\d{4})\d{10}(\d{4})/, '$1**********$2');
		},
		toast(title) {
			uni.showToast({ title, icon: 'none' });
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

.info-box {
	margin: 30rpx;
	background-color: #fff;
	border-radius: 20rpx;
	padding: 0 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 40rpx 0;
		border-bottom: 1rpx solid #f5f5f5;

		&:last-child {
			border-bottom: none;
		}

		.label {
			font-size: 28rpx;
			color: #333;
			font-weight: 500;
			width: 160rpx;
		}

		.input {
			flex: 1;
			font-size: 28rpx;
			color: #333;
			text-align: right;
		}

		.value {
			font-size: 28rpx;
			color: #333;
		}

		.edit-tip {
			font-size: 24rpx;
			color: #8b0000;
			margin-left: 20rpx;
			border: 1rpx solid #8b0000;
			padding: 2rpx 10rpx;
			border-radius: 6rpx;
		}
	}
}

.submit-btn {
	margin: 60rpx 30rpx;
	height: 90rpx;
	background-color: #8b0000;
	color: #fff;
	border-radius: 45rpx;
	font-size: 32rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 6rpx 20rpx rgba(139, 0, 0, 0.3);
}

.tip-box {
	margin: 40rpx 60rpx;
	
	.tip-title {
		display: block;
		font-size: 26rpx;
		color: #999;
		margin-bottom: 10rpx;
	}
	
	.tip-content {
		font-size: 24rpx;
		color: #ccc;
		line-height: 1.6;
	}
}
</style>
