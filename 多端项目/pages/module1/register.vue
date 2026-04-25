<template>
  <view class="register-container">
    <view class="register-card">
      <view class="logo-section">
        <view class="logo">🏛️</view>
        <view class="title">新人注册</view>
        <view class="subtitle">加入智游文创，开启文化之旅</view>
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

        <view class="input-group">
          <view class="input-label">确认密码</view>
          <input 
            class="input-field" 
            v-model="confirmPassword" 
            type="password" 
            placeholder="请再次输入密码" 
            placeholder-class="input-placeholder"
          />
        </view>

        <view class="error-message" v-if="errorMessage">{{ errorMessage }}</view>

        <button class="register-btn" @click="handleRegister">注册</button>

        <view class="login-link" @click="goToLogin">
          <text>已有账号？去登录</text>
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
      confirmPassword: '',
      errorMessage: ''
    }
  },
  methods: {
    handleRegister() {
      if (!this.username || !this.password || !this.confirmPassword) {
        this.errorMessage = '请填写完整信息';
        return;
      }

      if (this.password.length < 6) {
        this.errorMessage = '密码长度不能少于6位';
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.errorMessage = '密码确认与密码不一样';
        return;
      }

      const registeredUsers = uni.getStorageSync('registeredUsers') || [];
      const existingUser = registeredUsers.find(u => u.username === this.username);

      if (existingUser) {
        this.errorMessage = '账号已存在';
        return;
      }

      registeredUsers.push({
        username: this.username,
        password: this.password
      });
      uni.setStorageSync('registeredUsers', registeredUsers);

      this.errorMessage = '';
      uni.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 1500
      });
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/module1/login'
        });
      }, 1500);
    },
    goToLogin() {
      uni.navigateTo({
        url: '/pages/module1/login'
      });
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #8B0000 0%, #b22222 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-card {
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

.register-btn {
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

.login-link {
  font-size: 14px;
  color: #8B0000;
  text-align: center;
  cursor: pointer;
  padding: 10px;
}

.login-link text {
  border-bottom: 1px solid #8B0000;
  padding-bottom: 2px;
}
</style>
