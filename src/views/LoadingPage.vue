<!--
 * @Author: maple_jy
 * @Date: 2023-09-02 15:47:37
-->
<template>
  <div class="container">
    <div class="animate-box">
        <div class="loading" v-if="show">
          <transition>
            <div class="top" v-show="show && !videoLoad">
            <div class="rotation" v-loading="isLoading"></div>
            <p>{{ enname }}</p>
          </div>
          </transition>
          <div class="left-right" :class="{active:videoLoad}" v-show="videoLoad">
            <div class="left"></div>
            <div class="right"></div>
          </div>
        </div>
        <div class="box">
          <div class="video-box">
            <video autoplay loop muted :src="require('@/assets/bg_video.mp4')" @canplay="canplay"></video>
          </div>
          <div class="control">
            <div class="btn-box">
              <div class="logo-box"><img :src="require('@/assets/logo_withen.png')" alt="" class="auto-img"></div>
              <div class="name">{{ cnname }}</div>
              <el-button class="into-btn" type="primary" round size="large" color="#385ceb" @click="into">点击进入</el-button>
            </div>
          </div>
        </div>  
    </div>
  </div>


</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted, onBeforeMount } from "vue";
import { useCounterStore } from "../store/counter";
import { ElButton } from "element-plus";
import router from '../router/index';

export default defineComponent({
  name: "LoadingPage",

  setup() {
    let isLoading: any = ref<Boolean>(true);

    const counterStore = useCounterStore();

    let show = ref(true);
    let videoLoad = ref(false);
    let runLoad = ref(true);

    // 计算属性
    const enname = computed(() => counterStore.enname);
    const cnname = computed(() => counterStore.cnname);

    // 方法
    const into = () => {
      router.push({name:'Login'});
    }

    const canplay = () => {
      console.log('video is loading');
      
      videoLoad.value = true;
      setTimeout(()=>{
        show.value = false;
      },500)
    }
    

    // onMounted(() => {
    //   let audio = new Audio();
    //   audio.src = '../assets/bg_video.mp4';
    //   audio.onload = () => {
    //     canplay();
    //   }
    // });

    return {
      isLoading,
      enname,
      cnname,
      show,
      runLoad,
      videoLoad,
      canplay,
      into,
    };
  },
});
</script>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}


.loading {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top:0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  .top {
    .rotation {
      width: 100px;
      height: 100px;
      margin: 0 auto;
    }

    p {
      font-size: 50px;
      line-height: 100px;
      font-weight: bolder;
      color: #1897ff;
      animation: loading 2s linear infinite;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    @keyframes loading {
      0% {
        background-image: -webkit-linear-gradient(-45deg, #385ceb 10%, #1897ff);
      }
      10% {
        background-image: -webkit-linear-gradient(
          -45deg,
          #1897ff 10%,
          #385ceb 20%,
          #1897ff
        );
      }
      20% {
        background-image: -webkit-linear-gradient(
          -45deg,
          #1897ff 20%,
          #385ceb 30%,
          #1897ff
        );
      }
      30% {
        background-image: -webkit-linear-gradient(
          -45deg,
          #1897ff 30%,
          #385ceb 40%,
          #1897ff
        );
      }
      40% {
        background-image: -webkit-linear-gradient(
          -45deg,
          #1897ff 40%,
          #385ceb 50%,
          #1897ff
        );
      }
      50% {
        background-image: -webkit-linear-gradient(
          -45deg,
          #1897ff 50%,
          #385ceb 60%,
          #1897ff
        );
      }
      60% {
        background-image: -webkit-linear-gradient(
          -45deg,
          #1897ff 60%,
          #385ceb 70%,
          #1897ff
        );
      }
      70% {
        background-image: -webkit-linear-gradient(
          -45deg,
          #1897ff 70%,
          #385ceb 80%,
          #1897ff
        );
      }
      80% {
        background-image: -webkit-linear-gradient(
          -45deg,
          #1897ff 80%,
          #385ceb 90%,
          #1897ff
        );
      }
      90% {
        background-image: -webkit-linear-gradient(
          -45deg,
          #1897ff 90%,
          #385ceb 100%
        );
      }
      100% {
        background-image: -webkit-linear-gradient(-45deg, #385ceb 10%, #1897ff);
      }
    }
  }

  .left-right {
   display: flex;
   height: 100vh;
    &>div {
      width: 50%;
      height: 100%;
      transition: translateX .5s ease-in;
    }

    &.active .left {
      transform: translateX(-100%);
    }
    &.active .right {
      transform: translateX(100%);
    }
    
  }

}

.box {
  height: 100vh;
  position: relative;

  .video-box {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
    z-index: -2;

    video {
      height: 100%;
      width: 100%;
      display: block;
      object-fit: fill;
    }
  }

  .control {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba($color: #000, $alpha: .5);
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    .btn-box {

      .logo-box {
        width: 300px;
      }

      .name {
        font: 30px  bolder;
        color: #fff;
        margin: -68px auto 20px;
      }

    }

  }

}

</style>