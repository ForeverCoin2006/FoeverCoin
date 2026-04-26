'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const { userId, action, data } = event;
	
	if (!userId) {
		return { code: 400, msg: 'userId缺失' };
	}
	
	const collection = db.collection('user');
	
	if (action === 'get') {
		const res = await collection.where({ userId }).get();
		if (res.data.length === 0) {
			// 如果不存在则初始化一个
			const newUser = {
				userId,
				name: '',
				phone: '',
				idCard: '',
				createTime: Date.now()
			};
			await collection.add(newUser);
			return { code: 200, data: newUser };
		}
		return { code: 200, data: res.data[0] };
	}
	
	if (action === 'update') {
		const { name, phone, idCard } = data;
		const res = await collection.where({ userId }).update({
			name,
			phone,
			idCard,
			updateTime: Date.now()
		});
		return { code: 200, msg: '更新成功' };
	}
	
	return { code: 400, msg: '无效操作' };
};
