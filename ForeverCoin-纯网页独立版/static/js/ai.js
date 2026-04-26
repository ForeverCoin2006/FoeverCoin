// AI API调用模块

// 配置信息
const AI_CONFIG = {
  API_KEY: "ef264d88-2bd2-4e2e-bfab-188914a162ce",
  MODEL_ID: "doubao-seed-1-8-251228",
  BASE_URL: "https://ark.cn-beijing.volces.com/api/v3/chat/completions"
};

/**
 * 调用AI API
 * @param {string} prompt - 提示词
 * @param {object} options - 可选参数
 * @returns {Promise<string>} AI响应
 */
async function callAI(prompt, options = {}) {
  try {
    const response = await fetch(AI_CONFIG.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.MODEL_ID,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
        top_p: options.topP || 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API错误:', response.status, errorText);
      throw new Error(`API调用失败: ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      console.error('API返回格式错误:', data);
      throw new Error('API返回格式错误');
    }
  } catch (error) {
    console.error('AI API调用错误:', error);
    return getMockResponse(prompt);
  }
}

/**
 * 模拟AI响应（作为备用）
 * @param {string} prompt - 提示词
 * @returns {string} 模拟响应
 */
function getMockResponse(prompt) {
  if (prompt.includes('景点')) {
    return '故宫博物院是中国明清两代的皇家宫殿，是世界上现存规模最大、保存最为完整的木质结构古建筑之一。';
  } else if (prompt.includes('路线')) {
    return '建议您从午门进入故宫，依次参观太和殿、中和殿、保和殿，然后前往御花园，最后从神武门离开。';
  } else if (prompt.includes('太和殿')) {
    return '太和殿是故宫的正殿，建于明永乐十八年，是明清两代皇帝举行大典的地方，也是中国古代宫殿建筑的杰出代表。';
  } else if (prompt.includes('午门')) {
    return '午门是故宫的正门，建于明永乐十八年，是皇帝举行重大典礼的地方，也是故宫的标志性建筑之一。';
  } else if (prompt.includes('规划路线')) {
    return '1. 从午门进入故宫\n2. 参观太和殿，预计停留30分钟\n3. 参观中和殿，预计停留15分钟\n4. 参观保和殿，预计停留20分钟\n5. 前往御花园，预计停留40分钟\n6. 从神武门离开故宫';
  } else {
    return '很高兴为您服务，请问您想了解什么关于文旅的信息？';
  }
}

// 导出到全局
if (typeof window !== 'undefined') {
  window.callAI = callAI;
}