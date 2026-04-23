'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const { userId } = event;
	
	if (!userId) {
		return { code: 400, msg: 'userId缺失' };
	}
	
	const collection = db.collection('order');
	
	// 按 userId 查询所有订单，按创建时间降序
	const res = await collection.where({ userId })
		.orderBy('createTime', 'desc')
		.get();
		
	return {
		code: 200,
		msg: '获取成功',
		data: res.data
	};
};
