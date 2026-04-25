'use strict';
exports.main = async (event, context) => {
  const db = uniCloud.database()
  const collection = db.collection('user')
  
  const { username, password, phoneNumber, code } = event
  
  const usernameRes = await collection.where({
    username: username
  }).get()
  
  if (usernameRes.data.length > 0) {
    return {
      code: 1,
      message: '账号已存在'
    }
  }
  
  const phoneRes = await collection.where({
    phoneNumber: phoneNumber
  }).get()
  
  if (phoneRes.data.length > 0) {
    return {
      code: 1,
      message: '手机号已注册'
    }
  }
  
  const codeRes = await db.collection('verify_code').where({
    phoneNumber: phoneNumber,
    code: code,
    type: 'register'
  }).orderBy('createTime', 'desc').limit(1).get()
  
  if (codeRes.data.length === 0) {
    return {
      code: 1,
      message: '验证码错误'
    }
  }
  
  const verifyCode = codeRes.data[0]
  const now = Date.now()
  if (now - verifyCode.createTime > 5 * 60 * 1000) {
    return {
      code: 1,
      message: '验证码已过期'
    }
  }
  
  const addRes = await collection.add({
    username: username,
    password: password,
    phoneNumber: phoneNumber,
    realName: '',
    isVerified: false,
    createTime: now,
    updateTime: now
  })
  
  if (addRes.id) {
    return {
      code: 0,
      message: '注册成功',
      userId: addRes.id
    }
  } else {
    return {
      code: 1,
      message: '注册失败'
    }
  }
}