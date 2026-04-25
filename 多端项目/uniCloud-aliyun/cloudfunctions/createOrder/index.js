'use strict';
exports.main = async (event, context) => {
  const db = uniCloud.database()
  const transaction = await db.startTransaction()
  
  try {
    const { token, goodsId, quantity, address, shippingFee, totalPrice, remark } = event
    
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
    
    if (!goodsId || !quantity || !address) {
      return {
        code: 1,
        message: '参数错误'
      }
    }
    
    const goodsRes = await transaction.collection('goods').doc(goodsId).get()
    if (goodsRes.data.length === 0) {
      await transaction.rollback()
      return {
        code: 1,
        message: '商品不存在'
      }
    }
    
    const goods = goodsRes.data[0]
    if (goods.stock < quantity) {
      await transaction.rollback()
      return {
        code: 1,
        message: '商品库存不足'
      }
    }
    
    const orderNo = generateOrderNo()
    const now = Date.now()
    
    const orderData = {
      orderNo: orderNo,
      userId: userId,
      goodsId: goodsId,
      goodsName: goods.name,
      goodsPrice: goods.price,
      quantity: quantity,
      address: address,
      shippingFee: shippingFee,
      totalPrice: totalPrice,
      remark: remark,
      status: 'pending',
      createTime: now,
      updateTime: now
    }
    
    const addOrderRes = await transaction.collection('order').add(orderData)
    
    await transaction.collection('goods').doc(goodsId).update({
      stock: goods.stock - quantity,
      updateTime: now
    })
    
    await transaction.commit()
    
    return {
      code: 0,
      message: '订单创建成功',
      orderId: addOrderRes.id,
      orderNo: orderNo
    }
  } catch (error) {
    await transaction.rollback()
    console.error('创建订单失败:', error)
    return {
      code: 1,
      message: '订单创建失败'
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

function generateOrderNo() {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ORD${timestamp}${random}`
}