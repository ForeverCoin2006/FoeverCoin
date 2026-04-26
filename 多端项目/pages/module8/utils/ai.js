export function callAI(prompt) {
  return new Promise((resolve, reject) => {
    uniCloud.callFunction({
      name: 'aiAgent',
      data: {
        prompt: prompt
      },
      success: (res) => {
        if (res.result && res.result.reply) {
          resolve(res.result.reply);
        } else {
          resolve('抱歉，AI 暂时无法回答您的问题。');
        }
      },
      fail: (err) => {
        console.error('AI 调用失败:', err);
        reject(err);
      }
    });
  });
}