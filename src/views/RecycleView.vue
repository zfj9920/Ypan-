<template>
  <div>
    <div v-show="isHaveData">
      <div class="box">
        <div class="tops">
          <div class="tops-le">
            <el-button
              :icon="DeleteFilled"
              class="upload"
              style="font-size: 18px"
              type="primary"
              size="small"
              @click="onClear"
            >
              <div class="characters">清空</div>
            </el-button>
            <el-button
              :icon="DeleteFilled"
              class="delete"
              style="font-size: 18px"
              type="primary"
              size="small"
              v-show="deleteVisible"
              @click="onDelete"
            >
              <div class="characters">删除</div>
            </el-button>
            <el-button
              :icon="Refresh"
              class="delete"
              style="font-size: 18px"
              type="primary"
              size="small"
              v-show="deleteVisible"
              @click="onReturn"
            >
              <div class="characters">恢复</div>
            </el-button>
          </div>
          <div class="tops-rl">
            <el-input
              v-model="input"
              class="input"
              size="large"
              placeholder="在回收站搜索文件"
              :suffix-icon="Search"
              style="font-size: 16px"
              @keyup.enter="getSearchData"
            ></el-input>
          </div>
        </div>
        <div class="centers">
          <!-- 返回栏 -->
          <div class="return-column">
            <div class="eturn-column-le">
              <el-button
                :icon="ArrowLeftBold"
                class="return"
                style="font-size: 18px"
                @click="returnder"
              >
              </el-button>
              <el-button
                :icon="ArrowRightBold"
                class="advance"
                style="font-size: 18px"
              >
              </el-button>
              <el-button
                :icon="Refresh"
                class="refresh"
                style="font-size: 18px"
              >
              </el-button>
            </div>
            <div class="eturn-column-rl">
              <el-button
                :icon="Top"
                class="scending-order"
                style="font-size: 18px"
              >
              </el-button>
              <el-button
                :icon="Bottom"
                class="descending-order"
                style="font-size: 18px"
                @click="drop"
              >
              </el-button>
            </div>
          </div>
          <!-- 显示文件 -->
          <div class="file">
            <div class="file-tops">
              <div class="select-all">
                <input
                  type="checkbox"
                  name=""
                  id=""
                  class="whole"
                  :checked="isSelectedAll"
                  @change="selectAllItems"
                />
                文件名
              </div>
              <div class="file-size">文件大小</div>
              <div class="update-time">时间</div>
            </div>
            <div class="file-center">
              <ul>
                <li
                  class="file-center-li"
                  v-for="(item, index) in processedItems"
                  :key="index"
                >
                  <div class="check-box">
                    <input
                      type="checkbox"
                      :id="'item-checkbox-' + index"
                      class="whole"
                      v-model="item.checkbox"
                      @click="selectSingle(index)"
                    />
                  </div>
                  <div class="file-center-name">
                    <div class="file-icon">
                      <img
                        v-if="item.icon"
                        :src="getRequire(item.icon)"
                        alt=""
                        class="auto-img"
                      />
                    </div>
                    <!-- <div class="file-name">{{ item.name }}</div> -->
                    <div class="file-name">
                      <input
                        :disabled="isDisabled"
                        type="text"
                        :data-id="index"
                        v-model="item.name"
                      />
                    </div>
                  </div>
                  <div class="file-center-size">
                    {{ item?.type == "file" ? item.size : "-" }}
                  </div>
                  <div ref="el_image" class="file-center-time">
                    {{ item.time }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="recycle-bin" v-show="!isHaveData">
      <div class="trashcan">
        <img
          src="https://pannss.bdstatic.com/m-static/service-widget-1/pageSet/recyclebin/img/emptypic_a07843d.png"
          alt=""
        />
      </div>
      <div class="empty">您的回收站为空噢～</div>
      <div class="prompt">
        回收站为你保存 10天 内删除的文件，想要延长保存时间？ 购买套餐 延长至
        15天 开通超级会员 延长至 30天
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import router from "../router/index";
import { defineComponent, Ref, watch } from "vue";
import { ref, onMounted, computed } from "vue";
import { useCounterStore } from "../store/counter";
import {
  search,
  enters,
  createFolder,
  descendingOrder,
  recycleDeletes,
  returnFiles,
  picturePreview,
} from "../api/api";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Search,
  ArrowLeftBold,
  ArrowRightBold,
  Refresh,
  Top,
  Bottom,
  DeleteFilled,
} from "@element-plus/icons-vue";

import { routerKey } from "vue-router";

//定义一个存放路径的
const storagepath = ref("");
//自己定义的假数据
const items = ref([
  {
    checkbox: false,
    name: "20220920全片改bug.zip",
    size: "35342123",
    time: "1667794821",
    type: "dir",
    icon: "file",
    path: "",
  },
]);
// 显示
const isHaveData = ref(false);

onMounted(async () => {
  storagepath.value = "Recycle Bin";
  let token = localStorage.getItem("token") || sessionStorage.getItem("token");

  enters(storagepath.value, token)
    .then((res) => {
      console.log("回收站数据 ==>", res);
      const enter = res.data.data;
      items.value = enter;
      console.log(items.value);
      for (let i = 0; i < items.value.length; i++) {
        items.value[i].checkbox = false;

        for (let key in iconType.value) {
          if (enter[i].name.lastIndexOf(".") === -1) {
            items.value[i].icon = "folder";
          } else if (
            iconType.value[key].lastIndexOf(enter[i].name.split(".")[1]) >= 0
          ) {
            items.value[i].icon = key;
          }
        }
      }
      // 判断回收站是否有数据
      if (items.value.length > 0) {
        isHaveData.value = true;
      }
    })
    .catch((err) => {
      console.log("err ==>", err);
    });
});

let currentPath = "";
let token = localStorage.getItem("token") || sessionStorage.getItem("token");

//接受图片的
const imgSrc = ref("");
const imgUrl = ref("");
//checked打勾显示编辑分享删除
// const isChecked = ref(false);
const isSelectedAll = ref(false);
const deleteVisible = ref(false);
//搜索框的,目前拿到关键词,下面一个方法
const input = ref("");
//搜索的数据
const searchData = ref([]);
//用一个变量保存打钩路径
// const newpath = ref("");

// 定义opacity的响应式属性
const imageOpacity = ref(0);

//计算属性
const counterStore = useCounterStore();
const iconType = computed(() => counterStore.iconType);

//做了假数据,对数据进行处理的有文件大小,时间戳
const formatFileSize = (size: string) => {
  const fileSizeInBytes = parseInt(size);
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  const gigabyte = megabyte * 1024;
  const terabyte = gigabyte * 1024;

  if (fileSizeInBytes < kilobyte) {
    return fileSizeInBytes.toString() + "B";
  } else if (fileSizeInBytes < megabyte) {
    const fileSizeInKB = (fileSizeInBytes / kilobyte).toFixed(1);
    return fileSizeInKB + "K";
  } else if (fileSizeInBytes < gigabyte) {
    const fileSizeInMB = (fileSizeInBytes / megabyte).toFixed(1);
    return fileSizeInMB + "M";
  } else if (fileSizeInBytes < terabyte) {
    const fileSizeInGB = (fileSizeInBytes / gigabyte).toFixed(1);
    return fileSizeInGB + "G";
  } else {
    const fileSizeInTB = (fileSizeInBytes / terabyte).toFixed(1);
    return fileSizeInTB + "T";
  }
};
//转换时间的
const formatTimestamp = (timestamp: string) => {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleString(); // 根据本地时间格式进行转换
};

//转换文件大小,时间戳
const processedItems = computed(() => {
  return items.value.map((item) => {
    return {
      ...item,
      size: formatFileSize(item.size),
      time: formatTimestamp(item.time),
    };
  });
});

//点击图片放大功能
const opens = () => {
  console.log("图片预览退出页面了");
  imageOpacity.value = 1; // 更改opacity的值为0
};
//用一个变量保存打钩路径
const newpath: String[] = [];
//清除当前保存路径的方法
const clearNewPath = () => {
  newpath.splice(0, newpath.length);
};
// 全选
const selectAllItems = () => {
  isSelectedAll.value = !isSelectedAll.value;
  items.value.forEach((item) => (item.checkbox = isSelectedAll.value));
  deleteVisible.value = isSelectedAll.value;
  if (isSelectedAll.value) {
    items.value.forEach((item) => {
      if (item.checkbox) {
        let paths = item.path.split("/")[1];
        console.log("paths ==>", paths);
        newpath.push(paths); // 将选中项的路径添加到数组中
      }
    });
    console.log("Selected paths:", newpath);
  } else {
    clearNewPath();
    console.log("Selected paths:", newpath);
  }
};
// 单选
const selectSingle = (index: number) => {
  items.value[index].checkbox = !items.value[index].checkbox;
  const selectedItems = items.value.filter((item) => item.checkbox);
  deleteVisible.value = selectedItems.length > 0;

  const newItems = items.value.filter((item) => !item.checkbox);
  isSelectedAll.value = newItems.length === 0;
  console.log(index);
  console.log(items.value[index].path);
  const path = items.value[index].path;

  if (items.value[index].checkbox) {
    let paths = path.split("/")[1];
    console.log("paths ==>", paths);
    newpath.push(paths);
  } else {
    newpath.splice(newpath.indexOf(path), 1);
  }
  console.log("Selected paths:", newpath);
};
// 清空回收站
const onClear = () => {
  console.log(token);
  axios
    .post("http://192.168.37.77:8520/empty_recycle_bin", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log("清空回收站 ==>", res);
      ElMessage({
        message: "清空回收站成功！",
        type: "success",
      });
      router.go(0);
    })
    .catch((err) => {
      console.log("清空回收站 ==>", err);
      ElMessage.error("清空回收站失败！");
    });
};
//删除方法
const onDelete = () => {
  console.log("path==>", newpath);
  console.log(token);

  recycleDeletes(newpath, token)
    .then((res) => {
      console.log("删除文件成功 ==>", res);
      ElMessage({
        message: "删除回收站文件成功！",
        type: "success",
      });
      router.go(0);
    })
    .catch((err) => {
      console.log("删除回收站文件失败 ==>", err);
      ElMessage.error("删除回收站文件失败！");
    });
};
// 恢复
const onReturn = () => {
  console.log("path==>", newpath);
  console.log(token);

  returnFiles(newpath, token)
    .then((res) => {
      console.log("恢复回收站指定文件成功 ==>", res);
      ElMessage({
        message: "恢复文件成功！",
        type: "success",
      });
      router.go(0);
    })
    .catch((err) => {
      console.log("恢复回收站指定文件失败 ==>", err);
      ElMessage.error("恢复文件失败！");
    });
};

//图片
const getRequire = (icon: any) => {
  return require(`@/assets/${icon}.png`);
};

// 输入框是否禁用
const isDisabled = ref(true);

//返回按钮
const returnder = () => {
  console.log("123==>", storagepath);
};

//降序按钮
const drop = () => {
  descendingOrder(token)
    .then((res) => {
      console.log("drop==>", res);
    })
    .catch((err: Error) => {
      console.log("drop==>", err);
    });
};

//搜索关键字
const getSearchData = () => {
  // 在这里执行搜索逻辑
  // 根据input的值进行搜索操作
  console.log("执行搜索操作，搜索关键词为:", input.value);
  console.log("keyword==>", { keyword: input.value });
  // 搜索关键词非空校验
  if (!input.value) {
    ElMessage.error("请输入搜索关键词！");
    return;
  }

  axios
    .post("http://192.168.37.77:8520/search_files", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        path: "Recycle Bin/",
        keyword: input.value,
      },
    })
    .then((res) => {
      console.log("search==>", res);
      const searchData = res.data.results;
      console.log(searchData);
      items.value = searchData;
      for (let i = 0; i < items.value.length; i++) {
        items.value[i].checkbox = false;

        for (let key in iconType.value) {
          if (searchData[i].name.lastIndexOf(".") === -1) {
            items.value[i].icon = "folder";
          } else if (
            iconType.value[key].lastIndexOf(searchData[i].name.split(".")[1]) >=
            0
          ) {
            items.value[i].icon = key;
          }
        }
      }
    })
    .catch((err: Error) => {
      console.log("search==>", err);
    });
};

const open = () => {
  ElMessageBox.prompt("请输入文件夹名称", "新建文件夹", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  })
    .then(({ value }) => {
      ElMessage({
        type: "success",
        message: `新文件夹:“${value}”创建成功`,
      });

      console.log(currentPath);
      createFolder(token, currentPath ? currentPath : "./", value)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "文件夹未创建",
      });
    });
};

//图片的
const base64ImgtoFile = (dataurl: string, filename = "file") => {
  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error("Invalid dataurl format");
  }
  const mime = mimeMatch[1];
  const suffix = mime.split("/")[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], `${filename}.${suffix}`, { type: mime });
};
const url =
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg";
const srcList: Ref<string[]> = ref([]);
</script>

<style lang="scss" scoped>
.recycle-bin {
  width: 380px;
  height: 180px;
  margin: 200px 0 200px 450px;

  .empty {
    margin-top: 15px;
    font-size: 16px;
    font-weight: 700;
    color: #03081a;
  }

  .prompt {
    font-size: 14px;
    color: #636d7e;
    line-height: 25px;
    margin-top: 30px;
  }
}

.allFolderView {
  color: #333;
  width: 100%;
}

.box {
  margin: 0 auto;
  width: 100%;
  height: 100%;

  .tops {
    height: 60px;
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

  .centers {
    .return-column {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      border-bottom: 1px solid #e4e2e2;

      .eturn-column-le {
        margin-left: 40px;

        .return {
          width: 30px;
          height: 30px;
          border: none;
        }

        .advance {
          width: 30px;
          height: 30px;
          border: none;
        }

        .refresh {
          width: 30px;
          height: 30px;
          border: none;
        }
      }

      .eturn-column-rl {
        margin-right: 40px;

        .scending-order {
          width: 30px;
          height: 30px;
          border: none;
        }

        .descending-order {
          width: 30px;
          height: 30px;
          border: none;
        }
      }
    }

    .file {
      height: 30px;
      border-bottom: 1px solid #e4e2e2;
      line-height: 30px;

      .file-tops {
        display: flex;
        justify-content: space-between;
        margin-left: 40px;
        margin-right: 40px;
        color: #929292;
        text-align: left;

        .select-all {
          width: 45%;
          display: flex;
          align-items: center;

          .whole {
            width: 16px;
            height: 16px;
            border-radius: 0px;
          }
        }

        .file-size {
          width: 20%;
          border-left: 1px solid #e4e2e2;
          text-align: center;
          margin-left: 10px;
        }

        .update-time {
          width: 35%;
          border-left: 1px solid #e4e2e2;
          text-align: center;
        }
      }

      .file-center {
        max-height: calc(100vh - 193px);
        overflow: auto;

        ul {
          margin: 0;
          padding: 0;

          .file-center-li {
            position: relative;
            height: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 10px;
            padding: 4px 8px;
            color: #929292;
            text-align: left;
            font-size: 13px;

            &:hover {
              background-color: #ecf5ff;
            }

            .image-box {
              position: absolute;
              top: 0;
              left: 30px;
              bottom: 0;
              right: 1150px;
              cursor: pointer;
            }

            .file-center-name {
              width: 45%;
              display: flex;
              align-items: center;

              .whole {
                width: 16px;
                height: 16px;
              }

              .file-icon {
                width: 32px;
                margin-left: 10px;
                cursor: pointer;
                transition: all 0.3s ease-out;

                &:hover {
                  transform: translate(-3px, -3px);
                  box-shadow: 0px 0px 1px 1px #888;
                }
              }

              .file-name {
                flex: 1;
                margin-left: 20px;

                input {
                  border: 0;
                  display:block;
                  width: 100%;
                  background-color: transparent;
                }
              }
            }

            .file-center-size {
              width: 20%;
              text-align: center;
            }

            .file-center-time {
              width: 35%;
              text-align: center;
            }

            ::v-deep .el-image__inner {
              opacity: 0 !important;
            }
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