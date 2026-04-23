'use strict';
exports.main = async (event, context) => {
  const db = uniCloud.database()
  
  try {
    const { token, status, page = 1, pageSize = 10 } = event
    
    if (!token) {
      return {
        code: 1,
        message: '请先登录'
      }
    }
    
    const userId = getUserIdFromToken(token)
    if (!userId) {
      return {
        code: 1,
        message: '登录已过期，请重新登录'
      }
    }
    
    let query = db.collection('order').where({ userId: userId })
    
    if (status) {
      query = query.where({ status: status })
    }
    
    const total = await query.count()
    const data = await query.orderBy('createTime', 'desc').skip((page - 1) * pageSize).limit(pageSize).get()
    
    return {
      code: 0,
      message: '获取订单列表成功',
      data: data.data,
      total: total.total
    }
  } catch (error) {
    console.error('获取订单列表失败:', error)
    return {
      code: 1,
      message: '获取订单列表失败'
    }
  }
}

function getUserIdFromToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const parts = decoded.split('_')
    if (parts.length >= 1) {
      return parts[0]
    }
  } catch (e) {
    return null
  }
  return null
}