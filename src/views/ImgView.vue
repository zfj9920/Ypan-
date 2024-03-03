<template>
  <div class="ImgView">
    <div>
      <div class="box">
        <div class="tops">
          <div class="tops-le">
            <el-button
              :icon="Download"
              class="download"
              style="font-size: 18px"
              @click="downImg"
            >
              <div class="characters">下载</div>
            </el-button>
            <el-button
              :icon="DeleteFilled"
              class="delete"
              style="font-size: 18px"
              type="primary"
              size="small"
              @click="deleteImg"
            >
              <div class="characters">删除</div>
            </el-button>
          </div>
          <div class="tops-rl">
            <el-input
              class="input"
              v-model="input"
              size="large"
              placeholder="搜索你要的图片"
              :suffix-icon="Search"
              style="font-size: 16px"
              @keyup.enter="searchImg"
            ></el-input>
          </div>
        </div>
        <div class="container">
          <div class="scroll-box">
            <div
              class="img-list-box"
              v-for="(item, index) in imgList"
              :key="index"
              @click="selectSingle(index)"
            >
              <div class="img-box">
                <el-image
                  id="img-box"
                  class="image-box"
                  @close="opens"
                  :src="`${item.img}`"
                  :zoom-rate="1.2"
                  :preview-src-list="srcList"
                  :initial-index="index"
                  fit="cover"
                  preview-teleported
                />
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
import { Ref } from "vue";
import { ref, onMounted } from "vue";
import { deletes, enters, picturePreview } from "../api/api";
import { Download, Search, DeleteFilled } from "@element-plus/icons-vue";
import { downloadFiles } from "../mixins/upload";

// 定义opacity的响应式属性
const imageOpacity = ref(0);
const isSelectedAll = ref(false);
const deleteVisible = ref(false);

let token = localStorage.getItem("token") || sessionStorage.getItem("token");
let input = ref("");
//用一个变量保存打钩路径
const newpath: string[] = [];

interface Img {
  name: String;
  path: String;
  img: String;
  isChecked: Boolean;
}
// let imgList: Img[] = []
// let imgList = ref(Img[])
let imgList = ref<Img[]>([]);
let imgList_copy = <Img[]>[];
const pathList: String[] = [];

//图片
const getRequire = (icon: any) => {
  // console.log("icon==>", icon);
  return require(`@/assets/${icon}.png`);
};

//清除当前保存路径的方法
const clearNewPath = () => {
  newpath.splice(0, newpath.length);
};

// 全选
const selectAllItems = () => {
  isSelectedAll.value = !isSelectedAll.value;
  imgList.value.forEach((item) => (item.isChecked = isSelectedAll.value));
  deleteVisible.value = isSelectedAll.value;
  if (isSelectedAll.value) {
    imgList.value.forEach((item) => {
      if (item.isChecked) {
        newpath.push(item.path.toString()); // 将选中项的路径添加到数组中
      }
    });
    // console.log("Selected paths:", newpath);
  } else {
    clearNewPath();
    // console.log("Selected paths:", newpath);
  }
};
// 单选
const selectSingle = (index: number) => {
  imgList.value[index].isChecked = !imgList.value[index].isChecked;
  const selectedItems = imgList.value.filter((item) => item.isChecked);
  deleteVisible.value = selectedItems.length > 0;

  const newItems = imgList.value.filter((item) => !item.isChecked);
  isSelectedAll.value = newItems.length === 0;
  // console.log(index);
  console.log(imgList.value[index].path);
  const path = imgList.value[index].path.toString();

  if (imgList.value[index].isChecked) {
    newpath.push(path);
  } else {
    newpath.splice(newpath.indexOf(path), 1);
  }
  // console.log("Selected paths:", newpath);
};

// 下载
const downloadFile = () => {
  console.log("newpath ==> ", newpath);
  downloadFiles(newpath);
  imgList.value.forEach(item => {
    item.isChecked = false;
  })
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
        console.log(imgList);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    // console.log(error);
  }
});

const imgFilter = (path: String, data: any) => {
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
        const imageExtensions = /\.(jpeg|jpg|gif|png|bmp)$/i;
        if (imageExtensions.test(item.name.toString())) {
          picturePreview(item.path, token)
            .then((res) => {
              imgList.value.push({
                img: `data:image/png;base64,${res.data.image}`,
                name: item.name,
                isChecked: false,
                path: item.path,
              });
              imgList_copy.push({
                img: `data:image/png;base64,${res.data.image}`,
                name: item.name,
                isChecked: false,
                path: item.path,
              });
              srcList.value.push(`data:image/png;base64,${res.data.image}`);
            })
            .catch((err: Error) => {
              console.log("enter==>", err);
            });
        }
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
          })
          .catch((err: Error) => {
            console.log("enter==>", err);
          });
      }
    }
  );
};
const checkImg = (i: number) => {
  imgList.value[i].isChecked = !imgList.value[i].isChecked;
};
const searchImg = (e: any) => {
  imgList.value = imgList_copy;
  let newImgList = imgList.value.filter((img) => {
    return img.name.toLowerCase().indexOf(e.target.value) !== -1;
  });
  console.log(newImgList);
  imgList.value = newImgList;
};
const downImg = () => {
  downloadFile()
};

const deleteImg = () => {
  imgList.value.forEach((img: Img) => {
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

//点击图片放大功能
const opens = () => {
  console.log("图片预览退出页面了");
  imageOpacity.value = 1; // 更改opacity的值为0
};

const url =
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg";
const srcList: Ref<string[]> = ref([]);
</script>
  
<style lang="scss" scoped>
.ImgView {
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
      flex-direction: row;
      flex-wrap: wrap;

      .img-list-box {
        width: 100px;
        height: 100px;
        background-color: #f8f8f8;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 20px;
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
        }

        span {
          width: 70px;
          height: 28px;
          line-height: 14px;
          margin-top: 5px;
          font-size: 12px;
          text-overflow: ellipsis;
          text-align: center;
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
        flex-direction: row;
        flex-wrap: wrap;

        .img-list-box {
          width: 100px;
          height: 100px;
          // background-color: red;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          padding: 10px;
          margin: 0 30px;
          margin-bottom: 20px;

          &:hover {
            background-color: #ecf5ff;
          }

          &:hover {
            background-color: #ecf5ff;
          }

          .img-box {
            width: 60px;
            height: 60px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;

            > div {
              height: 100%;
            }
          }

          span {
            width: 70px;
            height: 28px;
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