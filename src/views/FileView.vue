<template>
  <div class="FileView">
    <div>
      <div class="box">
        <div class="tops">
          <div class="tops-le">
            <el-button
              :icon="Download"
              class="download"
              style="font-size: 18px"
              @click="downFile"
            >
              <div class="characters">下载</div>
            </el-button>
            <el-button
              :icon="DeleteFilled"
              class="delete"
              style="font-size: 18px"
              type="primary"
              size="small"
              @click="deleteFile"
            >
              <div class="characters">删除</div>
            </el-button>
          </div>
          <div class="tops-rl">
            <el-input
              class="input"
              v-model="inputVal"
              size="large"
              placeholder="搜索你要的文件夹"
              :suffix-icon="Search"
              style="font-size: 16px"
              @keyup.enter="searchFile"
            ></el-input>
          </div>
        </div>
        <div class="container">
          <div class="scroll-box">
            <div
              class="img-list-box"
              v-for="(item, index) in fileList"
              :key="index"
              @click="selectSingle(index)"
            >
              <div class="img-box">
                <img :src="`${item.img}`" alt="" />
              </div>
              <span>
                {{ item.name }}
              </span>
              <input type="checkbox" v-model="item.isChecked" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import axios from "axios";
import router from "../router/index";
import { defineComponent } from "vue";
import { ref, onMounted, computed } from "vue";
import { useCounterStore } from "../store/counter";
import {
  search,
  deletes,
  enters,
  createFolder,
  descendingOrder,
  picturePreview,
  ascendingOrder,
} from "../api/api";
import { ElMessage } from "element-plus";
import {
  Upload,
  Download,
  FolderAdd,
  Search,
  ArrowLeftBold,
  ArrowRightBold,
  Refresh,
  Top,
  Bottom,
  Edit,
  Share,
  DeleteFilled,
} from "@element-plus/icons-vue";
import { downloadFiles } from "../mixins/upload";

let currentPath: String = "";
let token = localStorage.getItem("token") || sessionStorage.getItem("token");
let inputVal = ref("");

interface File {
  name: String;
  path: String;
  img: String;
  isChecked: Boolean;
}
// let fileList: File[] = []
// let fileList = ref(File[])
let fileList = ref<File[]>([]);
let fileList_copy = <File[]>[];
const pathList: String[] = [];

const isSelectedAll = ref(false);
const deleteVisible = ref(false);

//用一个变量保存打钩路径
const newpath: string[] = [];

//图片
const getRequire = (icon: any) => {
  // console.log("icon==>", icon);
  return require(`@/assets/${icon}.png`);
};

//接口,能接到
onMounted(async () => {
  try {
    const globalcontent = await axios
      .get("http://192.168.37.77:8520/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          cmd: "list",
        },
      })
      .then((res) => {
        let path = res.data.path;

        // 过滤掉回收站，以防它在这里出现
        let data = res.data.data.filter((e: { name: String }) => {
          if (e.name != "Recycle Bin") {
            return e;
          }
        });

        imgFilter("", data);
        console.log(fileList);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    // console.log(error);
  }
});

const imgFilter = (path: String, data: any) => {
  // console.log("path==>", path);
  // console.log("data==>", data);

  data.map(
    (item: {
      checkbox: String;
      name: String;
      path: String;
      size: Number;
      time: Number;
      type: String;
    }) => {
      if (item.name.indexOf(".") !== -1) {
        let nameArr = item.name.split(".");
        switch (nameArr[nameArr.length - 1]) {
          case "pptx":
            fileList.value.push({
              img: require("../assets/ppt.png"),
              name: item.name,
              isChecked: false,
              path: item.path,
            });
            fileList_copy.push({
              img: require("../assets/ppt.png"),
              name: item.name,
              isChecked: false,
              path: item.path,
            });
            break;
          case "ppt":
            fileList.value.push({
              img: require("../assets/ppt.png"),
              name: item.name,
              isChecked: false,
              path: item.path,
            });
            fileList_copy.push({
              img: require("../assets/ppt.png"),
              name: item.name,
              isChecked: false,
              path: item.path,
            });
            break;
          case "txt":
            fileList.value.push({
              img: require("../assets/txt.png"),
              name: item.name,
              isChecked: false,
              path: item.path,
            });
            fileList_copy.push({
              img: require("../assets/txt.png"),
              name: item.name,
              isChecked: false,
              path: item.path,
            });
            break;
          case "xlsx":
            fileList.value.push({
              img: require("../assets/excel.png"),
              name: item.name,
              isChecked: false,
              path: item.path,
            });
            fileList_copy.push({
              img: require("../assets/txt.png"),
              name: item.name,
              isChecked: false,
              path: item.path,
            });
            break;
          case "xls":
            fileList.value.push({
              img: require("../assets/excel.png"),
              name: item.name,
              isChecked: false,
              path: item.path,
            });
            fileList_copy.push({
              img: require("../assets/excel.png"),
              name: item.name,
              isChecked: false,
              path: item.path,
            });
            break;
          case "docx":
            fileList.value.push({
              img: require("../assets/word.png"),
              name: item.name,
              isChecked: false,
              path: item.path,
            });
            fileList_copy.push({
              img: require("../assets/word.png"),
              name: item.name,
              isChecked: false,
              path: item.path,
            });
            break;
          case "doc":
            fileList.value.push({
              img: require("../assets/word.png"),
              name: item.name,
              isChecked: false,
              path: item.path,
            });
            fileList_copy.push({
              img: require("../assets/word.png"),
              name: item.name,
              isChecked: false,
              path: item.path,
            });
            break;
          default:
            break;
        }

        // return;
      } else {
        if (data.length == 1) {
          return;
        }
        enters(item.path, token)
          .then((res) => {
            // console.log(res);
            imgFilter(item.path, res.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  );
};
const downFile = () => {
 console.log("newpath ==> ", newpath);
  downloadFiles(newpath);
  fileList.value.forEach(item => {
    item.isChecked = false;
  })
};

// 单选
const selectSingle = (index: number) => {
  fileList.value[index].isChecked = !fileList.value[index].isChecked;
  const selectedItems = fileList.value.filter((item) => item.isChecked);
  deleteVisible.value = selectedItems.length > 0;

  const newItems = fileList.value.filter((item) => !item.isChecked);
  isSelectedAll.value = newItems.length === 0;
  // console.log(index);
  console.log(fileList.value[index].path);
  const path = fileList.value[index].path.toString();

  if (fileList.value[index].isChecked) {
    newpath.push(path);
  } else {
    newpath.splice(newpath.indexOf(path), 1);
  }
  // console.log("Selected paths:", newpath);
};

const deleteFile = () => {
  fileList.value.forEach((img: File) => {
    if (img.isChecked) {
      console.log(img);
      pathList.push(img.path);
    }
  });
  deletes(pathList, token)
    .then((res) => {
      console.log(res);
      router.go(0);
    })
    .catch((err) => {
      console.log(err);
    });
};

const searchFile = (e: any) => {
  fileList.value = fileList_copy;
  let newImgList = fileList.value.filter((img) => {
    return img.name.toLowerCase().indexOf(e.target.value) !== -1;
  });
  console.log(newImgList);
  fileList.value = newImgList;
};

const url =
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg";
const srcList = ref([""]);
</script>
  
<style lang="scss" scoped>
.FileView {
  color: #333;
  width: 100%;
  height: 100%;

  > div {
    height: 100%;
  }
}

.box {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .tops {
    min-height: 60px;
    background-color: #f5f7fb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e4e2e2;

    .tops-le {
      display: flex;

      .delete {
        width: 80px;
        height: 30px;
        border: 1px solid #999;
        text-align: center;
        line-height: 30px;
        border-radius: 10px;
        color: #447be4;
        background-color: #fff;
        font-weight: 600;
        margin-left: 30px;
      }

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

      .download {
        width: 80px;
        height: 30px;
        border: 1px solid #999;
        text-align: center;
        line-height: 30px;
        border-radius: 10px;
        color: #447be4;
        font-weight: 600;
        margin-left: 30px;

        .characters {
          font-size: 16px;
          text-align: center;
          line-height: 30px;
        }
      }

      .newFolder {
        width: 120px;
        height: 30px;
        border: 1px solid #999;
        text-align: center;
        line-height: 30px;
        border-radius: 10px;
        color: #447be4;
        font-weight: 600;
        margin-left: 30px;

        .characters {
          font-size: 16px;
          text-align: center;
          line-height: 30px;
        }
      }
    }

    .tops-rl {
      .input {
        width: 300px;
        outline: none;
        height: 30px;
        box-sizing: border-box;
        margin-right: 50px;
      }
    }
  }

  .container {
    width: 100%;
    height: calc(100%);
    overflow: scroll;

    &::-webkit-scrollbar {
      display: none;
    }

    flex-grow: 1;

    .scroll-box {
      width: 100%;
      height: 100px;
      display: flex;
      // justify-content: space-around;
      flex-direction: row;
      flex-wrap: wrap;

      .img-list-box {
        width: 100px;
        height: 100px;
        background-color: #f8f8f8;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 0;
        position: relative;
        cursor: pointer;
        margin: 8px;
        transition: all 0.3s ease-out;

        &:hover {
          transform: translate(-3px, -3px);
          background-color: #ddd;
        }

        .img-box {
          width: 60px;
          height: 60px;
          // background-color: #447be4;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            height: 60%;
          }
        }

        span {
          width: 70px;
          height: 30px;
          line-height: 15px;
          margin-top: 5px;
          font-size: 12px;
          text-align: center;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        input {
          position: absolute;
          top: 0px;
          right: 0px;
        }
      }
    }

    .container {
      width: 100%;
      height: calc(100%);
      overflow: scroll;

      &::-webkit-scrollbar {
        display: none;
      }

      flex-grow: 1;

      .scroll-box {
        width: 100%;
        height: 100px;
        display: flex;
        // justify-content: space-around;
        flex-direction: row;
        flex-wrap: wrap;

        .img-list-box {
          width: 100px;
          height: 100px;
          // background-color: red;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0;
          position: relative;

          &:hover {
            background-color: #ecf5ff;
          }

          .img-box {
            width: 60px;
            height: 60px;
            // background-color: #447be4;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              height: 60%;
            }
          }

          span {
            width: 70px;
            height: 30px;
            margin-top: 5px;
            font-size: 12px;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          input {
            position: absolute;
            top: 0px;
            right: 0px;
          }
        }
      }
    }
  }
}

.file-icon:hover {
    box-shadow:none !important;
}
</style>