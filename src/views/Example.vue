<template>
  <div>
    <button @click="fileUpload">Upload</button>
    <input type="file" name="" multiple id="" @change="getData" />
    <template v-for="(item, index) in list" :key="index">
      <div class="img-box">
        <img class="auto-img" :src="require(`@/assets/img.png`)" />
      </div>
      <el-progress
        :percentage="percentage[index]"
        :duration="10"
        :show-text="false"
      />
      <button @click="onClick(index)">暂停</button>
    </template>
  </div>

  <div v-for="(item, index) in items" :key="index">
    <img :src="require(`@/assets/img.png`)" alt="" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed,watch } from "vue";
import axios from "axios";
import { useCounterStore } from "../store/counter";
import { upLoadCount } from "../mixins/upLoadCount";
import md5 from "js-md5";

export default defineComponent({
  setup() {
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
    //计算属性
    const counterStore = useCounterStore();
    const iconType = computed(() => counterStore.iconType);

    // 切片大小为2M
    const chunksize = 2 * 1024 * 1024;
    // 当前上传的文件数量
    let isUpLoadCount = ref(0);
    let token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    // 是否显示传输框
    let isShow = ref(false);

    // 点击函数
const fileUpload = () => {
  // @ts-ignore
  document.querySelector("input").click();
  // console.log(444);
};

// 获取文件信息
const getData = async (e: Event) => {
  // @ts-ignore
  fileObj.push(e.target.files[0]);

  if(percentage.value[percentage.value.length-1]<100 && percentage.value.length > 1) {
    console.log("前一个任务还未上传成功，请等待上传成功后再上传");
    
  }else {
    isShow.value = true;
  
    const storedPath = localStorage.getItem("storagepath") || ".";
  
    // uploadFile(e, `${storedPath}`);
    uploadFile(e);
  }


};

    // 是否停止上传
    // @ts-ignore
    const stop = ref([false]);
    let fileObj: Event[] = [];

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
        // uploadFile(fileObj, `${storedPath}`);
        uploadFile(fileObj[0]);
      } else {
        console.log("上传暂停");
      }
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

    // 上传函数
    const uploadFile = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      console.log("target ==> ", target.files);

      if (target.files!.length) {
        // @ts-ignore
        const files = Array.from(target.files); // Convert FileList to an array of files

        const uploadPromises = files.map(async (file) => {
          let isUP = true;
          let isSameName = false;

          let start = 0;
          let index = 0;
          let formData = new FormData();

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
            formData.append("path", "e");
            console.log(`formData ${index} ==> `, formData.get("path"));

            index++;

            await axios.post("http://192.168.37.26:8520/mul_upload", formData, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            percentage.value[list.value.length - 1] =
              percentage.value[list.value.length - 1] <
              Math.floor((start / size) * 100)
                ? Math.floor((start / size) * 100)
                : percentage.value[list.value.length - 1];
          }

          console.log("md5(name) ==> ", md5(name));
          percentage.value[list.value.length - 1] = 100;
          isBtn.value[list.value.length - 1] = false;
        });

        await Promise.all(uploadPromises); // Wait for all file uploads to complete

        counterStore.upLoad_value();
        target.value = "";
        isUpLoadCount.value = upLoadCount(percentage.value) - 1;
      }
    };

    const upload = (e: Event) => {
      let target = e.target as HTMLInputElement;

      // console.dir(target);

      let folder = {
        type: "folder",
        // @ts-ignore
        name: target!.files[0].webkitRelativePath.split("/")[0],
        parentPath: "/",
        childs: new Map(),
      };
      [].forEach.call(target.files, (file: File) => {
        const folders = file.webkitRelativePath.split("/").slice(1, -1); //文件的上级文件夹列表
        let parent = folder;
        folders.forEach((F) => {
          parent.childs.has(F) ||
            parent.childs.set(F, {
              type: "folder",
              name: F,
              parentPath: parent.parentPath + "/" + parent.name,
              childs: new Map(),
            }); //创建父级文件夹
          parent = parent.childs.get(F);
        });
        parent.childs.set(file.name, {
          type: "file",
          name: file.name,
          parentPath: parent.parentPath + "/" + parent.name,
          file,
        }); //存放文件
      });

      console.log(folder);
    };
    onMounted(async () => {
      try {
        // 原有 http://192.168.37.77:8520
        // 测试 http://192.168.43.238:8520
        const globalcontent = await axios
          .get("http://192.168.43.238:8520/", {
            // headers: {
            //   Authorization: `Bearer ${token}`,
            // },
            params: {
              cmd: "list",
            },
          })
          .then((res) => {
            console.log(res.data);

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
            // console.log("items ==> ", items.value);
          })
          .catch((err) => {
            console.log(err);
          });
        // const arrayBuffer = await response.data;
        // const byteArray = new Uint8Array(arrayBuffer);
        const textDecoder = new TextDecoder();
        // const text = textDecoder.decode(byteArray);
        // const base64 = btoa(text);
        // let img = `data:image/png;base64, ${base64}`;
        // let file = base64ImgtoFile(img);
        // let url = window.webkitURL.createObjectURL(file) || window.URL.createObjectURL(file);
        // console.log(file);
        // console.log(url);
        // imgSrc.value = `data:image/png;base64, ${base64}`;
        // imgUrl.value = URL.createObjectURL(response.data);
        // console.log(imgSrc.value);
        // console.log(imgUrl.value);
      } catch (error) {
        // console.log(error);
      }
    });

    const paths = ["1 (5).png"];

    async function downloadFiles(filePaths: any) {
      try {
        for (let i = 0; i < filePaths.length; i++) {
          const response = await axios.get(
            "http://192.168.43.238:8520/download-files",
            {
              params: { path: filePaths[i] },
              responseType: "arraybuffer",
            }
          );

          let name = filePaths[i].split("/");
          const blob = new Blob([response.data]);
          const downloadUrl = URL.createObjectURL(blob);
          const fileName = name[name.length - 1];

          const downloadLink = document.createElement("a");
          downloadLink.href = downloadUrl;
          downloadLink.download = fileName;
          downloadLink.textContent = fileName;

          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      } catch (error) {
        console.error(error);
      }
    }

    // 发送请求获取文件数据
    // downloadFiles(paths);

    watch(stop.value,(n,o) => {
      console.log("new value ==> ", n);
      
      

    })

    return {
      upload,
      items,
      uploadFile,
      percentage,
      list,
      onClick,
      getData,
      fileUpload,
    };
  },
});
</script>

<style scoped>
.img-box {
  width: 40px;
  height: 40px;
}
</style>