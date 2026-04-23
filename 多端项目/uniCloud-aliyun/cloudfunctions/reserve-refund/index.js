'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const { reserveId, userId } = event;
	
	if (!reserveId || !userId) {
		return { code: 400, msg: '参数缺失' };
	}
	
	const checkRes = await db.collection('reserve').doc(reserveId).get();
	if (checkRes.data.length === 0) {
		return { code: 404, msg: '预约记录不存在' };
	}
	
	const reserve = checkRes.data[0];
	if (reserve.userId !== userId) {
		return { code: 403, msg: '权限不足' };
	}
	
	if (reserve.status !== '正常') {
		return { code: 400, msg: `当前状态为${reserve.status}，不可退票` };
	}
	
	await db.collection('reserve').doc(reserveId).update({
		status: '已退票',
		updateTime: Date.now()
	});
	
	return {
		code: 200,
		msg: '退票成功'
	};
};
