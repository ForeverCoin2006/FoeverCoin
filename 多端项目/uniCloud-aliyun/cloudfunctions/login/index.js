'use strict';
exports.main = async (event, context) => {
  const db = uniCloud.database()
  const collection = db.collection('user')
  
  const { type, username, password, phoneNumber, code } = event
  
  if (type === 'account') {
    const res = await collection.where({
      username: username
    }).get()
    
    if (res.data.length === 0) {
      return {
        code: 1,
        message: '账号不存在'
      }
    }
    
    const user = res.data[0]
    
    if (user.password !== password) {
      return {
        code: 1,
        message: '密码错误'
      }
    }
    
    return {
      code: 0,
      message: '登录成功',
      token: generateToken(user._id),
      userInfo: {
        userId: user._id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        realName: user.realName,
        isVerified: user.isVerified || false
      }
    }
  } else if (type === 'phone') {
    const res = await collection.where({
      phoneNumber: phoneNumber
    }).get()
    
    if (res.data.length === 0) {
      return {
        code: 1,
        message: '手机号未注册'
      }
    }
    
    const user = res.data[0]
    
    const codeRes = await db.collection('verify_code').where({
      phoneNumber: phoneNumber,
      code: code,
      type: 'login'
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
    
    return {
      code: 0,
      message: '登录成功',
      token: generateToken(user._id),
      userInfo: {
        userId: user._id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        realName: user.realName,
        isVerified: user.isVerified || false
      }
    }
  }
  
  return {
    code: 1,
    message: '参数错误'
  }
}

function generateToken(userId) {
  const timestamp = Date.now()
  return Buffer.from(`${userId}_${timestamp}`).toString('base64')
}