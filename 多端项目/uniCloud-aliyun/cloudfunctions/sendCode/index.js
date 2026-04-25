'use strict';
exports.main = async (event, context) => {
  const db = uniCloud.database()
  const collection = db.collection('verify_code')
  
  const { phoneNumber, type } = event
  
  if (!phoneNumber || !type) {
    return {
      code: 1,
      message: '参数错误'
    }
  }
  
  if (!/^1\d{10}$/.test(phoneNumber)) {
    return {
      code: 1,
      message: '手机号格式不正确'
    }
  }
  
  const now = Date.now()
  
  const recentRes = await collection.where({
    phoneNumber: phoneNumber,
    type: type,
    createTime: db.command.gte(now - 60 * 1000)
  }).get()
  
  if (recentRes.data.length > 0) {
    return {
      code: 1,
      message: '验证码发送过于频繁，请稍后再试'
    }
  }
  
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  
  await collection.add({
    phoneNumber: phoneNumber,
    code: code,
    type: type,
    createTime: now
  })
  
  console.log(`验证码已发送到 ${phoneNumber}: ${code}`)
  
  return {
    code: 0,
    message: '验证码发送成功'
  }
}