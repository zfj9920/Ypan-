<!--
 * @Author: maple_jy
 * @Date: 2023-09-01 17:33:13
-->
<template>
  <div class="home">
    <header>
      <!-- 产品图标 -->
      <div class="logo-box">
        <div class="img-box">
          <img src="../assets/logo.png" alt="" />
        </div>
        <span>{{ cnname }}</span>
      </div>

      <!-- 上传文件按钮 -->
      <div class="upload-btn">
        <el-button
          :icon="Upload"
          class="upload"
          style="font-size: 18px"
          type="primary"
          size="small"
          @click="fileUpload"
        >
          <div class="characters">上传文件</div>
          <input id="file_btn" type="file" @change="getData($event)" />
        </el-button>

        <div class="show-upload-box" @click="isShow = !isShow">
          <el-badge :value="list.length - 1" type="primary">
            <div class="img-box">
              <img
                :src="require('@/assets/up_or_down.png')"
                alt=""
                class="auto-img"
              />
            </div>
          </el-badge>
        </div>
      </div>
      <div class="user-info-box">
        <div
          class="user-img-box"
          @mouseenter="openUserBox"
          @mouseleave="closeUserBox"
        >
          <div class="img-box">
            <img src="../assets/user-large.png" alt="" />
          </div>
        </div>
        <div
          class="user-name"
          @mouseenter="openUserBox"
          @mouseleave="closeUserBox"
        >
          <span>{{ userName }}</span>
        </div>
        <div class="vip-img-box" v-if="isVIP">
          <img src="../assets/vip1.png" alt="" />
        </div>
        <div class="btn-box">
          <div class="msg">
            <img src="../assets/bell.png" alt="" />
          </div>
          <div class="theme">
            <img src="../assets/shirt.png" alt="" />
          </div>
        </div>
      </div>
    </header>
    <div class="main">
      <div class="nav-l">
        <el-menu
          :router="true"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :default-active="active"
        >
          <el-menu-item
            :index="item.path"
            v-for="(item, index) in navList"
            :key="index"
            @click="checkNav(item.path)"
          >
            <div class="img-box" ref="navItem">
              <img :src="item.img" alt="" />
            </div>
            <span>{{ item.text }}</span>
          </el-menu-item>
        </el-menu>

        <div class="capacity">
          <div class="line-box">
            <div
              class="line"
              ref="line"
              :style="{ width: line_w + 'px', backgroundColor: usedSpace >= totalSpace ? 'red' : 'rgb(42, 125, 220)' }"
            ></div>
          </div>
          <div class="info-box">
            <span
              >{{ usedSpace }}{{ usedUnit }} / {{ totalSpace }}{{ totalUnit }}
            </span>
            <span>扩容</span>
          </div>
        </div>
      </div>
      <div class="content">
        <RouterView></RouterView>
      </div>
    </div>
    <div
      :class="showUserBox ? 'userBox-open' : 'userBox'"
      @mouseenter="openUserBox"
      @mouseleave="closeUserBox"
    >
      <div class="user-info-box">
        <div class="user-img">
          <img src="../assets/user-large.png" alt="" />
        </div>
        <div class="user-info">
          <div class="user-name-box">
            <span>{{ userName }}</span>
            <div class="img-box" v-if="isVIP">
              <img src="../assets/vip1.png" alt="" />
            </div>
          </div>
          <div class="user-vip-date" v-if="isVIP">{{ vipDate }} 到期</div>
          <div class="user-vip-date" v-else>普通会员</div>
        </div>
      </div>
      <div class="btn-box">
        <div class="img-box" v-for="(item, index) in ImgList" :key="index">
          <img :src="item" alt="" />
        </div>
      </div>
      <div class="fn-list">
        <div v-for="(item, index) in fnList" :key="index" @click="logout">
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>

    <!-- 传输列表 -->
    <div class="upload-box" v-show="isShow">
      <!-- 顶部控件 -->
      <div class="text-box">
        <p>传输列表</p>

        <div class="close-btn" @click="isShow = false">&times;</div>
      </div>

      <!-- 文件传输历史列表 -->
      <div class="uploadList" v-if="list.length > 1">
        <div class="box">
          <template v-for="(item, index) in list">
            <div class="item" v-if="index != 0" :key="item.name">
              <div class="itemLeft">
                <div class="img-box">
                  <img
                    class="auto-img"
                    :src="require(`@/assets/${item.img}.png`)"
                  />
                </div>
                <div class="txt">
                  <h3>{{ item.name }}</h3>
                  <p>{{ item.size }}</p>
                </div>
              </div>
              <div class="itemRight">
                <div class="item-progress">
                  <el-progress
                    :percentage="percentage[index]"
                    :duration="10"
                    :show-text="false"
                  />
                </div>
                <div class="item-btns">
                  <el-icon size="1.5rem" @click="onClick(index)">
                    <VideoPause v-if="isBtn[index]" />
                    <VideoPlay v-else />
                  </el-icon>
                  <el-icon size="1.5rem" @click="remove(index)">
                    <CloseBold />
                  </el-icon>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div v-else class="empty">
        <el-empty
          :image="require('../assets/uploadEmpty.png')"
          description="当前没有上传任务喔~"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, h } from "vue";
import { useCounterStore } from "../store/counter";
import { ElMessage, ElNotification } from "element-plus";
import { Upload } from "@element-plus/icons-vue";
import { upLoadCount } from "../mixins/upLoadCount";
import { getUsedSpace } from "../api/api";
import axios from "axios";
import md5 from "js-md5";
import router from "@/router";
import LoginVue from "./Login.vue";

// 切片大小为2M
const chunksize = 2 * 1024 * 1024;
// 当前上传的文件数量
let isUpLoadCount = ref(0);
let token = localStorage.getItem("token") || sessionStorage.getItem("token");
// 是否显示传输框
let isShow = ref(false);

// 是否停止上传
// @ts-ignore
const stop = ref([false]);
let fileObj: Event;

// 进度
// @ts-ignore
let percentage = ref([0]);

// @ts-ignore
const list = ref([{ name: "", img: "", size: "" }]);

// 控件数据
// @ts-ignore
const isBtn = ref([true]);

// 点击暂停
const onClick = (index: number) => {
  if (percentage.value[index] == 100) return;

  isBtn.value[index] = !isBtn.value[index];
  stop.value[index] = !stop.value[index];

  console.log("stop ==> ", stop.value[index]);

  if (!stop.value[index]) {
    const storedPath = localStorage.getItem("storagepath") || ".";
    uploadFile(fileObj, `${storedPath}`);
    // uploadFile(fileObj, "e");
  } else {
    console.log("上传暂停");
  }
};

// 删除功能
const remove: (index: number) => void = (index) => {
  // console.log("index ==> ", index);
  if (percentage.value[index] < 100) {
    onClick(index);

    setTimeout(() => {
      axios
        .post(
          "http://192.168.37.77:8520/cancel_upload",
          {
            path: `${localStorage.getItem("storagepath")}/${
              list.value[index].name
            }`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("delete => ", res);

          counterStore.upLoad_value();

          list.value.splice(index, 1);
          percentage.value.splice(index, 1);
          stop.value.splice(index, 1);
          isBtn.value.splice(index, 1);
          isUpLoadCount.value = upLoadCount(percentage.value) - 1;
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1000);
  } else {
    list.value.splice(index, 1);
    percentage.value.splice(index, 1);
    stop.value.splice(index, 1);
    isBtn.value.splice(index, 1);
  }

  isUpLoadCount.value = upLoadCount(percentage.value) - 1;
};

// 点击函数
const fileUpload = () => {
  // @ts-ignore
  document.querySelector("#file_btn").click();
  // console.log(444);
};

// 获取文件信息
const getData = async (e: Event) => {
  fileObj = e;

  isShow.value = true;

  if (
    percentage.value[percentage.value.length - 1] < 100 &&
    percentage.value.length > 1
  ) {
    ElNotification({
      title: "提示",
      message: h(
        "i",
        { style: "color: teal" },
        "前一个任务还未上传成功，请等待上传成功后再上传"
      ),
    });
  } else {
    const storedPath = localStorage.getItem("storagepath") || ".";

    uploadFile(e, `${storedPath}`);
  }

  // uploadFile(e, "e");
};

// 上传函数
const uploadFile = async (e: Event, path: any) => {
  let isUP = true;
  let isSameName = false;

  const target = e.target as HTMLInputElement;
  console.log("target ==> ", target.files);

  if (target.files!.length) {
    console.log(111);

    let start = 0;
    let index = 0;
    let formData = new FormData();
    // @ts-ignore
    const file = target.files[0];

    let { name, size, type } = file;

    // 查看file文件信息
    console.log("file message ==> ", file);

    // 修改文件消息
    let iconName = file.name.split(".");
    let obj = { name: "", size: "", img: "" };
    obj.name = file.name;
    obj.size = formatSize(file.size);
    // @ts-ignore
    obj.img = formatIcon(iconName[iconName.length - 1]);

    for (let i = 0; i < list.value.length; i++) {
      if (list.value[i].name == obj.name && percentage.value[i] < 100) {
        isUP = false;
        break;
      } else if (list.value[i].name == obj.name) {
        isSameName = true;
      }
    }

    if (isSameName) {
      let newName = name.split(".")[0] + "-" + new Date().getTime();
      name = `${newName}.${name.split(".")[1]}`;
    }

    // 如果上传未完成则使用原有的数据,已完成则添加新数据
    if (isUP) {
      list.value.push(obj);
      percentage.value.push(0);
      isBtn.value.push(true);
      stop.value.push(false);
    }

    // isUpLoadCount.value = upLoadCount(percentage.value) - 1;

    while (start < size) {
      let blob = null;

      if (
        stop.value[list.value.length - 1] ||
        stop.value.length < list.value.length
      )
        return;

      // 文件切片
      if (start + chunksize > size) {
        // 最后一片不够分片大小
        blob = file.slice(start, size);
      } else {
        blob = file.slice(start, start + chunksize);
      }

      start += chunksize;
      let blobFile = new File([blob], name);

      formData.append("files", blobFile);
      formData.append("index", index + "");
      formData.append("path", path);
      console.log(`formData ${index} ==> `, formData.get("path"));

      index++;

      // 原有 http://192.168.37.77:8520
      await axios
        .post("http://192.168.37.77:8520/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((err) => {
          console.log(err);
          ElNotification({
            title: "提示",
            message: h("i", { style: "color: red" }, "云盘存储空间不足"),
          });
          onClick(index);

          list.value.splice(index, 1);
          percentage.value.splice(index, 1);
          stop.value.splice(index, 1);
          isBtn.value.splice(index, 1);
        });

      // 测试 http://192.168.37.26:8520
      // await axios.post("http://192.168.37.77:8520/mul_upload", formData);

      percentage.value[list.value.length - 1] =
        percentage.value[list.value.length - 1] <
        Math.floor((start / size) * 100)
          ? Math.floor((start / size) * 100)
          : percentage.value[list.value.length - 1];
    }
    // 异步等待文件分片上传
    // axios.post(""+md5(name)).then(res => {
    //     // 完成分片上传后的代码
    // })
    console.log("md5(name) ==> ", md5(name));
    percentage.value[list.value.length - 1] = 100;
    isBtn.value[list.value.length - 1] = false;

    counterStore.upLoad_value();
    target.value = "";
    isUpLoadCount.value = upLoadCount(percentage.value) - 1;
  }
};

// 文件大小格式化
const formatSize = (size: number) => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  const base = 1024;

  if (size === 0) {
    return "0B";
  }

  let unitIndex = 0;
  while (size >= base && unitIndex < units.length - 1) {
    size /= base;
    unitIndex++;
  }

  const fileSizeStr = size.toFixed(2);
  return `${fileSizeStr} ${units[unitIndex]}`;
};

// 图片Icon格式化
const formatIcon = (iconName: string) => {
  for (let key in iconType.value) {
    if (iconType.value[key].lastIndexOf(iconName) >= 0) {
      return key;
    }
  }

  return "file";
};

// 选项列表
const navList = [
  {
    text: "全部文件",
    img: require("../assets/folder-open.png"),
    path: "/allFolderView",
  },
  {
    text: "图片",
    img: require("../assets/images.png"),
    path: "/imgView",
  },
  {
    text: "文档",
    img: require("../assets/file-lines.png"),
    path: "/fileView",
  },
  {
    text: "其他",
    img: require("../assets/file.png"),
    path: "/otherView",
  },
  {
    text: "回收站",
    img: require("../assets/trash.png"),
    path: "/recycleView",
  },
];

// 图片
const ImgList = [
  require("../assets/disease.png"),
  require("../assets/download.png"),
  require("../assets/eye-slash.png"),
];

// 用户小单
const fnList = [
  {
    text: "退出登录",
    name: "logout",
  },
];

// 退出登录
const logout = () => {
  for (let i = 0; i < stop.value.length; i++) {
    if (!stop.value[i] && percentage.value[i] < 100) {
      remove(i);
    }
  }

  setTimeout(() => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    router.push({ name: "Login" });
  }, 1000);
};

// 未来用数据代替
let userName = ref("");
let vipDate = "1999-12-02";
let usedUnit = "";
let totalUnit = "";
let usedSpace = 0;
let totalSpace = 1;
let line_w = ref(0);
let nav_i = ref(0);
let line = ref();
let active = ref(
  localStorage.getItem("nav_i")
    ? localStorage.getItem("nav_i")
    : "/allFolderView"
);
const counterStore = useCounterStore();
const navItem = ref<any>([]);

// 计算属性
let cnname = computed(() => counterStore.cnname);
const iconType = computed(() => counterStore.iconType);

// 是否为会员
// let isVIP = ref(JSON.parse(localStorage.getItem("G_USER") as string).isVIP);
let isVIP = ref(true);

// 方法
let showUserBox = ref(false);
function openUserBox() {
  showUserBox.value = true;
}
function closeUserBox() {
  showUserBox.value = false;
}
function checkNav(s: any) {
  localStorage.setItem("nav_i", s);
}

onMounted(() => {
  if (localStorage.getItem("token")) {
    userName.value = "已登录";
  }
  let lineBox = line.value.parentElement;

  let lineBox_w = lineBox.getBoundingClientRect().width;

  getUsedSpace(localStorage.getItem("token") || sessionStorage.getItem("token"))
    .then((res) => {
      // console.log(res);

      usedUnit = res.data.folder_size.split(" ")[1];
      usedSpace = res.data.folder_size.split(" ")[0];
      totalUnit = res.data.storage_size.split(" ")[1];
      totalSpace = res.data.storage_size.split(" ")[0];

      // 查看返回数据u
      // console.log("res.data==>", res.data);

      let num = usedSpace;

      switch (usedUnit) {
        case "GB":
          num = (num / 1024) * 1024;
          break;
        case "MB":
          num = num / 1024;
          break;
        default:
          break;
      }

      line_w.value = (num / totalSpace) * lineBox_w;
    })
    .catch((err) => {
      console.log(err);
    });

  // 获取用户名称
  let user = JSON.parse(localStorage.getItem("G_USER") as string);
  // userName.value = user.user;
  userName.value = "user.user";
});
</script>

<style lang="scss">
.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  header {
    width: 100%;
    height: 60px;
    box-shadow: 0px 0px 5px #a7a7a7;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo-box {
      margin: 0 10px;
      height: 100%;
      width: 300px;
      // background-color: red;
      display: flex;
      align-items: center;

      .img-box {
        width: 40px;
        display: flex;
        align-items: center;

        img {
          width: 100%;
        }
      }

      span {
        display: block;
        margin-left: 10px;
        font-size: 16px;
        font-weight: bolder;
      }
    }

    .user-info-box {
      display: flex;
      height: 100%;
      align-items: center;
      font-size: 14px;

      > div {
        padding: 0 5px;
      }

      .user-img-box {
        width: 26px;
        height: 100%;
        cursor: pointer;
        display: flex;
        align-items: center;

        .img-box {
          width: 26px;
          height: 26px;
          background-color: #c4cbd5;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
          }
        }
      }

      .user-name {
        cursor: pointer;
        height: 100%;
        line-height: 60px;
      }

      .vip-img-box {
        width: 20px;
        height: 20px;
        // background-color: #666;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        cursor: pointer;

        img {
          width: 100%;
        }
      }

      .arrow-img-box {
        width: 10px;
        height: 10px;
        overflow: hidden;
        display: flex;
        align-items: center;
        cursor: pointer;

        img {
          width: 100%;
        }
      }

      .btn-box {
        display: flex;
        // justify-content: center;
        align-items: center;
        margin: 20px;

        > div {
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          margin: 10px;
          cursor: pointer;

          img {
            width: 100%;
          }
        }
      }

      .vip-center {
        font-size: 12px;
        color: #fff;
        background-color: rgb(79, 79, 234);
        padding: 4px 12px;
        margin-right: 10px;
        border-radius: 34px;
        cursor: pointer;
      }
    }
  }

  .main {
    height: calc(100% - 42px);
    width: 100%;
    // background-color: #9ba8bb;
    display: flex;

    .nav-l {
      height: 100%;
      width: 220px;
      background-color: #f3f3f3;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .el-menu-vertical-demo {
        height: 500px;
        background-color: transparent;
        border: none;

        > div {
          width: 100%;
        }

        .el-menu-item {
          padding: 10px 0px !important;
          height: 60px;
          width: 100%;
          display: flex;

          .img-box {
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            margin-right: 10px;

            img {
              width: 100%;
            }

            margin-left: 60px;
          }

          span {
            color: #505050;
            font-weight: bold;
            font-size: 14px;
          }
        }

        .is-active {
          background-color: rgb(67, 74, 80);

          span {
            color: #eaeaea !important;
          }
        }

        .el-menu-item:hover span {
          color: #eaeaea !important;
        }
      }

      .capacity {
        width: 100%;
        height: 80px;

        // background-color: #333;
        .line-box {
          width: 90%;
          height: 5px;
          border-radius: 12px;
          margin: 20px auto;
          background-color: #d4d4d4;

          .line {
            height: 100%;
            max-width: 100px;
            background-color: rgb(42, 125, 220);
            border-radius: 12px;
          }
        }

        .info-box {
          width: 90%;
          display: flex;
          margin: 20px auto;
          justify-content: space-between;
          font-size: 13px;

          span:last-child {
            color: rgb(42, 125, 220);
            cursor: pointer;
          }
        }
      }
    }

    .content {
      height: 100%;
      width: calc(100% - 220px);
      color: #333;
    }
  }

  .userBox {
    position: absolute;
    display: block;
    top: -320px;
    right: 100px;
    width: 200px;
    box-shadow: 5px 5px 5px #fff;
    opacity: 0;
    transition: opacity 1s, box-shadow 1s, opacity 1s;
  }

  .userBox-open {
    position: absolute;
    display: block;
    top: 60px;
    right: 100px;
    width: 200px;
    z-index: 999;
    background-color: #fff;
    box-shadow: 5px 5px 5px #e8e8e8;
    opacity: 1;
    transition: opacity 1s, box-shadow 1s, opacity 1s;
  }

  [class*="userBox"] {
    border-radius: 10px;
    overflow: hidden;
    height: max-content;

    .user-info-box {
      width: calc(100% - 20px);
      padding: 10px;
      height: 40px;
      background-color: rgb(111, 111, 237);
      display: flex;
      align-items: center;

      .user-img {
        width: 35px;
        height: 35px;
        border-radius: 20px;
        background-color: #c4cbd5;
        margin-right: 5px;
        overflow: hidden;

        img {
          width: 100%;
        }
      }

      .user-info {
        width: calc(100% - 32px);
        height: 100%;

        .user-name-box {
          height: max-content;
          width: 100%;
          display: flex;
          align-items: center;

          .img-box {
            width: 14px;
            height: 14px;
            display: flex;
            align-items: center;
            margin-left: 5px;

            img {
              width: 100%;
            }
          }

          span {
            font-size: 14px;
            font-weight: bolder;
          }
        }

        .user-vip-date {
          width: 100%;
          height: max-content;
          font-size: 10px;
          text-align: left;
        }
      }
    }

    .btn-box {
      width: calc(100% - 20px);
      margin: 10px auto;
      height: 30px;
      display: flex;

      .img-box {
        width: 20px;
        margin-right: 20px;
        display: flex;
        align-items: center;
        cursor: pointer;

        img {
          width: 100%;
        }
      }
    }
  }

  .fn-list {
    > div {
      width: calc(100% - 20px);
      text-align: left;
      font-size: 12px;
      padding: 15px 10px;
      font-weight: bolder;
      color: #666666d3;
      cursor: pointer;
      justify-content: space-between;
      align-items: center;
      background-color: #f8f8f8;
      transition: background-color 1s;
      text-align: center;

      .img-box {
        width: 10px;

        img {
          width: 100%;
        }
      }
    }

    > div:hover {
      background-color: #eceef1 !important;
      transition: background-color 0.5s;
    }
  }
}

// 上传文件按钮
.upload-btn {
  display: flex;
  align-items: center;

  .upload {
    width: 120px;
    height: 30px;
    background-color: #447be4;
    text-align: center;
    line-height: 30px;
    border-radius: 10px;
    color: white;
    margin-left: 50px;

    .characters {
      font-size: 16px;
      font-weight: bold;
    }

    input {
      display: none;
    }
  }

  .show-upload-box {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #ddd;
    padding: 4px;
    margin-left: 20px;
    cursor: pointer;
  }
}

// 传输文件盒子
.upload-box {
  width: 650px;
  height: 356px;
  position: absolute;
  top: 70px;
  right: 30px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0px 0px 2px 2px #ddd;
  padding: 0 20px 20px;

  .text-box {
    height: 40px;
    padding: 4px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    padding: 8px 0px 4px;
    border-bottom: 2px solid #ddd;
    margin-bottom: 10px;

    .close-btn {
      font-size: 26px;
      font-weight: bold;
      cursor: pointer;
    }
  }

  .uploadList {
    width: 98%;
    height: calc(376px - 60px);
    overflow-y: scroll;

    .item {
      width: 100%;
      display: flex;
      background-color: #fafafa;
      padding: 6px;
      margin-bottom: 8px;
      justify-content: space-between;
      box-sizing: border-box;

      &:hover {
        background-color: #ddd;
      }

      // 文件图片和信息
      .itemLeft {
        display: flex;
        align-items: center;

        .img-box {
          width: 32px;
          height: 40px;
          margin-right: 10px;
        }

        .txt {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 14px;

          > h3,
          > p {
            margin: 0;
          }

          > p {
            display: block;
            text-align: left;
            color: gray;
          }

          > h3 {
            overflow: auto;
            white-space: nowrap;
            height: 24px;
            max-width: 240px;
            scrollbar-width: none;
            -ms-overflow-style: none;
            text-overflow: ellipsis;
          }

          > h3::-webkit-scrollbar {
            display: none;
          }
        }
      }

      // 传输控制组件
      .itemRight {
        display: flex;
        align-items: center;

        .item-progress {
          margin: 0 6px;
          width: 15rem;
        }

        .item-btns {
          margin-left: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;

          > i {
            margin: 0 4px;
          }
        }
      }
    }
  }
}
</style>

