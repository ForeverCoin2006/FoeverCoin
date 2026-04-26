<template>
  <view class="page">
    <textarea v-model="code" placeholder="粘贴代码片段" style="height:200px;"></textarea>
    <view class="buttons">
      <button @click="check">代码检查</button>
      <button @click="annotate">生成注释</button>
    </view>
    <view class="result">
      <text>{{ result }}</text>
    </view>
  </view>
</template>

<script>
import { callAI } from "@/pages/module8/utils/ai.js";

export default {
  data() { return { code: "", result: "" }; },
  methods: {
    async check() {
      if (!this.code.trim()) { uni.showToast({ title: "请粘贴代码", icon: "none" }); return; }
      const prompt = `请检查以下 JavaScript 代码是否有 bug，并给出优化建议：\n\n${this.code}`;
      this.result = "检查中...";
      try { this.result = await callAI(prompt); } catch (e) { this.result = "检查失败"; console.error(e); }
    },
    async annotate() {
      if (!this.code.trim()) { uni.showToast({ title: "请粘贴代码", icon: "none" }); return; }
      const prompt = `请为以下 JavaScript 代码补全注释，并解释每个函数的作用：\n\n${this.code}`;
      this.result = "生成注释中...";
      try { this.result = await callAI(prompt); } catch (e) { this.result = "生成失败"; console.error(e); }
    }
  }
};
</script>

<style>
textarea { width:100%; padding:8px; border:1px solid #ddd; border-radius:4px; }
.buttons { display:flex; gap:8px; margin:8px 0; }
button { padding:8px 12px; background:#007aff; color:#fff; border-radius:4px; }
.result { padding:12px; background:#fff; min-height:120px; white-space:pre-wrap; }
</style>