'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const { userId, page = 1, pageSize = 10 } = event;
	
	if (!userId) {
		return { code: 400, msg: '参数缺失: userId' };
	}
	
	const skip = (page - 1) * pageSize;
	
	const res = await db.collection('reserve')
		.where({ userId })
		.orderBy('createTime', 'desc')
		.skip(skip)
		.limit(pageSize)
		.get();
		
	return {
		code: 200,
		msg: '获取成功',
		data: res.data
	};
};
