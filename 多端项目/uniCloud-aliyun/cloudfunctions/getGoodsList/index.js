'use strict';
exports.main = async (event, context) => {
  const db = uniCloud.database()
  const collection = db.collection('goods')
  
  const { category, keyword, page = 1, pageSize = 10 } = event
  
  let query = collection
  
  if (category) {
    query = query.where({ category: category })
  }
  
  if (keyword) {
    query = query.where({
      name: db.command.includes(keyword)
    })
  }
  
  const total = await query.count()
  const data = await query.skip((page - 1) * pageSize).limit(pageSize).get()
  
  return {
    code: 0,
    message: '获取商品列表成功',
    data: data.data,
    total: total.total
  }
}