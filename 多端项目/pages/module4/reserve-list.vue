<template>
	<view class="container">
		<!-- 页面标题：仿故宫红 -->
		<view class="nav-bar">
			<text class="title">我的预约单</text>
		</view>

		<!-- 预约列表 -->
		<scroll-view 
			class="list-scroll" 
			scroll-y="true" 
			refresher-enabled="true" 
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh"
			@scrolltolower="onLoadMore"
		>
			<view v-if="reserveList.length > 0">
				<view v-for="(item, index) in reserveList" :key="index" class="reserve-card">
					<view class="card-header">
						<text class="id">预约单号：{{ item._id.substring(0, 8) }}...</text>
						<text class="status" :class="getStatusClass(item.status)">{{ item.status }}</text>
					</view>
					
					<view class="card-body">
						<view class="info-row">
							<text class="label">预约日期</text>
							<text class="value">{{ item.date }} ({{ getDayOfWeek(item.date) }})</text>
						</view>
						<view class="info-row">
							<text class="label">预约时段</text>
							<text class="value">{{ item.time }}</text>
						</view>
						<view class="info-row">
							<text class="label">票种类型</text>
							<text class="value">{{ item.ticketType }}票</text>
						</view>
					</view>

					<view class="card-footer" v-if="item.status === '正常'">
						<button class="btn change-btn" @click="openReschedule(item)">改期</button>
						<button class="btn refund-btn" @click="handleRefund(item._id)">退票</button>
					</view>
				</view>
				
				<!-- 加载状态 -->
				<view class="load-status">
					<text v-if="hasMore">正在加载更多...</text>
					<text v-else>没有更多预约记录了</text>
				</view>
			</view>

			<!-- 无记录显示 -->
			<view v-else class="empty-state">
				<image class="empty-img" src="/static/logo.png" mode="aspectFit"></image>
				<text class="empty-text">您还没有任何预约记录</text>
				<button class="go-reserve-btn" @click="goToReserve">立即预约</button>
			</view>
		</scroll-view>

		<!-- 自定义改期选择弹窗 (手动实现，不依赖外部组件) -->
		<view class="modal-mask" v-if="showRescheduleModal" @click="closeReschedule">
			<view class="popup-content" @click.stop>
				<view class="popup-header">
					<text class="popup-title">修改预约时间</text>
					<text class="close-btn" @click="closeReschedule">×</text>
				</view>
				
				<view class="reschedule-form">
					<view class="section">
						<text class="section-title">新日期</text>
						<scroll-view class="date-scroll" scroll-x="true">
							<view 
								v-for="(date, dIdx) in futureDates" 
								:key="dIdx" 
								class="date-item" 
								:class="{ active: rescheduleData.date === date.value }"
								@click="rescheduleData.date = date.value"
							>
								<text class="label">{{ date.label }}</text>
							</view>
						</scroll-view>
					</view>
					
					<view class="section">
						<text class="section-title">新时段</text>
						<view class="time-group">
							<view 
								v-for="(time, tIdx) in ['上午', '下午']" 
								:key="tIdx" 
								class="time-item" 
								:class="{ active: rescheduleData.time === time }"
								@click="rescheduleData.time = time"
							>
								<text>{{ time }}</text>
							</view>
						</view>
					</view>
					
					<button class="confirm-btn" @click="handleReschedule">确认改期</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			reserveList: [],
			page: 1,
			pageSize: 10,
			hasMore: true,
			isRefreshing: false,
			userId: uni.getStorageSync('userId') || 'user_test_01',
			
			// 改期相关
			showRescheduleModal: false,
			rescheduleId: '',
			rescheduleData: {
				date: '',
				time: ''
			},
			futureDates: []
		};
	},
	onLoad() {
		this.fetchList();
		this.initFutureDates();
	},
	methods: {
		// 获取预约列表
		async fetchList(isReset = false) {
			if (isReset) {
				this.page = 1;
				this.reserveList = [];
				this.hasMore = true;
			}
			
			try {
				const res = await uniCloud.callFunction({
					name: 'reserve-list',
					data: {
						userId: this.userId,
						page: this.page,
						pageSize: this.pageSize
					}
				});
				
				if (res.result.code === 200) {
					const data = res.result.data;
					if (data.length < this.pageSize) {
						this.hasMore = false;
					}
					this.reserveList = [...this.reserveList, ...data];
				}
			} catch (e) {
				uni.showToast({ title: '列表获取失败', icon: 'none' });
			} finally {
				this.isRefreshing = false;
			}
		},
		// 下拉刷新
		onRefresh() {
			this.isRefreshing = true;
			this.fetchList(true);
		},
		// 上拉加载
		onLoadMore() {
			if (this.hasMore) {
				this.page++;
				this.fetchList();
			}
		},
		// 退票操作
		handleRefund(id) {
			uni.showModal({
				title: '确认退票',
				content: '退票后将无法恢复，是否继续？',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({ title: '处理中...' });
						try {
							const result = await uniCloud.callFunction({
								name: 'reserve-refund',
								data: { reserveId: id, userId: this.userId }
							});
							uni.hideLoading();
							if (result.result.code === 200) {
								uni.showToast({ title: '退票成功' });
								this.fetchList(true); // 刷新列表
							} else {
								uni.showToast({ title: result.result.msg, icon: 'none' });
							}
						} catch (e) {
							uni.hideLoading();
							uni.showToast({ title: '网络异常', icon: 'none' });
						}
					}
				}
			});
		},
		// 打开改期弹窗
		openReschedule(item) {
			this.rescheduleId = item._id;
			this.rescheduleData.date = item.date;
			this.rescheduleData.time = item.time;
			this.showRescheduleModal = true;
		},
		closeReschedule() {
			this.showRescheduleModal = false;
		},
		// 确认改期
		async handleReschedule() {
			uni.showLoading({ title: '正在提交...' });
			try {
				const res = await uniCloud.callFunction({
					name: 'reserve-change',
					data: {
						reserveId: this.rescheduleId,
						userId: this.userId,
						newDate: this.rescheduleData.date,
						newTime: this.rescheduleData.time
					}
				});
				uni.hideLoading();
				if (res.result.code === 200) {
					uni.showToast({ title: '改期成功' });
					this.closeReschedule();
					this.fetchList(true);
				} else {
					uni.showToast({ title: res.result.msg, icon: 'none' });
				}
			} catch (e) {
				uni.hideLoading();
				uni.showToast({ title: '改期失败', icon: 'none' });
			}
		},
		// 样式辅助函数
		getStatusClass(status) {
			switch(status) {
				case '正常': return 'status-normal';
				case '已退票': return 'status-refunded';
				case '已改期': return 'status-changed';
				default: return '';
			}
		},
		getDayOfWeek(dateStr) {
			const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
			const date = new Date(dateStr);
			return weeks[date.getDay()];
		},
		initFutureDates() {
			const list = [];
			for (let i = 0; i < 7; i++) {
				const date = new Date();
				date.setDate(date.getDate() + i);
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				list.push({
					label: `${month}-${day}`,
					value: `${date.getFullYear()}-${month}-${day}`
				});
			}
			this.futureDates = list;
		},
		goToReserve() {
			uni.navigateTo({
				url: '/pages/module4/reserve'
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

.reserve-card {
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
		
		.id {
			font-size: 24rpx;
			color: #999;
		}
		
		.status {
			font-size: 26rpx;
			font-weight: bold;
			
			&-normal { color: #8b0000; }
			&-refunded { color: #999; }
			&-changed { color: #e6a23c; }
		}
	}
	
	.info-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16rpx;
		
		.label {
			font-size: 28rpx;
			color: #666;
		}
		
		.value {
			font-size: 28rpx;
			color: #333;
			font-weight: 500;
		}
	}
	
	.card-footer {
		display: flex;
		justify-content: flex-end;
		gap: 20rpx;
		margin-top: 30rpx;
		padding-top: 20rpx;
		border-top: 1rpx dashed #eee;
		
		.btn {
			margin: 0;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 26rpx;
			border-radius: 30rpx;
			padding: 0 40rpx;
			
			&::after { border: none; }
		}
		
		.change-btn {
			background-color: #fff;
			color: #e6a23c;
			border: 1rpx solid #e6a23c;
		}
		
		.refund-btn {
			background-color: #fff;
			color: #999;
			border: 1rpx solid #999;
		}
	}
}

.load-status {
	text-align: center;
	padding: 40rpx 0;
	font-size: 24rpx;
	color: #999;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 200rpx;
	
	.empty-img {
		width: 200rpx;
		height: 200rpx;
		opacity: 0.2;
	}
	
	.empty-text {
		font-size: 28rpx;
		color: #999;
		margin-top: 30rpx;
	}
	
	.go-reserve-btn {
		margin-top: 50rpx;
		width: 300rpx;
		height: 80rpx;
		background-color: #8b0000;
		color: #fff;
		border-radius: 40rpx;
		font-size: 28rpx;
	}
}

/* 自定义弹窗样式 */
.modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0,0,0,0.6);
	z-index: 999;
	display: flex;
	align-items: flex-end;
}

.popup-content {
	width: 100%;
	background-color: #fff;
	padding: 40rpx;
	border-radius: 30rpx 30rpx 0 0;
	box-sizing: border-box;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40rpx;
	
	.popup-title {
		font-size: 32rpx;
		font-weight: bold;
	}
	
	.close-btn {
		font-size: 48rpx;
		color: #999;
		padding: 10rpx;
	}
}

.section {
	margin-bottom: 40rpx;
	
	.section-title {
		display: block;
		font-size: 28rpx;
		color: #666;
		margin-bottom: 20rpx;
	}
}

.date-scroll {
	white-space: nowrap;
	
	.date-item {
		display: inline-block;
		padding: 16rpx 30rpx;
		background-color: #f5f5f5;
		margin-right: 20rpx;
		border-radius: 8rpx;
		font-size: 26rpx;
		
		&.active {
			background-color: #8b0000;
			color: #fff;
		}
	}
}

.time-group {
	display: flex;
	gap: 20rpx;
	
	.time-item {
		flex: 1;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #f5f5f5;
		border-radius: 8rpx;
		font-size: 26rpx;
		
		&.active {
			background-color: #8b0000;
			color: #fff;
		}
	}
}

.confirm-btn {
	margin-top: 60rpx;
	background-color: #8b0000;
	color: #fff;
	height: 90rpx;
	border-radius: 45rpx;
	font-size: 32rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
