'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const { userId, ticketType, date, time } = event;
	
	if (!userId || !ticketType || !date || !time) {
		return { code: 400, msg: '参数缺失' };
	}
	
	// 校验：禁止同一用户同一天同时段重复预约
	const checkRes = await db.collection('reserve').where({
		userId,
		date,
		time,
		status: '正常'
	}).get();
	
	if (checkRes.data.length > 0) {
		return { code: 400, msg: '您已预约该时段，请勿重复预约' };
	}
	
	const res = await db.collection('reserve').add({
		userId,
		ticketType,
		date,
		time,
		status: '正常',
		createTime: Date.now()
	});
	
	// 严格使用 reserveId 字段 (更新刚生成的 _id 为 reserveId)
	await db.collection('reserve').doc(res.id).update({
		reserveId: res.id
	});
	
	return {
		code: 200,
		msg: '预约成功',
		data: {
			reserveId: res.id
		}
	};
};
