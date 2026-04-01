<template>
  <view class="page">
    <scroll-view class="chat" scroll-y :scroll-top="scrollTop">
      <view v-for="(m,i) in messages" :key="i" :class="m.role === 'user' ? 'msg user' : 'msg ai'">
        {{ m.text }}
      </view>
    </scroll-view>

    <view class="input-area">
      <input v-model="input" placeholder="问我关于景点或路线的问题" />
      <button @click="send" :disabled="loading">{{ loading ? "思考中..." : "发送" }}</button>
    </view>
  </view>
</template>

<script>
import { callAI } from "@/pages/module8/utils/ai.js";

export default {
  data() {
    return {
      input: "",
      loading: false,
      messages: [{ role: "ai", text: "你好，我是智游文旅 AI 助手，可以帮你讲解景点、规划路线。" }],
      scrollTop: 0
    };
  },
  methods: {
    async send() {
      if (!this.input.trim() || this.loading) return;
      const text = this.input.trim();
      this.messages.push({ role: "user", text });
      this.input = "";
      this.loading = true;
      try {
        const prompt = `你是文旅智能体，回答要简洁、友好并给出可操作建议。\n用户：${text}`;
        const reply = await callAI(prompt);
        this.messages.push({ role: "ai", text: reply });
      } catch (e) {
        this.messages.push({ role: "ai", text: "AI 暂时不可用，请稍后重试。" });
        console.error(e);
      } finally {
        this.loading = false;
        this.$nextTick(() => { this.scrollTop += 1000; });
      }
    }
  }
};
</script>

<style>
.page { display:flex; flex-direction:column; height:100vh; }
.chat { flex:1; padding:12px; background:#f5f5f5; }
.msg { margin:8px 0; padding:10px; border-radius:6px; max-width:80%; }
.user { align-self:flex-end; background:#d1eaff; }
.ai { align-self:flex-start; background:#ffffff; }
.input-area { display:flex; padding:8px; border-top:1px solid #eee; }
input { flex:1; padding:8px; border:1px solid #ddd; border-radius:4px; margin-right:8px; }
button { padding:8px 12px; background:#007aff; color:#fff; border-radius:4px; }
</style>
