'use strict';
exports.main = async (event, context) => {
  const db = uniCloud.database()
  
  try {
    const { token, orderId } = event
    
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
    
    if (!orderId) {
      return {
        code: 1,
        message: '订单ID不能为空'
      }
    }
    
    const orderRes = await db.collection('order').doc(orderId).get()
    if (orderRes.data.length === 0) {
      return {
        code: 1,
        message: '订单不存在'
      }
    }
    
    const order = orderRes.data[0]
    if (order.userId !== userId) {
      return {
        code: 1,
        message: '无权查看此订单'
      }
    }
    
    return {
      code: 0,
      message: '获取订单详情成功',
      data: order
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    return {
      code: 1,
      message: '获取订单详情失败'
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