'use strict';
exports.main = async (event, context) => {
  const db = uniCloud.database()
  
  try {
    const { token, orderId, reason, description, images } = event
    
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
    
    if (!orderId || !reason || !description) {
      return {
        code: 1,
        message: '参数错误'
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
        message: '无权操作此订单'
      }
    }
    
    if (order.status !== 'completed') {
      return {
        code: 1,
        message: '只有已完成的订单才能申请售后'
      }
    }
    
    const afterSaleData = {
      orderId: orderId,
      userId: userId,
      reason: reason,
      description: description,
      images: images || [],
      status: 'pending',
      createTime: Date.now(),
      updateTime: Date.now()
    }
    
    await db.collection('after_sale').add(afterSaleData)
    
    return {
      code: 0,
      message: '售后申请提交成功'
    }
  } catch (error) {
    console.error('提交售后申请失败:', error)
    return {
      code: 1,
      message: '提交售后申请失败'
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