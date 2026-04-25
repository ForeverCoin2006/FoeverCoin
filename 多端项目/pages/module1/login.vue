<template>
  <view class="login-container">
    <view class="login-card">
      <view class="logo-section">
        <view class="logo">🏛️</view>
        <view class="title">智游文创</view>
        <view class="subtitle">故宫文旅 · 智慧体验</view>
      </view>

      <view class="form-section">
        <view class="input-group">
          <view class="input-label">账号</view>
          <input 
            class="input-field" 
            v-model="username" 
            placeholder="请输入账号" 
            placeholder-class="input-placeholder"
          />
        </view>

        <view class="input-group">
          <view class="input-label">密码</view>
          <input 
            class="input-field" 
            v-model="password" 
            type="password" 
            placeholder="请输入密码" 
            placeholder-class="input-placeholder"
          />
        </view>

        <view class="error-message" v-if="errorMessage">{{ errorMessage }}</view>

        <button class="login-btn" @click="handleLogin">登录</button>

        <view class="register-link" @click="goToRegister">
          <text>新人注册</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    handleLogin() {
      if (!this.username || !this.password) {
        this.errorMessage = '请输入账号和密码';
        return;
      }

      const registeredUsers = uni.getStorageSync('registeredUsers') || [];
      const user = registeredUsers.find(u => u.username === this.username);

      if (!user) {
        this.errorMessage = '账号错误';
      } else if (user.password !== this.password) {
        this.errorMessage = '密码错误';
      } else {
        this.errorMessage = '';
        uni.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    },
    goToRegister() {
      uni.navigateTo({
        url: '/pages/module1/register'
      });
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #8B0000 0%, #b22222 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  background: #fff;
  border-radius: 20px;
  padding: 40px 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  font-size: 60px;
  margin-bottom: 10px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #8B0000;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #666;
}

.form-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-group {
  width: 100%;
  margin-bottom: 20px;
}

.input-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.input-field {
  width: 100%;
  height: 48px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 15px;
  background: #f9f9f9;
  box-sizing: border-box;
}

.input-placeholder {
  color: #999;
}

.error-message {
  color: #f44336;
  font-size: 13px;
  margin-bottom: 15px;
  text-align: center;
  padding: 8px 12px;
  background: #ffebee;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
}

.login-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #8B0000, #b22222);
  color: #fff;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-link {
  font-size: 14px;
  color: #8B0000;
  text-align: center;
  cursor: pointer;
  padding: 10px;
}

.register-link text {
  border-bottom: 1px solid #8B0000;
  padding-bottom: 2px;
}
</style>
