<template>
  <view class="realname-container">
    <view class="realname-card">
      <view class="logo-section">
        <view class="logo">🆔</view>
        <view class="title">实名认证</view>
        <view class="subtitle">完善个人信息，享受完整服务</view>
      </view>

      <view class="form-section">
        <view class="input-group">
          <view class="input-label">真实姓名</view>
          <input 
            class="input-field" 
            v-model="realName" 
            placeholder="请输入真实姓名" 
            placeholder-class="input-placeholder"
          />
        </view>

        <view class="input-group">
          <view class="input-label">身份证号</view>
          <input 
            class="input-field" 
            v-model="idCard" 
            placeholder="请输入身份证号" 
            placeholder-class="input-placeholder"
            maxlength="18"
          />
        </view>

        <view class="input-group">
          <view class="input-label">手机号码</view>
          <input 
            class="input-field" 
            v-model="phoneNumber" 
            placeholder="请输入手机号码" 
            placeholder-class="input-placeholder"
            maxlength="11"
            type="number"
          />
        </view>

        <view class="error-message" v-if="errorMessage">{{ errorMessage }}</view>

        <button class="submit-btn" @click="handleSubmit">提交认证</button>

        <view class="back-link" @click="goBack">
          <text>返回</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      realName: '',
      idCard: '',
      phoneNumber: '',
      errorMessage: ''
    }
  },
  methods: {
    handleSubmit() {
      if (!this.realName || !this.idCard || !this.phoneNumber) {
        this.errorMessage = '请填写完整信息';
        return;
      }

      if (this.realName.length < 2) {
        this.errorMessage = '姓名格式不正确';
        return;
      }

      const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!idCardReg.test(this.idCard)) {
        this.errorMessage = '身份证号格式不正确';
        return;
      }

      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(this.phoneNumber)) {
        this.errorMessage = '手机号码格式不正确';
        return;
      }

      uni.setStorageSync('realNameInfo', {
        realName: this.realName,
        idCard: this.idCard,
        phoneNumber: this.phoneNumber
      });

      this.errorMessage = '';
      uni.showToast({
        title: '认证成功',
        icon: 'success',
        duration: 1500
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    },
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style scoped>
.realname-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #8B0000 0%, #b22222 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.realname-card {
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

.submit-btn {
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

.back-link {
  font-size: 14px;
  color: #8B0000;
  text-align: center;
  cursor: pointer;
  padding: 10px;
}

.back-link text {
  border-bottom: 1px solid #8B0000;
  padding-bottom: 2px;
}
</style>
