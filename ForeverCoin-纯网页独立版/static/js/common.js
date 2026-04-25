// 公共JS函数

// 页面切换函数
function showPage(pageId) {
    // 隐藏所有页面
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 更新导航状态
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // 滚动到顶部
    window.scrollTo(0, 0);
}

// 本地存储操作
function setStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('存储失败:', e);
        return false;
    }
}

function getStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
        console.error('读取失败:', e);
        return defaultValue;
    }
}

function removeStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('删除失败:', e);
        return false;
    }
}

// 网络请求封装
function request(url, options = {}) {
    return fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('网络请求失败');
        }
        return response.json();
    })
    .catch(error => {
        console.error('请求错误:', error);
        alert('网络请求失败，请稍后重试');
        throw error;
    });
}

// 提示框
function showToast(message, duration = 2000) {
    // 创建提示框元素
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.7);
        color: #fff;
        padding: 10px 20px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 9999;
    `;
    toast.textContent = message;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 定时移除
    setTimeout(() => {
        toast.remove();
    }, duration);
}

// 确认框
function showConfirm(message, callback) {
    if (confirm(message)) {
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
}

// 图片上传处理
function handleImageUpload(inputId, previewId, callback) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (preview) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                }
                if (callback && typeof callback === 'function') {
                    callback(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// 生成随机ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 格式化时间
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN');
}

// 计算距离
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
    return 2 * R * Math.asin(Math.sqrt(a));
}

// 模拟AI调用
function callAI(prompt) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 简单的模拟回复
            if (prompt.includes('景点')) {
                resolve('故宫博物院是中国明清两代的皇家宫殿，是世界上现存规模最大、保存最为完整的木质结构古建筑之一。');
            } else if (prompt.includes('路线')) {
                resolve('建议您从午门进入故宫，依次参观太和殿、中和殿、保和殿，然后前往御花园，最后从神武门离开。');
            } else {
                resolve('很高兴为您服务，请问您想了解什么关于文旅的信息？');
            }
        }, 1000);
    });
}

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    console.log('页面加载完成');
});