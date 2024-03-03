<!--
 * @Author: maple_jy
 * @Date: 2023-09-04 15:27:04
-->
<template>
  <div class="allFolderView">
    <div>
      <div class="box">
        <div class="tops">
          <div class="tops-le">
            <el-button
              :icon="Download"
              class="download"
              style="font-size: 18px"
              :disabled="!deleteVisible"
              @click="downloadFile"
            >
              <div class="characters">下载</div>
            </el-button>
            <el-button
              :icon="FolderAdd"
              class="newFolder"
              style="font-size: 18px"
              @click="open"
            >
              <div class="characters">新建文件夹</div>
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
          </div>
          <div class="tops-rl">
            <el-input
              v-model="input"
              class="input"
              size="large"
              placeholder="搜索你要的文件夹"
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
                @click="advance"
              >
              </el-button>
              <el-button
                :icon="Refresh"
                class="refresh"
                style="font-size: 18px"
                @click="refresh"
              >
              </el-button>
              <div class="pathRecord" v-if="recordes !== '.'">
                {{ recordes }}
              </div>
            </div>
            <div class="eturn-column-rl">
              <el-button
                :icon="Top"
                class="scending-order"
                style="font-size: 18px"
                @click="rise"
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
                <template v-for="(item, index) in items">
                  <li
                    class="file-center-li"
                    v-if="items.name !== 'Recycle Bin'"
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
                      <img
                        v-if="item.icon"
                        :src="getRequire(item.icon)"
                        alt=""
                        class="file-icon"
                        @click="enterFolder(item.path, index)"
                      />
                      <!-- <div class="file-name">{{ item.name }}</div> -->
                      <div class="file-name">
                        <input
                          :disabled="isDisabled"
                          type="text"
                          :data-id="index"
                          v-model="item.name"
                          @dblclick="enableInput"
                          @keyup.enter="disableInput"
                        />
                      </div>
                    </div>
                    <div class="file-center-size">
                      {{ item?.type == "file" ? item.size : "-" }}
                    </div>
                    <div ref="el_image" class="file-center-time">
                      {{ item.time }}
                    </div>
                    <el-image
                      id="img-box"
                      class="image-box"
                      @close="opens"
                      :src="url"
                      :zoom-rate="1.2"
                      :preview-src-list="srcList"
                      :initial-index="1"
                      fit="cover"
                    />
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import router from "../router/index";
import { defineComponent, watch } from "vue";
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
  getDownload,
} from "../api/api";
import { ElMessage, ElMessageBox, Action } from "element-plus";
import { el, it } from "element-plus/es/locale";
import { routerKey, stringifyQuery } from "vue-router";
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

export default defineComponent({
  name: "DetailsPage",

  setup() {
    let currentPath: String = "";
    let token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    //接受图片的
    const imgSrc = ref("");
    const imgUrl = ref("");
    //checked打勾显示编辑分享删除
    // const isChecked = ref(false);
    const isSelectedAll = ref(false);
    const deleteVisible = ref(false);
    //搜索框的,目前拿到关键词,下面一个方法
    const input = ref("");
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
    //搜索的数据
    const searchData = ref([]);

    //用一个变量保存打钩路径
    const newpath: string[] = [];

    // 定义opacity的响应式属性
    const imageOpacity = ref(0);

    //定义一个存放路径的
    const storagepath = ref(".");
    localStorage.setItem("storagepath", storagepath.value);

    //计算属性
    const counterStore = useCounterStore();
    const iconType = computed(() => counterStore.iconType);
    const isUpload = computed(() => counterStore.isUpload);

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

    //对文件大小和时间戳进行转换
    const processedItems = computed(() => {
      const processed: any = [];
      if (!items.value) {
        return;
      }
      items.value.forEach((item) => {
        processed.push({
          ...item,
          size: formatFileSize(item.size),
          time: formatTimestamp(item.time),
        });
      });

      return processed;
    });

    //点击图片放大功能
    const opens = () => {
      console.log("图片预览退出页面了");
      imageOpacity.value = 1; // 更改opacity的值为0
    };
    // 全选
    const selectAllItems = () => {
      isSelectedAll.value = !isSelectedAll.value;
      items.value.forEach((item) => (item.checkbox = isSelectedAll.value));
      deleteVisible.value = isSelectedAll.value;
      if (isSelectedAll.value) {
        items.value.forEach((item) => {
          if (item.checkbox) {
            newpath.push(item.path); // 将选中项的路径添加到数组中
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
      items.value[index].checkbox = !items.value[index].checkbox;
      const selectedItems = items.value.filter((item) => item.checkbox);
      deleteVisible.value = selectedItems.length > 0;

      const newItems = items.value.filter((item) => !item.checkbox);
      isSelectedAll.value = newItems.length === 0;
      // console.log(index);
      console.log(items.value[index].path);
      const path = items.value[index].path;

      if (items.value[index].checkbox) {
        newpath.push(path);
      } else {
        newpath.splice(newpath.indexOf(path), 1);
      }
      // console.log("Selected paths:", newpath);
    };
    //删除方法(完成)
    const onDelete = (index: any) => {
      // console.log("path==>", newpath);
      // console.log(token);

      deletes(newpath, token)
        .then((res) => {
          // console.log(" Delete==>", res);
          enters(storagepath.value, token)
            .then((res) => {
              // console.log("enter==>", res);

              let data = res.data.data;
              // 过滤掉回收站，以防它在这里出现
              const enter = data.filter((e: { name: String }) => {
                if (e.name != "Recycle Bin") {
                  return e;
                }
              });
              items.value = enter;
              recordes.value = res.data.path;
              console.log("recordes.value==>", recordes.value);
              // console.log(items.value);
              for (let i = 0; i < items.value.length; i++) {
                items.value[i].checkbox = false;
                for (let key in iconType.value) {
                  if (enter[i].name.lastIndexOf(".") === -1) {
                    items.value[i].icon = "folder";
                  } else if (
                    iconType.value[key].lastIndexOf(
                      enter[i].name.split(".")[1]
                    ) >= 0
                  ) {
                    items.value[i].icon = key;
                  }
                }
              }
            })
            .catch((err: Error) => {
              // console.log("enter==>", err);
            });
        })
        .catch((err: Error) => {
          console.log("Delete err==>", err);
        });
    };

    // 下载
    const downloadFile = () => {
      console.log("newpath ==> ", newpath);
      downloadFiles(newpath);
      items.value.forEach((item) => {
        item.checkbox = false;
      });
    };

    //图片
    const getRequire = (icon: any) => {
      // console.log("icon==>", icon);
      return require(`@/assets/${icon}.png`);
    };

    // 输入框是否禁用
    const isDisabled = ref(true);
    // 双击改变输入框禁用属性
    const enableInput = () => {
      isDisabled.value = false;
    };
    // 修改文件或文件夹命名
    const disableInput = (e: any) => {
      isDisabled.value = true;
      let val = e.target.value;
      let index = e.target.getAttribute("data-id");
      console.log(index);

      let oldName = ref("");
      let path = ref("");
      let type = ref("");
      for (let i = 0; i < items.value.length; i++) {
        oldName.value = items.value[index].name;
        path.value = items.value[index].path;
        type.value = items.value[index].type;
      }

      console.log(val, oldName.value, path.value, type.value);
      const param = {
        filePath: path.value,
        oldName: oldName.value,
        newName: val,
      };

      console.log("param ==> ", param);

      // 判断文件或文件夹改名
      console.log(
        "oldName.value.split('.')[1] 原文件的后缀==>",
        oldName.value.split(".")[1]
      );
      console.log("val.split('.')[1] 原文件的后缀==>", val.split(".")[1]);

      if (oldName.value.split(".")[1] !== val.split(".")[1]) {
        // 文件后缀不能改
        ElMessageBox.confirm(
          "文件后缀修改可能会导致文件无法打开，是否继续？",
          "Warning",
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        ).then(() => {
          ElMessage({
            type: "success",
            message: "修改成功！",
          });

          axios
            .post("http://192.168.37.77:8520/rename", param, {
              // 原有
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("res ==>", res);
            })
            .catch((err) => {
              console.log("err ==>", err);
            });

          refresh();
        });
      } else if (type.value === "dir") {
        axios
          .post("http://192.168.37.77:8520/rename", param, {
            // 原有
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            console.log("res ==>", res);

            if (res.data.status == "err") {
              ElMessage.error("文件夹已存在");
            } else {
              ElMessage({
                type: "success",
                message: "修改成功！",
              });
            }
            refresh();
          })
          .catch((err) => {
            console.log("err ==>", err);
          });
      }
    };

    //接口,能接到
    onMounted(async () => {
      try {
        // 原有 http://192.168.37.77:8520
        // 测试 http://192.168.37.26:8520
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
            let data = res.data.data;
            // 过滤掉回收站，以防它在这里出现
            items.value = data.filter((e: { name: String }) => {
              if (e.name != "Recycle Bin") {
                return e;
              }
            });

            // items.value = data; // 更新响应式数组的值
            for (let i = 0; i < items.value.length; i++) {
              items.value[i].checkbox = false;
              if (items.value[i].name == "Recycle Bin") {
                items.value.splice(i, 1);
                i--;
                continue;
              }

              for (let key in iconType.value) {
                if (items.value[i].name.lastIndexOf(".") === -1) {
                  items.value[i].icon = "folder";
                } else if (
                  iconType.value[key].lastIndexOf(
                    items.value[i].name.split(".")[1]
                  ) >= 0
                ) {
                  items.value[i].icon = key;
                }
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });

        const textDecoder = new TextDecoder();
      } catch (error) {
        // console.log(error);
      }
    });

    const recordes = ref("");
    const pathRecord: any = ref([]);
    //清除当前保存路径的方法
    const clearNewPath = () => {
      newpath.splice(0, newpath.length);
    };
    //点击进入文件夹里面的
    const enterFolder = (path: string, index: any) => {
      //全选更新
      if (isSelectedAll.value) {
        isSelectedAll.value = !isSelectedAll.value;
      } else {
        isSelectedAll.value = isSelectedAll.value;
      }
      clearNewPath();

      storagepath.value = path;
      //
      if (items.value[index].type === "file") {
        console.log("file");
        if (items.value[index].icon === "img") {
          // @ts-ignore
          document.querySelector("#img-box").click();
          let imagePath = "";
          enters(storagepath.value, token)
            .then((res) => {
              // console.log("enter==>", res);
              imagePath = res.data.path;
              console.log("imagePath==>", imagePath);

              picturePreview(imagePath, token)
                .then((res) => {
                  console.log("图片的==>", res);
                  srcList.value[0] = `data:image/png;base64,${res.data.image}`;
                })
                .catch((err: Error) => {
                  // console.log("enter==>", err);
                });
            })
            .catch((err: Error) => {
              // console.log("enter==>", err);
            });
        } else {
          //弹窗的提示
          ElMessageBox.alert("暂不支持预览该类型文件", "提示信息", {
            confirmButtonText: "OK",
          });
        }
      } else {
        console.log("dir");
        // 清除上一轮保存的本地存储数据
        localStorage.removeItem("storagepath");
        localStorage.removeItem("records");
        // 保存 storagepath.value 到本地存储
        localStorage.setItem("storagepath", storagepath.value);
        console.log("storagepath.value==>", storagepath.value);

        enters(storagepath.value, token)
          .then((res) => {
            // console.log("enter==>", res);
            recordes.value = res.data.path;
            items.value = res.data.data;
            for (let i = 0; i < items.value.length; i++) {
              items.value[i].checkbox = false;

              if (items.value[i].name == "Recycle Bin") {
                items.value.splice(i, 1);
                i--;
                continue;
              }

              for (let key in iconType.value) {
                if (items.value[i].name.lastIndexOf(".") === -1) {
                  // console.log("name1 ==> ", items.value[i].name);

                  items.value[i].icon = "folder";
                } else if (
                  iconType.value[key].lastIndexOf(
                    items.value[i].name.split(".")[1]
                  ) >= 0
                ) {
                  console.log("name2 ==> ", items.value[i].name);
                  items.value[i].icon = key;
                }
              }
            }

            // console.log("items ==> ", items.value);

            // 将当前路径添加到 pathRecord 数组
            pathRecord.value.push(path);
          })
          .catch((err: Error) => {
            // console.log("enter==>", err);
          });

        // 创建记录
        const record = {
          path: storagepath.value,
          timestamp: new Date().getTime(),
        };

        // 获取已有记录
        const existingRecords = localStorage.getItem("records");
        const records = existingRecords ? JSON.parse(existingRecords) : [];

        // 添加新记录
        records.push(record);

        // 将记录保存到本地存储
        localStorage.setItem("records", JSON.stringify(records));
        // console.log("新数组==>", pathRecord);
      }
    };

    // 刷新
    const refresh = () => {
      storagepath.value = localStorage.getItem("storagepath") as string;
      enters(storagepath.value, token)
        .then((res) => {
          // console.log("enter==>", res);
          items.value = res.data.data;

          // console.log(items.value);
          for (let i = 0; i < items.value.length; i++) {
            items.value[i].checkbox = false;

            if (items.value[i].name == "Recycle Bin") {
              items.value.splice(i, 1);
              i--;
              continue;
            }

            for (let key in iconType.value) {
              if (items.value[i].name.lastIndexOf(".") === -1) {
                items.value[i].icon = "folder";
              } else if (
                iconType.value[key].lastIndexOf(
                  items.value[i].name.split(".")[1]
                ) >= 0
              ) {
                items.value[i].icon = key;
              }
            }
          }
        })
        .catch((err: Error) => {
          // console.log("enter==>", err);
        });
    };

    //返回按钮
    const returnder = () => {
      //全选更新
      if (isSelectedAll.value) {
        isSelectedAll.value = !isSelectedAll.value;
      } else {
        isSelectedAll.value = isSelectedAll.value;
      }
      //清空已选路径
      clearNewPath();

      storagepath.value = localStorage.getItem("storagepath") || ".";

      // 判断是否处在了第一级
      if (storagepath.value == ".") return;
      // console.log("123==>", storagepath.value);

      repeat(storagepath);
      // 保存 storagepath.value 到本地存储
      localStorage.setItem("storagepath", storagepath.value);

      // console.log("后退 ==> ", storagepath.value);

      enters(storagepath.value, token)
        .then((res) => {
          // console.log("enter==>", res);
          items.value = res.data.data;
          recordes.value = res.data.path;
          // console.log("recordes.value==>", recordes.value);
          // console.log(items.value);
          for (let i = 0; i < items.value.length; i++) {
            items.value[i].checkbox = false;

            if (items.value[i].name == "Recycle Bin") {
              items.value.splice(i, 1);
              i--;
              continue;
            }

            for (let key in iconType.value) {
              if (items.value[i].name.lastIndexOf(".") === -1) {
                items.value[i].icon = "folder";
              } else if (
                iconType.value[key].lastIndexOf(
                  items.value[i].name.split(".")[1]
                ) >= 0
              ) {
                items.value[i].icon = key;
              }
            }
          }
        })
        .catch((err: Error) => {
          // console.log("enter==>", err);
        });
    };
    //返回按钮里的处理方法
    const repeat = (stor: any) => {
      let lastSlashIndex = stor.value.split("/");
      // console.log(lastSlashIndex);
      lastSlashIndex.pop();
      stor.value = lastSlashIndex.join("/");
      const cutInto = lastSlashIndex.join("/");
      console.log("cutInto==>", cutInto);

      stor.value = stor.value === "" ? "." : stor.value;
    };

    //前进按钮
    const advance = () => {
      //全选更新
      if (isSelectedAll.value) {
        isSelectedAll.value = !isSelectedAll.value;
      } else {
        isSelectedAll.value = isSelectedAll.value;
      }
      //清空已选路径
      clearNewPath();
      // console.log("Selected paths:", newpath);

      // 获取本地存储的 storagepath
      const storedPath = JSON.parse(
        localStorage.getItem("records") as string
      )[0].path;

      let storagepath: any = localStorage.getItem("storagepath");

      storagepath = storagepath == "." ? "" : storagepath?.split("/");

      // console.log("to storagepath", storagepath);

      if (storedPath) {
        // 在这里使用存储的路径进行你的逻辑处理
        // console.log('存储的路径', storedPath);
        const cuttingRecord = storedPath.split("/");
        // console.log("cuttingRecord ==> ", cuttingRecord);

        let nextPath = "";

        if (!storagepath) {
          nextPath = cuttingRecord[0];
        } else if (storagepath.length < cuttingRecord.length) {
          nextPath = cuttingRecord.slice(0, storagepath.length + 1).join("/");
        } else if (storagepath.length == cuttingRecord.length) {
          return;
        }

        // 在这里使用下一个路径进行你的逻辑处理
        console.log("下一个路径", nextPath);

        recordes.value = nextPath;
        console.log("recordes.value", recordes.value);
        localStorage.setItem("storagepath", nextPath);

        enters(nextPath, token)
          .then((res) => {
            // console.log("enter==>", res);
            const enter = res.data.data;
            items.value = enter;
            // console.log(items.value);
            for (let i = 0; i < items.value.length; i++) {
              items.value[i].checkbox = false;

              if (items.value[i].name == "Recycle Bin") {
                items.value.splice(i, 1);
                i--;
                continue;
              }

              for (let key in iconType.value) {
                if (enter[i].name.lastIndexOf(".") === -1) {
                  items.value[i].icon = "folder";
                } else if (
                  iconType.value[key].lastIndexOf(
                    enter[i].name.split(".")[1]
                  ) >= 0
                ) {
                  items.value[i].icon = key;
                }
              }
            }
          })
          .catch((err: Error) => {
            // console.log("enter==>", err);
          });
        // console.log('已经没有更多路径可供前进');
      } else {
        // 如果没有存储的路径，则表示无法前进
        // console.log('无法前进');
      }
    };

    //升序按钮
    const rise = () => {
      ascendingOrder(token)
        .then((res) => {
          // console.log("drop==>", res);
          const drops = res.data.data;
          items.value = drops;
          for (let i = 0; i < items.value.length; i++) {
            items.value[i].checkbox = false;

            if (items.value[i].name == "Recycle Bin") {
              items.value.splice(i, 1);
              i--;
              continue;
            }

            for (let key in iconType.value) {
              if (drops[i].name.lastIndexOf(".") === -1) {
                items.value[i].icon = "folder";
              } else if (
                iconType.value[key].lastIndexOf(drops[i].name.split(".")[1]) >=
                0
              ) {
                items.value[i].icon = key;
              }
            }
          }
        })
        .catch((err: Error) => {
          console.log("drop==>", err);
        });
    };
    //降序按钮
    const drop = () => {
      descendingOrder(token)
        .then((res) => {
          // console.log("drop==>", res);
          const drops = res.data.data;
          items.value = drops;
          for (let i = 0; i < items.value.length; i++) {
            items.value[i].checkbox = false;

            if (items.value[i].name == "Recycle Bin") {
              items.value.splice(i, 1);
              i--;
              continue;
            }

            for (let key in iconType.value) {
              if (drops[i].name.lastIndexOf(".") === -1) {
                items.value[i].icon = "folder";
              } else if (
                iconType.value[key].lastIndexOf(drops[i].name.split(".")[1]) >=
                0
              ) {
                items.value[i].icon = key;
              }
            }
          }
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
      // console.log("keyword==>", { keyword: input.value });
      // 搜索关键词非空校验
      if (!input.value) {
        ElMessage.error("请输入搜索关键词！");
        return;
      }

      // 这里可以调用搜索函数、发起异步请求等
      search(input.value, token)
        .then((res) => {
          // console.log("search==>", res);
          const searchData = res.data.results;
          // console.log(searchData);
          items.value = searchData;

          for (let i = 0; i < items.value.length; i++) {
            items.value[i].checkbox = false;

            for (let key in iconType.value) {
              if (searchData[i].name.lastIndexOf(".") === -1) {
                items.value[i].icon = "folder";
              } else if (
                iconType.value[key].lastIndexOf(
                  searchData[i].name.split(".")[1]
                ) >= 0
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
    //新建文件夹
    const open = () => {
      ElMessageBox.prompt("请输入文件夹名称", "新建文件夹", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        // inputPattern:
        //   /^[a-zA-Z] [a-zA-Z0-9]*$/,
        // inputErrorMessage: 'Invalid Email',
      })
        .then(({ value }) => {
          // console.log(currentPath);

          storagepath.value = localStorage.getItem("storagepath") as string;

          console.log("当前路径", storagepath.value);
          createFolder(
            token,
            currentPath ? currentPath : `./${storagepath.value}`,
            value
          ).then((res) => {
            console.log(res);
            // router.go(0)
            if (res.data.status == "err") {
              ElMessage.error("文件夹已存在");
              refresh();
              return;
            }
            ElMessage({
              type: "success",
              message: `新文件夹:“${value}”创建成功`,
            });
            refresh();
          });
          // router.go(0)

          enters(localStorage.getItem("storagepath"), token)
            .then((res) => {
              // console.log("enter==>", res);
              const enter = res.data.data;
              items.value = enter;
              // console.log(items.value);
              for (let i = 0; i < items.value.length; i++) {
                items.value[i].checkbox = false;
                for (let key in iconType.value) {
                  if (enter[i].name.lastIndexOf(".") === -1) {
                    items.value[i].icon = "folder";
                  } else if (
                    iconType.value[key].lastIndexOf(
                      enter[i].name.split(".")[1]
                    ) >= 0
                  ) {
                    items.value[i].icon = key;
                  }
                }
              }
            })
            .catch((err: Error) => {
              console.log("enter==>", err);
            });
        })
        .catch((err) => {
          console.log(err);
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
    const srcList = ref([""]);

    // 传输功能控制页面刷新
    watch(isUpload, (n, o) => {
      console.log("new value ==> ", n);

      if (n) refresh();
    });

    return {
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
      input,
      url,
      srcList,
      isSelectedAll,
      deleteVisible,
      imgSrc,
      imgUrl,
      imageOpacity,
      items: processedItems,
      isDisabled,
      enableInput,
      disableInput,
      iconType,
      searchData,
      newpath,
      getSearchData,
      opens,
      getRequire,
      selectAllItems,
      selectSingle,
      onDelete,
      search,
      enterFolder,
      returnder,
      drop,
      rise,
      repeat,
      storagepath,
      open,
      advance,
      recordes,
      refresh,
      downloadFile,
    };
  },
});
</script>

<style lang="scss" scoped>
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
        display: flex;
        flex-direction: row;
        margin-top: 5px;

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

        .pathRecord {
          text-align: left;
          margin-left: 20px;
          width: 600px;
          height: 30px;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14px;
          color: #666;
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

            ::v-deep #img-box {
              position: absolute;
              top: 0;
              left: -10000px;
              bottom: 0;
              right: 1150px;
            }

            .file-center-name {
              min-width: 45%;
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
                  display: block;
                  width: 100%;
                  border: 0;
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
  box-shadow: none !important;
}
</style>