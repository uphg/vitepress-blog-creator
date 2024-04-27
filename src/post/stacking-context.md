---
title: 堆叠上下文
date: 2021-02-23T11:02:32+08:00
tags:
  - CSS
---

一图胜千言

<section class="re-part">
  <div class="stacking-context-container">
    <div class="stacking-context-block background-border">
      <div>background / border</div>
      <div class="stacking-context-block fu-z-index">
        <div>负z-index</div>
        <div class="stacking-context-block el-block">
          <div>块级元素（block）</div>
          <div class="stacking-context-block el-float">
            <div>浮动元素</div>
            <div class="stacking-context-block el-inline">
              <div>文字 / inline / inline-block</div>
              <div class="stacking-context-block re-z-index">
                <div>z-index: 0 / auto</div>
                <div class="stacking-context-block zh-z-index">正z-index</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<h2>参考文章</h2>

- [深入理解 CSS 中的层叠上下文和层叠顺序](https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)

<style scoped>
.stacking-context-container {
	 min-height: 390px;
	 min-width: 580px;
}
 .stacking-context-block {
	 box-sizing: border-box;
	 width: 200px;
	 height: 90px;
	 font-size: 14px;
	 color: #fff;
	 padding: 8px 10px;
	 border: 2px solid #fff;
	 border-radius: 2px;
}
 .stacking-context-block:not(:first-child) {
	 margin-top: 20px;
	 margin-left: 50px;
}
 .background-border {
	 background-color: #68768a;
}
 .fu-z-index {
	 background-color: #8975c1;
}
 .el-block {
	 background-color: #3182bd;
}
 .el-float {
	 background-color: #42b983;
}
 .el-inline {
	 background-color: #00bcd4;
}
 .el-inline {
	 background-color: #00bcd4;
}
 .re-z-index {
	 background-color: #d9ac4d;
}
 .zh-z-index {
	 background-color: #d13438;
}
 
</style>
