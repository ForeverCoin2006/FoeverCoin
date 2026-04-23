<template>
	<view class="container">
		<!-- 页面头部：仿故宫红墙背景 -->
		<view class="header">
			<text class="title">智游故宫</text>
			<text class="subtitle">门票预约</text>
		</view>

		<!-- 预约表单区域 -->
		<view class="form-container">
			<view class="form-item">
				<view class="label">选择日期</view>
				<scroll-view class="date-scroll" scroll-x="true" show-scrollbar="false">
					<view 
						v-for="(item, index) in dateList" 
						:key="index" 
						class="date-item" 
						:class="{ active: formData.date === item.value }"
						@click="formData.date = item.value"
					>
						<text class="day">{{ item.day }}</text>
						<text class="date">{{ item.label }}</text>
					</view>
				</scroll-view>
			</view>

			<view class="form-item">
				<view class="label">选择时段</view>
				<view class="radio-group">
					<view 
						v-for="(item, index) in timeSlots" 
						:key="index" 
						class="radio-item" 
						:class="{ active: formData.time === item }"
						@click="formData.time = item"
					>
						<text>{{ item }}</text>
					</view>
				</view>
			</view>

			<view class="form-item">
				<view class="label">选择票种</view>
				<view class="radio-group">
					<view 
						v-for="(item, index) in ticketTypes" 
						:key="index" 
						class="radio-item" 
						:class="{ active: formData.ticketType === item }"
						@click="formData.ticketType = item"
					>
						<text>{{ item }}</text>
					</view>
				</view>
			</view>

			<!-- 提交按钮 -->
			<button class="submit-btn" @click="handleSubmit">立即预约</button>
		</view>

		<!-- 底部跳转链接 -->
		<view class="footer-link" @click="goToList">
			<text>查看我的预约订单 ></text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			formData: {
				date: '',
				time: '',
				ticketType: ''
			},
			dateList: [],
			timeSlots: ['上午', '下午'],
			ticketTypes: ['成人', '学生', '儿童'],
			userId: uni.getStorageSync('userId') || 'user_test_01' // 模拟 userId
		};
	},
	onLoad() {
		// 初始化未来 7 天日期
		this.initDateList();
		// 设置默认选择
		if (this.dateList.length > 0) {
			this.formData.date = this.dateList[0].value;
		}
		// 存储测试 userId
		if (!uni.getStorageSync('userId')) {
			uni.setStorageSync('userId', this.userId);
		}
	},
	methods: {
		// 生成未来 7 天日期列表
		initDateList() {
			const list = [];
			const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
			for (let i = 0; i < 7; i++) {
				const date = new Date();
				date.setDate(date.getDate() + i);
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				const weekDay = weeks[date.getDay()];
				list.push({
					label: `${month}-${day}`,
					day: weekDay,
					value: `${date.getFullYear()}-${month}-${day}`
				});
			}
			this.dateList = list;
		},
		// 提交预约
		async handleSubmit() {
			// 表单校验
			if (!this.formData.date) return this.toast('请选择日期');
			if (!this.formData.time) return this.toast('请选择时段');
			if (!this.formData.ticketType) return this.toast('请选择票种');

			uni.showLoading({ title: '预约中...' });
			try {
				const res = await uniCloud.callFunction({
					name: 'reserve-create',
					data: {
						userId: this.userId,
						...this.formData
					}
				});
				uni.hideLoading();
				if (res.result.code === 200) {
					uni.showModal({
						title: '预约成功',
						content: '您的门票已预约成功',
						showCancel: false,
						success: () => {
							this.goToList();
						}
					});
				} else {
					this.toast(res.result.msg);
				}
			} catch (e) {
				uni.hideLoading();
				this.toast('网络异常，请稍后重试');
			}
		},
		toast(title) {
			uni.showToast({ title, icon: 'none' });
		},
		goToList() {
			uni.navigateTo({
				url: '/pages/module4/reserve-list'
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

.header {
	height: 300rpx;
	background-color: #8b0000; // 故宫红
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #fff;
	border-bottom-left-radius: 40rpx;
	border-bottom-right-radius: 40rpx;
	
	.title {
		font-size: 48rpx;
		font-weight: bold;
		letter-spacing: 4rpx;
	}
	
	.subtitle {
		font-size: 24rpx;
		margin-top: 10rpx;
		opacity: 0.8;
	}
}

.form-container {
	margin: -50rpx 30rpx 0;
	background-color: #fff;
	border-radius: 20rpx;
	padding: 40rpx 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.form-item {
	margin-bottom: 40rpx;
	
	.label {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		padding-left: 10rpx;
		border-left: 8rpx solid #8b0000;
	}
}

/* 日期滚动列表样式 */
.date-scroll {
	white-space: nowrap;
	width: 100%;
	
	.date-item {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 30rpx;
		margin-right: 20rpx;
		border-radius: 12rpx;
		background-color: #f5f5f5;
		transition: all 0.3s;
		
		&.active {
			background-color: #8b0000;
			color: #fff;
		}
		
		.day {
			font-size: 24rpx;
			margin-bottom: 6rpx;
		}
		
		.date {
			font-size: 28rpx;
			font-weight: bold;
		}
	}
}

/* 单选组样式 */
.radio-group {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
	
	.radio-item {
		flex: 1;
		min-width: 180rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #f5f5f5;
		border-radius: 12rpx;
		font-size: 28rpx;
		color: #666;
		transition: all 0.3s;
		
		&.active {
			background-color: #8b0000;
			color: #fff;
		}
	}
}

.submit-btn {
	margin-top: 60rpx;
	height: 90rpx;
	background-color: #8b0000;
	color: #fff;
	border-radius: 45rpx;
	font-size: 32rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 6rpx 20rpx rgba(139, 0, 0, 0.3);
	
	&:active {
		opacity: 0.9;
	}
}

.footer-link {
	text-align: center;
	margin-top: 40rpx;
	font-size: 28rpx;
	color: #8b0000;
	text-decoration: underline;
}
</style>
