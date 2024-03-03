<!--
 * @Author: maple_jy
 * @Date: 2023-09-04 19:19:31
-->
<template>
  <div class="container">
    <header>
      <div class="icon-box">
        <img :src="require('@/assets/logo.png')" alt="" class="auto-img" />
      </div>
      <div class="name">{{ cnname }}</div>
      <div class="title">支付中心</div>
    </header>
    <main>
      <div class="user-box">
        <div class="user-icon">
          <img
            :src="require('@/assets/user_icon_default.png')"
            alt=""
            class="auto-img"
          />
        </div>
        <div class="user-name">xxxx</div>
      </div>
      <el-tabs
        v-model="activeName"
        class="demo-tabs"
        @tab-click="handleClick"
        type="border-card"
        stretch
      >
        <el-tab-pane lazy label="普通会员" name="first"
          >

          <p class="price">价格：<span>&yen;</span>30</p>

          <div class="code-box" v-loading="loading">
            <img
              v-if="!loading"
              :src="require('@/assets/buy_code_vip1.jpg')"
              alt=""
              class="auto-img"
            />
            <img
              v-else
              :src="require('@/assets/buy_code_vip2.jpg')"
              alt=""
              class="auto-img"
            />
          </div>

          <p>请使用 Alipay 扫码付款</p>
        </el-tab-pane>
        <el-tab-pane lazy label="至尊会员" name="second"
          >

          <p class="price">价格：<span>&yen;</span>60</p>

          <div class="code-box" v-loading="loading">
            <img
              v-if="!loading"
              :src="require('@/assets/buy_code_vip2.jpg')"
              alt=""
              class="auto-img"
            />
            <img
              v-else
              :src="require('@/assets/buy_code_vip1.jpg')"
              alt=""
              class="auto-img"
            />
          </div>

          <p>请使用 Alipay 扫码付款</p>
        </el-tab-pane>
      </el-tabs>
    </main>
    


  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import type { TabsPaneContext } from "element-plus";
import { useCounterStore } from "../store/counter";

export default defineComponent({
  name: "PaymentPage",
  setup() {
    const counterStore = useCounterStore();

    const loading = ref(false);

    let activeName = ref("first");

    const handleClick = (tab: TabsPaneContext, event: Event) => {
      console.log(tab, event);
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 1500);
    };
    const cnname = computed(() => counterStore.cnname);

    return {
      activeName,
      handleClick,
      cnname,
      loading,
    };
  },
});
</script>

<style scoped lang="scss">
.container {
  width: 46%;
  margin: 0 auto;
  cursor: default;

  // 头部
  header {
    height: 100px;
    line-height: 100px;
    text-align: left;
    display: flex;
    align-items: center;

    .icon-box {
      width: 50px;
      height: 50px;
      overflow: hidden;
      border-radius: 50%;
      margin-right: 20px;
    }

    .name {
      font-size: 26px;
      font-weight: bolder;
      line-height: 30px;
      padding-right: 10px;
      position: relative;

      &::after {
        content: "";
        width: 2px;
        height: 30px;
        position: absolute;
        right: 0;
        top: 0;
        background-color: #ddd;
      }
    }

    .title {
      font-size: 20px;
      color: #aaa;
      padding-left: 10px;
      font-weight: bold;
    }
  }

  // 主体内容
  main {
    .user-box {
      border-top-left-radius: 14px;
      border-top-right-radius: 14px;
      background-color: #000;
      display: flex;
      align-items: center;
      .user-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        padding: 10px;
      }

      .user-name {
        font-size: 20px;
        color: #fff;
        line-height: 30px;
      }
    }

    .code-box {
      width: 150px;
      height: 150px;
      margin: 20px auto;
    }

    .price {
      font-size: 30px;
      text-align: left;
      padding: 0 20px;
      color: #e4393c;

      span {
        font-size: 22px;
        display: inline-block;
        margin: 0 6px;
        font-weight: bold;
      }

    }

    .el-tabs {
      border-bottom-left-radius: 40px;
      border-bottom-right-radius: 40px;
    }
  }
}
</style>