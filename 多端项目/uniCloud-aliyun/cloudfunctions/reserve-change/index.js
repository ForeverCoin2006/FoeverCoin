'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const { reserveId, userId, newDate, newTime } = event;
	
	if (!reserveId || !userId || !newDate || !newTime) {
		return { code: 400, msg: '参数缺失' };
	}
	
	// 1. 查找预约记录
	const checkRes = await db.collection('reserve').doc(reserveId).get();
	if (checkRes.data.length === 0) {
		return { code: 404, msg: '预约记录不存在' };
	}
	
	const reserve = checkRes.data[0];
	if (reserve.userId !== userId) {
		return { code: 403, msg: '权限不足' };
	}
	
	if (reserve.status !== '正常') {
		return { code: 400, msg: `当前状态为${reserve.status}，不可改期` };
	}
	
	// 2. 校验：禁止同一用户同一天同时段重复预约
	const duplicateRes = await db.collection('reserve').where({
		userId,
		date: newDate,
		time: newTime,
		status: '正常'
	}).get();
	
	if (duplicateRes.data.length > 0) {
		return { code: 400, msg: '您已在改期的时间段内有预约，请勿重复预约' };
	}
	
	// 3. 更新记录
	await db.collection('reserve').doc(reserveId).update({
		date: newDate,
		time: newTime,
		status: '已改期',
		updateTime: Date.now()
	});
	
	return {
		code: 200,
		msg: '改期成功'
	};
};
