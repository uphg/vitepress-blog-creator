<template>
  <div class="wrap">
    <div class="wrap-container">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  box-sizing: border-box;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
}

.wrap-container {
  max-width: 688px;
  margin: 0 auto;
}

@media (min-width: 960px) {
  .wrap {
    /* max-width: calc(688px + 32px * 2); */
    padding-left: 32px;
    padding-right: 32px;
  }
}

</style>