<template>
  <div v-if="list" class="main">
    <div class="progress">
      <el-button
        :icon="Upload"
        class="upload"
        style="font-size: 18px"
        type="primary"
        size="small"
        @click="fileUpload"
      >
        <div class="characters">上传</div>
        <input class="file_btn" type="file" @change="getData($event)" />
      </el-button>
    </div>
    <div class="uploadList" v-if="list.length > 1">
      <template v-for="(item, index) in list">
        <div class="item" v-if="index != 0" :key="item.name">
          <div class="itemLeft">
            <img :src="require(`@/assets/${item.img}.png`)" />
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
                :stroke-width="15"
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
    <div v-else class="empty">
      <el-empty
        :image="require('../assets/uploadEmpty.png')"
        description="当前没有上传任务喔~"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import md5 from "js-md5";
import { Upload } from "@element-plus/icons-vue";
import { useCounterStore } from "../store/counter";

// 获取pinia的数据——iconType
const counterStore = useCounterStore();
const iconType = computed(() => counterStore.iconType);

let file = ref(null);

// md5 加密文件切片哈希值
const md5Hash = localStorage.getItem("md5Hash")
  ? ref(JSON.parse(localStorage.getItem("md5Hash") as string))
  : ref([""]);

// 切片大小为2M
const chunksize = 2 * 1024 * 1024;

// 是否停止上传
// @ts-ignore
const stop = sessionStorage.getItem("stop")
  ? ref(JSON.parse(sessionStorage.getItem("stop") as string))
  : ref([false]);
let fileObj = sessionStorage.getItem("fileObj")
  ? JSON.parse(sessionStorage.getItem("fileObj") as string)
  : Event;

// 进度
// @ts-ignore
let percentage = sessionStorage.getItem("percentage")
  ? ref(JSON.parse(sessionStorage.getItem("percentage") as string))
  : ref([0]);

// @ts-ignore
const list = sessionStorage.getItem("list")
  ? ref(JSON.parse(sessionStorage.getItem("list") as string))
  : ref([{ name: "", img: "", size: "" }]);

// 点击函数
const fileUpload = () => {
  // @ts-ignore
  document.querySelector(".file_btn").click();
};

// 获取文件信息
const getData = async (e: Event) => {
  fileObj = e;

  // 测试 md5 加密解密的实现
  try {
    // md5 加密
    const md5Array = await sliceAndComputeMD5(fileObj.target.files[0]);
    // console.log("md5Array ==> ", md5Array);
    md5Hash.value.push(md5Array);
    localStorage.setItem("md5Hash", JSON.stringify(md5Hash));
  } catch (error) {
    console.error(error);
  }

  uploadFile(e, "e");
};

// 上传函数
const uploadFile = async (e: Event, path: any) => {
  let isUP = true;

  const target = e.target as HTMLInputElement;
  //   console.log("target ==> ", target.files);

  if (target.files!.length) {
    let start = 0;
    let index = 0;
    let formData = new FormData();
    // @ts-ignore
    const file = target.files[0];

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
      }
    }

    // 如果上传未完成则使用原有的数据,已完成则添加新数据
    if (isUP) {
      list.value.push(obj);
      percentage.value.push(0);
      isBtn.value.push(true);
      stop.value.push(false);

      // 更新本地会话数据
      sessionStorage.setItem("list", JSON.stringify(list.value));
      sessionStorage.setItem("percentage", JSON.stringify(percentage.value));
      sessionStorage.setItem("stop", JSON.stringify(stop.value));
      sessionStorage.setItem("isBtn", JSON.stringify(isBtn.value));
    }

    const { name, size, type } = file;
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

      await axios.post("http://192.168.37.26:8520/mul_upload/", formData);

      percentage.value[list.value.length] =
        percentage.value[list.value.length] < Math.floor((start / size) * 100)
          ? Math.floor((start / size) * 100)
          : percentage.value[list.value.length];
    }
    // 异步等待文件分片上传
    // axios.post(""+md5(name)).then(res => {
    //     // 完成分片上传后的代码
    // })
    console.log("md5(name) ==> ", md5(name));
    percentage.value[list.value.length] = 100;
    isBtn.value[list.value.length] = false;
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
};

// 控件数据
// @ts-ignore
const isBtn = sessionStorage.getItem("isBtn")
  ? ref(JSON.parse(sessionStorage.getItem("isBtn") as string))
  : ref([true]);

// 点击暂停
const onClick = (index: number) => {
  if (percentage.value[index] == 100) return;

  isBtn.value[index] = !isBtn.value[index];
  stop.value[index] = !stop.value[index];
  if (!stop.value[index]) {
    uploadFile(
      fileObj ||
        restoreFileFromMD5Chunks(
          JSON.parse(localStorage.getItem("md5Hash") as string)[index],
          list.value[index].name
        ),
      "e"
    );
  } else {
    console.log("上传暂停");
  }

  sessionStorage.setItem("stop", JSON.stringify(stop.value));
  sessionStorage.setItem("isBtn", JSON.stringify(isBtn.value));
  sessionStorage.setItem("percentage", JSON.stringify(percentage.value));
};

// 删除功能
const remove: (index: number) => void = (index) => {
  // console.log("index ==> ", index);

  list.value.splice(index, 1);
  percentage.value.splice(index, 1);
  stop.value.splice(index, 1);
  isBtn.value.splice(index, 1);
  sessionStorage.setItem("list", JSON.stringify(list.value));
  sessionStorage.setItem("percentage", JSON.stringify(percentage.value));
  sessionStorage.setItem("stop", JSON.stringify(stop.value));
  sessionStorage.setItem("isBtn", JSON.stringify(isBtn.value));
};

// 创建文件切片的MD5加密函数
async function sliceAndComputeMD5(file: File): Promise<string[]> {
  const chunkArray: ArrayBuffer[] = [];

  for (let i = 0; i < file.size; i += chunksize) {
    const chunk = file.slice(i, i + chunksize);
    const chunkBuffer = await chunk.arrayBuffer();
    chunkArray.push(chunkBuffer);
  }

  const md5Array = chunkArray.map((chunkBuffer) =>
    md5(new Uint8Array(chunkBuffer))
  );

  return md5Array;
}

// 从文件切片数组中还原模拟的File对象
function restoreFileFromMD5Chunks(
  md5Array: string[],
  fileName: string
): File | null {
  const fileArray: Uint8Array[] = [];

  md5Array.forEach((md5Hash) => {
    const hashBytes = hexToBytes(md5Hash);
    const chunkArray = new Uint8Array(hashBytes);
    fileArray.push(chunkArray);
  });

  if (fileArray.length === 0) {
    return null;
  }

  // 合并切片内容为一个完整的 Blob 对象
  const mergedBlob = new Blob(fileArray, { type: "application/octet-stream" });

  // 创建模拟的 File 对象
  const file = new File([mergedBlob], fileName);

  return file;
}

// 将MD5哈希字符串转换为字节数组的函数
function hexToBytes(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
}

onMounted(() => {
  // 在页面加载时恢复上传状态
  const savedFile = localStorage.getItem("savedFile");
  if (savedFile) {
    file.value = JSON.parse(savedFile);
  }
});
</script>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);

  .upload {
    width: 80px;
    height: 30px;
    background-color: #447be4;
    text-align: center;
    line-height: 30px;
    border-radius: 10px;
    color: white;
    margin-left: 50px;
    display: flex;

    .characters {
      font-size: 16px;
      text-align: center;
      line-height: 30px;
    }
  }

  .progress {
    padding: 10px;
    display: flex;
    align-items: center;
    background-color: #f5f7fb;
    height: 40px;
    border: 1px solid #ddd;

    input {
      position: absolute;
      left: -2000px;
      top: 0;
    }
  }

  .uploadList {
    .item {
      display: flex;
      margin: 8px;
      align-items: center;
      justify-content: space-between;

      background-color: #fafafa;
      padding: 14px;

      &:hover {
        background-color: #ddd;
      }

      .itemLeft {
        display: flex;
        align-items: center;

        > img {
          width: 2rem;
          height: 2.5rem;
          margin-right: 1rem;
        }

        .txt {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          > h3,
          > p {
            margin: 0;
          }

          > p {
            display: block;
            text-align: left;
            color: gray;
          }
        }
      }

      .itemRight {
        display: flex;
        align-items: center;

        .item-progress {
          margin: 0 1rem;
          width: 15rem;
        }

        .item-btns {
          margin-left: 1rem;
          display: flex;
          align-items: center;
          width: 5rem;
          justify-content: space-between;
          cursor: pointer;
        }
      }
    }
  }
}

.empty {
  margin-top: 6rem;
}
</style>