<template>
  <view class="container">
    <!-- 首页 -->
    <view id="page-home" class="page" :class="{ active: currentPage === 'page-home' }">
      <view class="banner">
        <view class="title">智游文创</view>
        <view style="font-size: 12px; opacity: 0.8; margin-top: 5px;">AI 赋能 · 智慧文旅新体验</view>
      </view>
      <view class="nav-grid">
        <view class="grid-item" @click="showPage('page-map')"><view class="icon-box red">🗺️</view><view class="label">全景导览</view></view>
        <view class="grid-item"><view class="icon-box gold">🎫</view><view class="label">门票预约</view></view>
        <view class="grid-item" @click="showPage('page-mall')"><view class="icon-box green">🛍️</view><view class="label">文创商城</view></view>
        <view class="grid-item" @click="showPage('page-aigc')"><view class="icon-box blue">🎨</view><view class="label">AIGC定制</view></view>
        <view class="grid-item" @click="showPage('page-travel-photo')"><view class="icon-box purple">📸</view><view class="label">智能旅拍</view></view>
        <view class="grid-item" @click="showPage('page-exploration')"><view class="icon-box orange">🏆</view><view class="label">文化探索</view></view>
        <view class="grid-item" @click="showAIModal = true"><view class="icon-box red">🤖</view><view class="label">AI管家</view></view>
      </view>
      <view class="section">
        <view class="section-title">热门推荐</view>
        <view class="card" style="padding:0; overflow:hidden;">
          <view style="height:150px; background:#ddd; display:flex; align-items:center; justify-content:center; font-size:40px;">🏛️</view>
          <view style="padding:10px;">
            <view style="font-weight:bold;">故宫博物院 - 千里江山特展</view>
            <view style="font-size:12px; color:#666; margin-top:5px;">沉浸式感受北宋名画的壮丽意境</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 导览页 -->
    <view id="page-map" class="page" :class="{ active: currentPage === 'page-map' }">
      <view class="scenic-tabs">
        <view class="scenic-tab" :class="{ active: currentScenic === 'gugong' }" @click="switchScenic('gugong')">故宫</view>
        <view class="scenic-tab" :class="{ active: currentScenic === 'yiheyuan' }" @click="switchScenic('yiheyuan')">颐和园</view>
        <view class="scenic-tab" :class="{ active: currentScenic === 'tiantan' }" @click="switchScenic('tiantan')">天坛</view>
        <view class="scenic-tab" :class="{ active: currentScenic === 'ditan' }" @click="switchScenic('ditan')">地坛</view>
      </view>
      <view class="map-container" id="map-container">
        <image :src="mapImage" class="map-img" id="main-map" mode="widthFix"></image>
        <view id="markers-layer">
          <view v-for="(marker, index) in currentMarkers" :key="index" class="marker" :style="{ left: marker.x + '%', top: marker.y + '%' }" @click="showDetail(marker)">
            <view class="marker-dot"></view>
            <view class="marker-name">{{ marker.name }}</view>
          </view>
        </view>
      </view>
      <view class="point-detail" id="point-detail" v-show="showDetailPanel">
        <view style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <text style="font-weight:bold; color:var(--palace-red); font-size:18px;">{{ selectedMarker.name }}</text>
          <text @click="closeDetail" style="cursor:pointer; font-size:20px; color:#999;">✕</text>
        </view>
        <view style="font-size:14px; color:#666; line-height:1.6;">{{ selectedMarker.desc }}</view>
        <view style="margin-top:15px; display:flex; gap:10px;">
          <button class="btn" style="flex:1; background:#f0f0f0; color:#333;">🔊 语音讲解</button>
          <button class="btn" style="flex:1;">🚩 开启导航</button>
        </view>
      </view>
    </view>

    <!-- 文创商城 -->
    <view id="page-mall" class="page" :class="{ active: currentPage === 'page-mall' }">
      <view class="section">
        <view class="section-title">文创商城</view>
        <view class="card" style="padding:15px; display:flex; gap:12px; align-items:center; margin-bottom:12px;">
          <view style="width:70px; height:70px; background:#f2f2f2; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:28px;">🎐</view>
          <view style="flex:1;">
            <view style="font-weight:bold; font-size:14px;">故宫红韵·书签套装</view>
            <view style="font-size:12px; color:#666; margin-top:4px;">国风烫金 · 轻奢礼盒</view>
            <view style="margin-top:6px; display:flex; justify-content:space-between; align-items:center;">
              <view style="color:var(--palace-red); font-weight:bold;">¥ 39.9</view>
              <button class="btn" style="padding:6px 12px; font-size:12px;">加入购物车</button>
            </view>
          </view>
        </view>
        <view class="card" style="padding:15px; display:flex; gap:12px; align-items:center; margin-bottom:12px;">
          <view style="width:70px; height:70px; background:#f2f2f2; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:28px;">🧧</view>
          <view style="flex:1;">
            <view style="font-weight:bold; font-size:14px;">祥云纹·纪念徽章</view>
            <view style="font-size:12px; color:#666; margin-top:4px;">合金珐琅 · 限量款</view>
            <view style="margin-top:6px; display:flex; justify-content:space-between; align-items:center;">
              <view style="color:var(--palace-red); font-weight:bold;">¥ 29.9</view>
              <button class="btn" style="padding:6px 12px; font-size:12px;">立即购买</button>
            </view>
          </view>
        </view>
        <view class="card" style="padding:15px; display:flex; gap:12px; align-items:center;">
          <view style="width:70px; height:70px; background:#f2f2f2; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:28px;">🏺</view>
          <view style="flex:1;">
            <view style="font-weight:bold; font-size:14px;">青绿山水·明信片</view>
            <view style="font-size:12px; color:#666; margin-top:4px;">AIGC 定制同款 · 数字下载</view>
            <view style="margin-top:6px; display:flex; justify-content:space-between; align-items:center;">
              <view style="color:var(--palace-red); font-weight:bold;">¥ 9.9</view>
              <button class="btn" style="padding:6px 12px; font-size:12px;">立即购买</button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- AIGC 定制工坊 -->
    <view id="page-aigc" class="page" :class="{ active: currentPage === 'page-aigc' }">
      <view class="section">
        <view class="section-title">AIGC 文创定制</view>
        <view class="card">
          <view class="aigc-input-group">
            <text class="aigc-input-label">1. 上传参考图 (可选)</text>
            <view class="aigc-upload-box" @click="chooseAIGCImage">
              <view style="text-align:center; color:#999;" v-show="!aigcUploadedImg">
                <text style="font-size:24px;">📷</text>
                <text style="font-size:12px; display:block;">点击上传参考图片</text>
              </view>
              <image class="aigc-upload-preview" :src="aigcUploadedImg" v-show="aigcUploadedImg" mode="aspectFill"></image>
            </view>
          </view>

          <view class="aigc-input-group">
            <text class="aigc-input-label">2. 描述您的创意需求</text>
            <textarea class="aigc-prompt-input" v-model="aigcPrompt" placeholder="例如：我想生成一个带有祥云图案的故宫角楼明信片，风格要古典唯美..."></textarea>
          </view>

          <view class="aigc-input-group">
            <text class="aigc-input-label">3. 传统纹样选择</text>
            <view class="pattern-grid">
              <view class="pattern-item" :class="{ active: currentPattern === '无' }" @click="selectPattern('无')">无</view>
              <view class="pattern-item" :class="{ active: currentPattern === '祥云' }" @click="selectPattern('祥云')">祥云</view>
              <view class="pattern-item" :class="{ active: currentPattern === '宫殿' }" @click="selectPattern('宫殿')">宫殿</view>
              <view class="pattern-item" :class="{ active: currentPattern === '如意' }" @click="selectPattern('如意')">如意</view>
            </view>
          </view>

          <view style="font-size:14px; margin:15px 0 10px; font-weight:bold;">4. 选择定制类型 & 风格</view>
          <view style="display:flex; gap:10px; margin-bottom:10px;">
            <view class="btn aigc-type-btn" :class="{ active: currentAIGCType === '明信片', 'btn-secondary': currentAIGCType !== '明信片' }" @click="setAIGCType('明信片')">明信片</view>
            <view class="btn aigc-type-btn" :class="{ active: currentAIGCType === '书签', 'btn-secondary': currentAIGCType !== '书签' }" @click="setAIGCType('书签')">书签</view>
            <view class="btn aigc-type-btn" :class="{ active: currentAIGCType === '印章', 'btn-secondary': currentAIGCType !== '印章' }" @click="setAIGCType('印章')">印章</view>
          </view>
          <view class="template-grid">
            <view class="template-item" :class="{ active: currentAIGCStyle === '国潮水墨' }" @click="selectTemplate('国潮水墨', ['#f3e5f5', '#e1f5fe'])">
              <view style="width:100%; height:100%; background:linear-gradient(45deg, #f3e5f5, #e1f5fe);"></view>
              <text>国潮水墨</text>
            </view>
            <view class="template-item" :class="{ active: currentAIGCStyle === '故宫红韵' }" @click="selectTemplate('故宫红韵', ['#8B0000', '#FFD700'])">
              <view style="width:100%; height:100%; background:linear-gradient(45deg, #8B0000, #FFD700);"></view>
              <text>故宫红韵</text>
            </view>
            <view class="template-item" :class="{ active: currentAIGCStyle === '青绿山水' }" @click="selectTemplate('青绿山水', ['#1B5E20', '#A5D6A7'])">
              <view style="width:100%; height:100%; background:linear-gradient(45deg, #1B5E20, #A5D6A7);"></view>
              <text>青绿山水</text>
            </view>
            <view class="template-item" :class="{ active: currentAIGCStyle === '敦煌飞天' }" @click="selectTemplate('敦煌飞天', ['#E64A19', '#FFCC80'])">
              <view style="width:100%; height:100%; background:linear-gradient(45deg, #E64A19, #FFCC80);"></view>
              <text>敦煌飞天</text>
            </view>
            <view class="template-item" :class="{ active: currentAIGCStyle === '工笔白描' }" @click="selectTemplate('工笔白描', ['#EEEEEE', '#9E9E9E'])">
              <view style="width:100%; height:100%; background:linear-gradient(45deg, #EEEEEE, #9E9E9E);"></view>
              <text>工笔白描</text>
            </view>
            <view class="template-item" :class="{ active: currentAIGCStyle === '赛博宫廷' }" @click="selectTemplate('赛博宫廷', ['#311B92', '#00BCD4'])">
              <view style="width:100%; height:100%; background:linear-gradient(45deg, #311B92, #00BCD4);"></view>
              <text>赛博宫廷</text>
            </view>
          </view>
          <button class="btn" style="width:100%; margin-top:20px;" @click="generateAIGC">✨ AI 一键生成图片</button>

          <view v-show="showAIGCResult" style="margin-top:20px; text-align:center;">
            <view style="margin: 20px 0; font-weight: bold; color: var(--palace-red); display: flex; align-items: center; justify-content: center; gap: 5px;">
              <text style="font-size: 12px; background: #8B0000; color: #fff; padding: 2px 6px; border-radius: 4px;">AI 生成</text>
              <text>生成成功！</text>
            </view>
            <canvas canvas-id="aigcCanvas" id="aigc-canvas" style="width: 300px; height: 400px; border-radius: 10px; border: 1px solid #ddd;"></canvas>
            <view style="display: flex; gap: 10px; margin-top: 15px;">
              <button class="btn" style="flex: 1;" @click="downloadAIGCImage">📥 数字下载</button>
              <button class="btn btn-secondary" style="flex: 1;" @click="shareImage">🔗 分享</button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- AI 智能旅拍 -->
    <view id="page-travel-photo" class="page" :class="{ active: currentPage === 'page-travel-photo' }">
      <view class="section">
        <view class="section-title">AI 智能旅拍</view>
        <view class="card">
          <view v-show="!showVideoResult">
            <view class="photo-preview-container" @click="choosePhotoImage">
              <canvas canvas-id="photoCanvas" id="photo-canvas" style="width: 100%; height: 100%;"></canvas>
              <view class="photo-placeholder" v-show="!uploadedImg">点击上传照片 📷</view>
            </view>

            <view style="display:flex; gap:10px; margin-top:15px;">
              <button class="btn" style="flex:1;" @click="optimizePhoto">🪄 智能优化</button>
              <button class="btn btn-secondary" style="flex:1;" @click="toggleWatermark">🏷️ 水印开关</button>
            </view>

            <view style="margin-top:15px; background: #f9f9f9; padding: 10px; border-radius: 8px;">
              <view style="font-size:12px; color:var(--text-light); margin-bottom:8px; font-weight: bold;">视频设置</view>

              <view style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">
                <view style="font-size:12px; color:var(--text-light); flex-shrink:0;">背景音乐:</view>
                <button class="btn btn-secondary" style="flex:1; font-size:11px; padding: 5px;" @click="chooseAudioFile">📁 选择本地音源</button>
                <view style="font-size:11px; color:#4CAF50;" v-show="userAudioSrc">✅</view>
              </view>

              <view style="display:flex; gap:10px; align-items:center;">
                <view style="font-size:12px; color:var(--text-light); flex-shrink:0;">视频时长:</view>
                <view style="display:flex; flex:1; background:#eee; border-radius:15px; padding:2px;">
                  <view class="duration-tab" :class="{ active: VIDEO_DURATION === 5000 }" @click="setVideoDuration(5000)">5秒</view>
                  <view class="duration-tab" :class="{ active: VIDEO_DURATION === 10000 }" @click="setVideoDuration(10000)">10秒</view>
                </view>
              </view>
            </view>

            <button class="btn" style="width:100%; margin-top:15px; background:#4CAF50;" @click="oneClickMovie">🎬 一键成片 (Seedance 2.0)</button>
          </view>

          <view v-show="showVideoResult">
            <view style="margin-bottom: 15px; font-weight: bold; color: var(--palace-red); text-align: center;">✨ Seedance 2.0 视频生成成功！</view>

            <view class="video-player-wrapper">
              <canvas canvas-id="videoCanvas" id="video-canvas-player" style="width: 100%; height: 100%;"></canvas>
              <view class="video-controls">
                <view class="video-play-btn" @click="toggleVideoPlayback">{{ videoPlayBtnText }}</view>
                <view class="video-progress">
                  <view class="video-progress-fill" :style="{ width: videoProgress + '%' }"></view>
                </view>
                <view style="font-size: 10px;">{{ videoTimeText }}</view>
              </view>
            </view>

            <view style="display:flex; gap:10px; margin-top:15px;">
              <button class="btn" style="flex:1;" @click="downloadVideoV2">📥 下载视频 (MP4)</button>
              <button class="btn btn-secondary" style="flex:1;" @click="resetTravelPhoto">🔄 重新拍摄</button>
            </view>
          </view>

          <button class="btn" style="width:100%; margin-top:10px;" v-show="!showVideoResult" @click="downloadPhotoImage">📥 保存本地查看</button>
        </view>
      </view>
    </view>

    <!-- 视频生成进度条 Modal -->
    <view class="modal" v-show="showVideoProgressModal" style="display:flex;">
      <view class="modal-content" style="text-align:center;">
        <view style="font-size: 20px; font-weight: bold;">AI 视频生成中</view>
        <view style="font-size: 12px; color: #aaa; margin-top: 5px;">基于 Seedance 2.0 大模型</view>
        <view class="progress-bar-container" style="margin-top:20px;">
          <view class="progress-bar-fill" :style="{ width: videoProgressValue + '%' }"></view>
        </view>
        <view style="margin-top:10px;">{{ videoStatusText }}</view>
      </view>
    </view>

    <!-- 文化探索任务 -->
    <view id="page-exploration" class="page" :class="{ active: currentPage === 'page-exploration' }">
      <view class="section">
        <view class="section-title">文化探索任务</view>
        <view class="card">
          <view style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <view>当前积分：<text style="color:var(--palace-red); font-weight:bold;">{{ points }}</text></view>
            <view style="font-size:12px; color:#666;">排名：156</view>
          </view>
          <view class="task-item">
            <view class="task-icon">📍</view>
            <view class="task-info">
              <view class="task-name">实地打卡</view>
              <view class="task-reward">+50 积分 (需传照)</view>
            </view>
            <button class="btn task-btn" style="padding:5px 15px; font-size:12px;" :class="{ 'btn-secondary': tasks.daka.completed }" :disabled="tasks.daka.completed" @click="handleTaskUpload('daka')">
              {{ tasks.daka.completed ? '已完成' : '上传打卡照' }}
            </button>
          </view>
          <view class="task-item">
            <view class="task-icon">🏮</view>
            <view class="task-info">
              <view class="task-name">回答文物小知识</view>
              <view class="task-reward">+30 积分 (AI 出题)</view>
            </view>
            <button class="btn task-btn" style="padding:5px 15px; font-size:12px;" @click="startQuiz">开始答题</button>
          </view>
          <view class="task-item">
            <view class="task-icon">🧧</view>
            <view class="task-info">
              <view class="task-name">文创产品集章</view>
              <view class="task-reward">+100 积分 (传照验证)</view>
            </view>
            <button class="btn task-btn" style="padding:5px 15px; font-size:12px;" :class="{ 'btn-secondary': tasks.jizhang.completed }" :disabled="tasks.jizhang.completed" @click="handleTaskUpload('jizhang')">
              {{ tasks.jizhang.completed ? '已完成' : '上传集章照' }}
            </button>
          </view>
          <view style="font-size:14px; margin-top:20px; font-weight:bold;">成就勋章</view>
          <view class="badge-grid">
            <view class="badge-item unlocked" title="初来乍到">🐣</view>
            <view class="badge-item unlocked" title="故宫达人">🏛️</view>
            <view class="badge-item" :class="{ unlocked: points >= 1400 }" title="文化使者">📜</view>
            <view class="badge-item" :class="{ unlocked: points >= 1500 }" title="收藏专家">🏺</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 个人中心页 -->
    <view id="page-profile" class="page" :class="{ active: currentPage === 'page-profile' }">
      <view class="user-header" @click="goToLogin">
        <view class="avatar">👤</view>
        <view class="user-detail">
          <view class="user-name">游客登录</view>
          <view class="user-id">ID: ********</view>
          <view class="user-signature">记录旅途灵感，收藏专属文创，把每一次出游变成可留存的记忆。</view>
        </view>
      </view>

      <view class="profile-overview">
        <view class="overview-card">
          <view class="overview-value">{{ points }}</view>
          <view class="overview-label">当前积分</view>
        </view>
        <view class="overview-card">
          <view class="overview-value">{{ gallery.length || 12 }}</view>
          <view class="overview-label">我的作品</view>
        </view>
        <view class="overview-card">
          <view class="overview-value">{{ unlockedBadges }}</view>
          <view class="overview-label">解锁勋章</view>
        </view>
      </view>

      <view class="card" style="margin-top: 0;">
        <view class="section-title" style="margin-bottom: 12px;">常用服务</view>
        <view class="service-grid">
          <view class="service-item"><view class="icon">🎫</view><view class="label">门票预约</view></view>
          <view class="service-item"><view class="icon">🛍️</view><view class="label">商城订单</view></view>
          <view class="service-item"><view class="icon">🎨</view><view class="label">AIGC 作品</view></view>
          <view class="service-item"><view class="icon">⭐</view><view class="label">我的收藏</view></view>
        </view>
      </view>
      
      <view class="section">
        <view class="section-title">我的文创画廊 (本地作品)</view>
        <view class="gallery-grid" v-if="gallery.length > 0">
          <view v-for="(item, index) in gallery" :key="index" class="gallery-item">
            <image :src="item.url" style="width: 100%; height: 100%;" mode="aspectFill"></image>
            <view v-if="item.isVideo" class="video-badge">🎬</view>
          </view>
        </view>
        <view class="empty-gallery" v-else>暂无作品，快去首页创作吧！</view>
      </view>

      <view class="list-card">
        <view class="list-item" @click="goToRealName"><view class="item-left"><view class="item-icon">🆔</view><view class="item-name">实名信息管理</view></view><view class="arrow">›</view></view>
        <view class="list-item"><view class="item-left"><view class="item-icon">📍</view><view class="item-name">收货地址管理</view></view><view class="arrow">›</view></view>
        <view class="list-item"><view class="item-left"><view class="item-icon">🎧</view><view class="item-name">在线客服咨询</view></view><view class="arrow">›</view></view>
        <view class="list-item"><view class="item-left"><view class="item-icon">🔒</view><view class="item-name">关于智游文创</view></view><view class="arrow">›</view></view>
      </view>
    </view>

    <!-- AI 管家 Modal -->
    <view class="modal" v-show="showAIModal" @click="showAIModal = false" style="display:flex;">
      <view class="modal-content" @click.stop style="height:70vh; display:flex; flex-direction:column;">
        <view style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
          <text style="font-weight:bold; color:var(--palace-red); font-size:18px;">🤖 AI 文化管家</text>
          <text class="modal-close" @click="showAIModal = false">✕</text>
        </view>
        <scroll-view scroll-y style="flex:1; margin-bottom:15px;">
          <view v-for="(msg, index) in chatMessages" :key="index" :class="['chat-msg', msg.type]" style="margin-bottom:10px; padding:8px 12px; border-radius:8px; max-width:80%;">
            <view style="font-size:12px;">{{ msg.content }}</view>
          </view>
        </scroll-view>
        <view style="display:flex; gap:10px;">
          <input type="text" v-model="chatInput" placeholder="请输入您的问题..." style="flex:1; border:1px solid #ddd; border-radius:20px; padding:8px 15px; font-size:14px;" @confirm="sendMessage" />
          <button class="btn" style="padding:8px 15px;" @click="sendMessage">发送</button>
        </view>
      </view>
    </view>

    <!-- 问答 Modal -->
    <view class="modal" v-show="showQuizModal" style="display:flex;">
      <view class="modal-content" style="text-align:center;">
        <view style="font-size:18px; font-weight:bold; margin-bottom:15px; color:var(--palace-red);">知识问答</view>
        <view v-if="currentQuizIndex < currentQuiz.length" style="text-align:left;">
          <view style="margin-bottom:15px; font-size:14px;">{{ currentQuiz[currentQuizIndex].q }}</view>
          <view v-for="(answer, idx) in currentQuiz[currentQuizIndex].a" :key="idx">
            <view class="quiz-option" :class="{ correct: selectedAnswer === idx && idx === currentQuiz[currentQuizIndex].correct, wrong: selectedAnswer === idx && idx !== currentQuiz[currentQuizIndex].correct }" @click="checkAnswer(idx)">{{ answer }}</view>
          </view>
        </view>
        <view v-else style="text-align:center;">
          <view style="font-size:16px; margin-bottom:10px;">答题结束！</view>
          <view style="font-size:14px; color:#666;">您答对了 {{ correctCount }} 道题</view>
          <button class="btn" style="margin-top:15px;" @click="showQuizModal = false">关闭</button>
        </view>
      </view>
    </view>

    <!-- 底部导航 -->
    <view class="bottom-nav">
      <view class="nav-item" :class="{ active: currentPage === 'page-home' }" @click="showPage('page-home')"><text class="icon">🏠</text><text class="label">首页</text></view>
      <view class="nav-item" :class="{ active: currentPage === 'page-map' }" @click="showPage('page-map')"><text class="icon">🗺️</text><text class="label">导览</text></view>
      <view class="nav-item" :class="{ active: currentPage === 'page-mall' }" @click="showPage('page-mall')"><text class="icon">🛍️</text><text class="label">商城</text></view>
      <view class="nav-item" :class="{ active: currentPage === 'page-profile' }" @click="showPage('page-profile')"><text class="icon">👤</text><text class="label">我的</text></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 'page-home',
      currentScenic: 'gugong',
      mapImage: '/static/images/gugong-quanjingtu.jpg',
      currentMarkers: [],
      showDetailPanel: false,
      selectedMarker: { name: '', desc: '' },
      aigcUploadedImg: null,
      aigcPrompt: '',
      currentPattern: '无',
      currentAIGCType: '明信片',
      currentAIGCStyle: '国潮水墨',
      currentAIGCColors: ['#f3e5f5', '#e1f5fe'],
      showAIGCResult: false,
      uploadedImg: null,
      userAudioSrc: null,
      isWatermarkOn: false,
      VIDEO_DURATION: 5000,
      showVideoResult: false,
      isVideoPlaying: false,
      videoStartTime: 0,
      videoProgress: 0,
      videoTimeText: '0:00 / 0:05',
      videoPlayBtnText: '⏸️',
      showVideoProgressModal: false,
      videoProgressValue: 0,
      videoStatusText: '正在上传图片帧...',
      points: 1280,
      tasks: {
        daka: { completed: false },
        jizhang: { completed: false }
      },
      pendingTask: '',
      showQuizModal: false,
      currentQuiz: [],
      currentQuizIndex: 0,
      correctCount: 0,
      selectedAnswer: -1,
      gallery: [],
      showAIModal: false,
      chatInput: '',
      chatMessages: [],
      scenicData: {
        gugong: {
          name: '故宫博物院',
          img: 'gugong-quanjingtu.jpg',
          markers: [
            { name: '午门', x: 50, y: 85, desc: '紫禁城的正门，也是皇帝颁布诏书的地方。' },
            { name: '太和殿', x: 50, y: 65, desc: '俗称"金銮殿"，是明清两代北京宫城内最高大的建筑。' },
            { name: '御花园', x: 50, y: 25, desc: '明清皇帝及后妃游玩、休息的地方。' }
          ]
        },
        yiheyuan: {
          name: '颐和园',
          img: 'yiheyuan-quanjingtu.jpg',
          markers: [
            { name: '佛香阁', x: 50, y: 40, desc: '全园的中心建筑，依山面水，气势恢宏。' },
            { name: '十七孔桥', x: 70, y: 70, desc: '连接昆明湖东堤与南湖岛，风景极佳。' }
          ]
        },
        tiantan: {
          name: '天坛',
          img: 'tiantan-quanjingtu.jpg',
          markers: [
            { name: '祈年殿', x: 50, y: 30, desc: '明清两代皇帝孟春祈谷之所，宏伟壮丽。' },
            { name: '回音壁', x: 50, y: 70, desc: '皇穹宇的围墙，因其特殊的弧度能传递声音。' }
          ]
        },
        ditan: {
          name: '地坛',
          img: 'youlanxianlu.jpg',
          markers: [
            { name: '方泽坛', x: 50, y: 50, desc: '明清两代皇帝祭祀地神的地方，为方形祭坛。' }
          ]
        }
      },
      quizPool: [
        { q: "故宫中最大的大殿是哪个？", a: ["太和殿", "中和殿", "保和殿", "乾清宫"], correct: 0 },
        { q: "颐和园中著名的长廊约有多少米？", a: ["500米", "728米", "1000米", "1200米"], correct: 1 },
        { q: "天坛中皇帝祭天的地方是哪里？", a: ["祈年殿", "圜丘坛", "皇穹宇", "斋宫"], correct: 1 },
        { q: "故宫始建于明朝哪个皇帝时期？", a: ["朱元璋", "朱棣", "朱见深", "朱由检"], correct: 1 },
        { q: "下列哪个建筑不属于'后三宫'？", a: ["乾清宫", "交泰殿", "坤宁宫", "太和殿"], correct: 3 },
        { q: "地坛又被称为？", a: ["祈谷坛", "方泽坛", "圜丘坛", "朝日坛"], correct: 1 },
        { q: "故宫博物院现存文物约有多少万件？", a: ["100", "150", "186", "200"], correct: 2 },
        { q: "祈年殿的屋顶是什么颜色的？", a: ["黄色", "绿色", "蓝色", "红色"], correct: 2 },
        { q: "故宫神武门是哪个方向的门？", a: ["东门", "西门", "南门", "北门"], correct: 3 },
        { q: "颐和园的主要水源来自？", a: ["昆明湖", "后海", "玉泉山", "北海"], correct: 2 },
        { q: "故宫里的'金砖'是指？", a: ["纯金做的砖", "苏州烧制的细料方砖", "涂了金漆的砖", "一种名贵的木头"], correct: 1 },
        { q: "天坛回音壁是围绕哪个建筑的？", a: ["祈年殿", "圜丘坛", "皇穹宇", "斋宫"], correct: 2 },
        { q: "地坛祭祀的是？", a: ["天神", "皇地祇", "太阳神", "月亮神"], correct: 1 },
        { q: "故宫九龙壁位于哪个区域？", a: ["外朝区", "内廷区", "宁寿宫区", "御花园区"], correct: 2 },
        { q: "颐和园佛香阁一共有几层？", a: ["三层", "四层", "八层", "九层"], correct: 2 }
      ]
    }
  },
  computed: {
    unlockedBadges() {
      let count = 2;
      if (this.points >= 1400) count++;
      if (this.points >= 1500) count++;
      return count;
    }
  },
  mounted() {
    this.switchScenic('gugong');
  },
  methods: {
    showPage(pageId) {
      this.currentPage = pageId;
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
    },
    switchScenic(id) {
      this.currentScenic = id;
      const data = this.scenicData[id];
      this.mapImage = `/static/images/${data.img}`;
      this.currentMarkers = data.markers;
    },
    showDetail(marker) {
      this.selectedMarker = marker;
      this.showDetailPanel = true;
    },
    closeDetail() {
      this.showDetailPanel = false;
    },
    sendMessage() {
      const text = this.chatInput.trim();
      if (!text) return;
      this.chatMessages.push({ type: 'user', content: text });
      this.chatInput = '';
      setTimeout(() => {
        this.chatMessages.push({ type: 'ai', content: '正在为您处理，请稍候...' });
      }, 800);
    },
    chooseAIGCImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.aigcUploadedImg = res.tempFilePaths[0];
        }
      });
    },
    selectPattern(pattern) {
      this.currentPattern = pattern;
    },
    setAIGCType(type) {
      this.currentAIGCType = type;
    },
    selectTemplate(style, colors) {
      this.currentAIGCStyle = style;
      this.currentAIGCColors = colors;
    },
    generateAIGC() {
      this.showAIGCResult = true;
      const ctx = uni.createCanvasContext('aigcCanvas', this);
      const gradient = ctx.createLinearGradient(0, 0, 300, 400);
      gradient.addColorStop(0, this.currentAIGCColors[0]);
      gradient.addColorStop(1, this.currentAIGCColors[1]);
      ctx.setFillStyle(gradient);
      ctx.fillRect(0, 0, 300, 400);
      ctx.setFillStyle('#333');
      ctx.setFontSize(24);
      ctx.setTextAlign('center');
      ctx.fillText(this.currentAIGCStyle, 150, 180);
      ctx.setFontSize(16);
      ctx.fillText(this.currentAIGCType, 150, 220);
      if (this.currentPattern !== '无') {
        ctx.setFontSize(14);
        ctx.fillText('纹样: ' + this.currentPattern, 150, 260);
      }
      ctx.draw();
    },
    downloadAIGCImage() {
      uni.canvasToTempFilePath({
        canvasId: 'aigcCanvas',
        success: (res) => {
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              uni.showToast({ title: '已保存到相册', icon: 'success' });
            },
            fail: () => {
              uni.showToast({ title: '保存失败，请检查权限', icon: 'none' });
            }
          });
        }
      }, this);
    },
    shareImage() {
      uni.showToast({ title: '分享功能暂未实现', icon: 'none' });
    },
    choosePhotoImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.uploadedImg = res.tempFilePaths[0];
          const ctx = uni.createCanvasContext('photoCanvas', this);
          uni.getImageInfo({
            src: this.uploadedImg,
            success: (info) => {
              ctx.drawImage(this.uploadedImg, 0, 0, info.width, info.height);
              ctx.draw();
            }
          });
        }
      });
    },
    optimizePhoto() {
      if (!this.uploadedImg) {
        uni.showToast({ title: '请先上传照片', icon: 'none' });
        return;
      }
      uni.showToast({ title: '已优化', icon: 'none' });
    },
    toggleWatermark() {
      this.isWatermarkOn = !this.isWatermarkOn;
      uni.showToast({ title: this.isWatermarkOn ? '水印已开启' : '水印已关闭', icon: 'none' });
    },
    chooseAudioFile() {
      uni.chooseFile({
        count: 1,
        extension: ['.mp3', '.wav', '.aac'],
        success: (res) => {
          this.userAudioSrc = res.tempFilePaths[0];
          uni.showToast({ title: '音频已加载', icon: 'none' });
        },
        fail: () => {
          uni.chooseMessageFile({
            count: 1,
            type: 'file',
            extension: ['mp3', 'wav', 'aac'],
            success: (res) => {
              this.userAudioSrc = res.tempFiles[0].path;
              uni.showToast({ title: '音频已加载', icon: 'none' });
            },
            fail: () => {
              uni.showToast({ title: '请选择音频文件', icon: 'none' });
            }
          });
        }
      });
    },
    setVideoDuration(duration) {
      this.VIDEO_DURATION = duration;
      this.videoTimeText = `0:00 / 0:${duration === 5000 ? '05' : '10'}`;
    },
    oneClickMovie() {
      if (!this.uploadedImg) {
        uni.showToast({ title: '请先上传照片', icon: 'none' });
        return;
      }
      this.showVideoProgressModal = true;
      this.videoProgressValue = 0;
      this.videoStatusText = '正在上传图片帧...';
      const interval = setInterval(() => {
        this.videoProgressValue += 10;
        if (this.videoProgressValue === 30) {
          this.videoStatusText = 'AI 正在分析画面风格...';
        } else if (this.videoProgressValue === 60) {
          this.videoStatusText = '正在生成视频帧...';
        } else if (this.videoProgressValue === 90) {
          this.videoStatusText = '正在合成音频...';
        }
        if (this.videoProgressValue >= 100) {
          clearInterval(interval);
          this.showVideoProgressModal = false;
          this.showVideoResult = true;
          uni.showToast({ title: '视频生成成功！', icon: 'none' });
        }
      }, 500);
    },
    toggleVideoPlayback() {
      this.isVideoPlaying = !this.isVideoPlaying;
      this.videoPlayBtnText = this.isVideoPlaying ? '⏸️' : '▶️';
    },
    downloadVideoV2() {
      uni.showToast({ title: '视频下载功能暂未实现', icon: 'none' });
    },
    downloadPhotoImage() {
      if (!this.uploadedImg) {
        uni.showToast({ title: '请先上传照片', icon: 'none' });
        return;
      }
      uni.saveImageToPhotosAlbum({
        filePath: this.uploadedImg,
        success: () => {
          uni.showToast({ title: '已保存到相册', icon: 'success' });
        },
        fail: () => {
          uni.showToast({ title: '保存失败，请检查权限', icon: 'none' });
        }
      });
    },
    resetTravelPhoto() {
      this.showVideoResult = false;
      this.uploadedImg = null;
      this.isVideoPlaying = false;
      this.videoProgress = 0;
    },
    handleTaskUpload(type) {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: () => {
          if (!this.tasks[type].completed) {
            this.doTask(type, type === 'daka' ? 50 : 100, type === 'daka' ? '打卡成功' : '集章成功');
          }
        }
      });
    },
    doTask(type, reward, msg) {
      this.tasks[type].completed = true;
      this.points += reward;
      uni.showToast({ title: '🏆 ' + msg, icon: 'none' });
    },
    startQuiz() {
      this.currentQuiz = [...this.quizPool].sort(() => 0.5 - Math.random()).slice(0, 10);
      this.currentQuizIndex = 0;
      this.correctCount = 0;
      this.selectedAnswer = -1;
      this.showQuizModal = true;
    },
    checkAnswer(index) {
      this.selectedAnswer = index;
      const q = this.currentQuiz[this.currentQuizIndex];
      if (index === q.correct) {
        this.correctCount++;
      }
      setTimeout(() => {
        this.currentQuizIndex++;
        this.selectedAnswer = -1;
        if (this.currentQuizIndex >= 10) {
          this.showQuizModal = false;
          const score = this.correctCount * 10;
          this.points += score;
          uni.showToast({ title: `答题结束！您答对了 ${this.correctCount} 道题，获得 ${score} 积分。`, icon: 'none' });
        }
      }, 1200);
    },
    saveToGallery(url, isVideo = false) {
      this.gallery.push({ url, isVideo });
    },
    goToLogin() {
      uni.navigateTo({
        url: '/pages/module1/login'
      });
    },
    goToRealName() {
      uni.navigateTo({
        url: '/pages/module1/realName'
      });
    }
  }
}
</script>

<style>
:root {
  --palace-red: #8B0000;
  --palace-gold: #FFD700;
  --palace-bg: #f8f8f8;
  --text-dark: #333;
  --text-light: #666;
}
.container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--palace-bg);
  margin: 0 auto;
  padding-bottom: 80px;
  max-width: 480px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  position: relative;
  min-height: 100vh;
}
.page { display: none; min-height: calc(100vh - 80px); }
.page.active { display: block; }
.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0; max-width: 480px; margin: 0 auto;
  display: flex; justify-content: space-around; background-color: #fff;
  border-top: 1px solid #eee; padding: 10px 0; z-index: 1000;
}
.nav-item { display: flex; flex-direction: column; align-items: center; color: var(--text-light); cursor: pointer; }
.nav-item .icon { font-size: 24px; }
.nav-item .label { font-size: 12px; margin-top: 4px; }
.nav-item.active { color: var(--palace-red); }
.section { padding: 15px; }
.section-title { font-size: 18px; font-weight: bold; color: var(--palace-red); border-left: 4px solid var(--palace-red); padding-left: 8px; margin-bottom: 15px; }
.card { background-color: #fff; border-radius: 10px; padding: 15px; margin: 0 15px 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.btn { background: var(--palace-red); color: #fff; border: none; padding: 10px 20px; border-radius: 20px; font-size: 14px; cursor: pointer; text-align: center; }
.btn-secondary { background: #eee; color: #333; }
#page-home .banner { height: 180px; background-color: var(--palace-red); color: #fff; display: flex; flex-direction: column; justify-content: center; align-items: center; }
#page-home .banner .title { font-size: 26px; font-weight: bold; }
#page-home .nav-grid { display: flex; flex-wrap: wrap; padding: 15px; background: #fff; margin-top: -20px; border-radius: 20px 20px 0 0; }
.grid-item { width: 25%; text-align: center; margin-bottom: 15px; cursor: pointer; }
.grid-item .icon-box { font-size: 28px; width: 45px; height: 45px; margin: 0 auto 5px; border-radius: 50%; display: flex; justify-content: center; align-items: center; }
.grid-item .label { font-size: 11px; color: var(--text-dark); }
.red { background-color: #fff0f0; }
.gold { background-color: #fff9e6; }
.green { background-color: #e6f9f0; }
.blue { background-color: #e6f0f9; }
.purple { background-color: #f0e6ff; }
.orange { background-color: #fff2e6; }
.scenic-tabs { display: flex; background: #fff; padding: 10px; overflow-x: auto; border-bottom: 1px solid #eee; }
.scenic-tab { padding: 5px 15px; font-size: 14px; white-space: nowrap; cursor: pointer; border-radius: 15px; margin-right: 10px; }
.scenic-tab.active { background: var(--palace-red); color: #fff; }
.map-container { position: relative; width: 100%; min-height: 400px; background: #eee; }
.map-img { width: 100%; display: block; }
.marker { position: absolute; transform: translate(-50%, -50%); cursor: pointer; text-align: center; }
.marker-dot { width: 12px; height: 12px; background: var(--palace-red); border: 2px solid #fff; border-radius: 50%; }
.marker-name { font-size: 10px; background: rgba(255,255,255,0.9); padding: 2px 5px; border-radius: 4px; margin-top: 3px; }
.aigc-input-group { margin-bottom: 15px; }
.aigc-input-label { font-size: 14px; margin-bottom: 8px; display: block; font-weight: bold; color: var(--text-dark); }
.aigc-upload-box { width: 100%; height: 120px; border: 2px dashed #ccc; border-radius: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; background: #fafafa; overflow: hidden; }
.aigc-upload-box:hover { border-color: var(--palace-red); background: #fff0f0; }
.aigc-upload-preview { width: 100%; height: 100%; object-fit: cover; }
.aigc-prompt-input { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 10px; font-size: 13px; min-height: 60px; box-sizing: border-box; resize: none; margin-top: 5px; }
.pattern-grid { display: flex; gap: 10px; margin-top: 5px; }
.pattern-item { flex: 1; border: 1px solid #ddd; border-radius: 8px; padding: 8px; text-align: center; cursor: pointer; font-size: 12px; transition: all 0.2s; background: #fff; }
.pattern-item.active { border-color: var(--palace-red); background: #fff0f0; color: var(--palace-red); font-weight: bold; }
.template-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
.template-item { width: calc(50% - 5px); aspect-ratio: 3/4; background: #ddd; border-radius: 8px; position: relative; overflow: hidden; cursor: pointer; border: 2px solid transparent; }
.template-item.active { border-color: var(--palace-red); }
.template-item text { position: absolute; bottom: 5px; left: 5px; font-size: 12px; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.8); }
.photo-preview-container { width: 100%; aspect-ratio: 4/3; background: #f0f0f0; border-radius: 10px; display: flex; justify-content: center; align-items: center; position: relative; overflow: hidden; }
.photo-placeholder { font-size: 40px; color: #ccc; }
.video-player-wrapper { position: relative; width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
.video-controls { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.5); padding: 10px; display: flex; align-items: center; gap: 10px; color: #fff; }
.video-play-btn { font-size: 20px; cursor: pointer; }
.video-progress { flex: 1; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; }
.video-progress-fill { height: 100%; background: #fff; border-radius: 2px; transition: width 0.1s; }
.progress-bar-container { width: 100%; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden; margin-top: 15px; }
.progress-bar-fill { height: 100%; background: linear-gradient(90deg, var(--palace-red), var(--palace-gold)); transition: width 0.3s; }
.task-item { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f1f1; }
.task-item:last-child { border-bottom: none; }
.task-icon { font-size: 24px; margin-right: 12px; }
.task-info { flex: 1; }
.task-name { font-size: 14px; font-weight: bold; color: var(--text-dark); }
.task-reward { font-size: 12px; color: var(--text-light); margin-top: 2px; }
.task-btn { white-space: nowrap; }
.badge-grid { display: flex; gap: 15px; margin-top: 10px; }
.badge-item { width: 50px; height: 50px; background: #eee; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; opacity: 0.4; }
.badge-item.unlocked { background: linear-gradient(135deg, #FFD700, #FFA500); opacity: 1; }
.modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2000; justify-content: center; align-items: center; }
.modal-content { width: 90%; max-width: 400px; background: #fff; border-radius: 15px; padding: 20px; position: relative; }
.modal-close { position: absolute; top: 10px; right: 15px; font-size: 20px; cursor: pointer; }
.chat-msg { }
.chat-msg.user { background: #e6f2ff; margin-left: auto; }
.chat-msg.ai { background: #f0f0f0; }
.quiz-option { padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 10px; font-size: 14px; cursor: pointer; transition: all 0.2s; }
.quiz-option:hover { background: #f0f0f0; }
.quiz-option.correct { background: #e8f5e9; border-color: #4CAF50; color: #2e7d32; }
.quiz-option.wrong { background: #ffebee; border-color: #f44336; color: #c62828; }
.point-detail { position: fixed; bottom: 90px; left: 20px; right: 20px; max-width: 440px; margin: 0 auto; background: #fff; padding: 15px; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); z-index: 1100; }
.list-item { display: flex; justify-content: space-between; padding: 15px; border-bottom: 1px solid #f1f1f1; cursor: pointer; }
.list-item:last-child { border-bottom: none; }
.item-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
.item-icon { width: 34px; height: 34px; border-radius: 50%; background: #fff3f3; display: flex; align-items: center; justify-content: center; font-size: 16px; color: var(--palace-red); flex-shrink: 0; }
.item-name { font-size: 14px; color: var(--text-dark); }
.arrow { color: #bbb; font-size: 16px; }
.duration-tab { flex: 1; text-align: center; padding: 5px; font-size: 12px; border-radius: 13px; cursor: pointer; }
.duration-tab.active { background: var(--palace-red); color: #fff; }

/* --- 个人中心 --- */
#page-profile { background: #f7f7f7; padding-bottom: 20px; }
.user-header {
  background: linear-gradient(135deg, #8B0000, #b22222);
  color: #fff;
  padding: 28px 18px 42px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  flex-shrink: 0;
}
.user-detail { min-width: 0; }
.user-name { font-size: 20px; font-weight: bold; }
.user-id { font-size: 12px; opacity: 0.9; margin-top: 4px; }
.user-signature { font-size: 12px; opacity: 0.85; margin-top: 6px; line-height: 1.5; }
.profile-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: -24px 15px 15px;
  position: relative;
  z-index: 2;
}
.overview-card {
  background: #fff;
  border-radius: 12px;
  padding: 14px 10px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
.overview-value { font-size: 18px; font-weight: bold; color: var(--palace-red); }
.overview-label { font-size: 12px; color: var(--text-light); margin-top: 4px; }
.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.service-item {
  background: #fafafa;
  border-radius: 12px;
  padding: 12px 8px;
  text-align: center;
}
.service-item .icon {
  width: 40px;
  height: 40px;
  margin: 0 auto 8px;
  border-radius: 50%;
  background: #fff3f3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--palace-red);
}
.service-item .label {
  font-size: 12px;
  color: var(--text-dark);
  line-height: 1.4;
}
.gallery-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
.gallery-item { width: calc(33.33% - 7px); aspect-ratio: 1/1; background: #eee; border-radius: 5px; overflow: hidden; position: relative; }
.gallery-item image { width: 100%; height: 100%; object-fit: cover; }
.gallery-item .video-badge { position: absolute; top: 5px; right: 5px; font-size: 12px; background: rgba(0,0,0,0.6); color: #fff; padding: 2px 4px; border-radius: 3px; }
.empty-gallery {
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 12px;
  padding: 26px 12px;
  background: #fafafa;
  border-radius: 10px;
  border: 1px dashed #e2e2e2;
}
.list-card {
  background: #fff;
  border-radius: 12px;
  margin: 0 15px 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  overflow: hidden;
}
</style>
