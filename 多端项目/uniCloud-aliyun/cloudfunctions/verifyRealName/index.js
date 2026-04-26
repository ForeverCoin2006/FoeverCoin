'use strict';
exports.main = async (event, context) => {
  const db = uniCloud.database()
  const collection = db.collection('user')
  
  const { realName, idCard } = event
  
  const token = event.token || context.TOKEN || ''
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
  
  const userRes = await collection.doc(userId).get()
  
  if (userRes.data.length === 0) {
    return {
      code: 1,
      message: '用户不存在'
    }
  }
  
  const user = userRes.data[0]
  
  if (user.isVerified) {
    return {
      code: 1,
      message: '已完成实名核验，无需重复提交'
    }
  }
  
  if (!/^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(idCard)) {
    return {
      code: 1,
      message: '身份证号格式不正确'
    }
  }
  
  const updateRes = await collection.doc(userId).update({
    realName: realName,
    idCard: idCard,
    isVerified: true,
    verifyTime: Date.now(),
    updateTime: Date.now()
  })
  
  if (updateRes.updated > 0) {
    return {
      code: 0,
      message: '实名核验成功'
    }
  } else {
    return {
      code: 1,
      message: '核验失败'
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