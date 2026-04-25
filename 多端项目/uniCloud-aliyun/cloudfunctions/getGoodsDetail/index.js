'use strict';
exports.main = async (event, context) => {
  const db = uniCloud.database()
  const collection = db.collection('goods')
  
  const { goodsId } = event
  
  if (!goodsId) {
    return {
      code: 1,
      message: '商品ID不能为空'
    }
  }
  
  const res = await collection.doc(goodsId).get()
  
  if (res.data.length === 0) {
    return {
      code: 1,
      message: '商品不存在'
    }
  }
  
  return {
    code: 0,
    message: '获取商品详情成功',
    data: res.data[0]
  }
}