<!--
 * @Author: maple_jy
 * @Date: 2023-09-04 22:54:11
-->
<template>
  <div>
    <div class="box">
      <div class="tops">
        <div class="tops-le" v-show="!isChecked">
          <el-button
            :icon="Upload"
            class="upload"
            style="font-size: 18px"
            type="primary"
            size="small"
          >
            <div class="characters">上传</div>
          </el-button>
          <el-button :icon="Download" class="download" style="font-size: 18px">
            <div class="characters">下载</div>
          </el-button>
          <el-button
            :icon="FolderAdd"
            class="newFolder"
            style="font-size: 18px"
          >
            <div class="characters">新建文件夹</div>
          </el-button>
        </div>
        <div class="tops-les" v-show="isChecked">
          <el-button
            :icon="Edit"
            class="edit"
            style="font-size: 18px"
            type="primary"
            size="small"
          >
            <div class="characters">编辑</div>
          </el-button>
          <el-button
            :icon="Share"
            class="share"
            style="font-size: 18px"
            type="primary"
            size="small"
          >
            <div class="characters">分享</div>
          </el-button>
          <el-button
            :icon="DeleteFilled"
            class="delete"
            style="font-size: 18px"
            type="primary"
            size="small"
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
          />
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
            >
            </el-button>
            <el-button
              :icon="ArrowRightBold"
              class="advance"
              style="font-size: 18px"
            >
            </el-button>
            <el-button :icon="Refresh" class="refresh" style="font-size: 18px">
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
                v-model="isChecked"
              />
              文件名
            </div>
            <div class="file-size">文件大小</div>
            <div class="update-time">时间</div>
          </div>
          <div class="file-center">
            <ul>
              <li class="file-center-li">
                <div class="file-center-name">
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    class="whole"
                    v-model="isChecked"
                  />
                  <img src="../assets/img.png" alt="" class="file-icon" />
                  <div class="file-name">20220618全片改bug.mp4</div>
                </div>
                <div class="file-center-size">6.52M</div>
                <div ref="el_image" class="file-center-time">
                  2023-09-03 23:35:57
                </div>
                <el-image
                  class="image-box"
                  @close="opens"
                  :src="url"
                  :zoom-rate="1.2"
                  :preview-src-list="srcList"
                  :initial-index="1"
                  fit="cover"
                />
              </li>

              <li class="file-center-li">
                <div class="file-center-name">
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    class="whole"
                    v-model="isChecked"
                  />
                  <img src="../assets/img.png" alt="" class="file-icon" />
                  <div class="file-name">20220618全片改bug.mp4</div>
                </div>
                <div class="file-center-size">6.52M</div>
                <div ref="el_image" class="file-center-time">
                  2023-09-03 23:35:57
                </div>
                <el-image
                  class="image-box"
                  @close="opens"
                  :src="url"
                  :zoom-rate="1.2"
                  :preview-src-list="srcList"
                  :initial-index="1"
                  fit="cover"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";
import { ref, onMounted } from "vue";

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
import { fi } from "element-plus/es/locale";

export default defineComponent({
  name: "DetailsPage",
  props: {
    msg: String,
  },
  setup() {
    const imgSrc = ref("");
    const imgUrl = ref("");
    onMounted(async () => {
      try {
        const response = await axios.get('http://192.168.37.77:8520/preview_file', {
          params: {
            path: "FbIcZkBVsAIEeUr.png",
          },
        });        

        let img = `data:image/png;base64,${response.data.image}`;
        srcList.push(img);
        for(let i = 0;i<srcList.length;i++){
          if (srcList[i] === ''){
            srcList.splice(i,1);
            i--;
          }
        }


      } catch (error) {
        console.error(error);
      }
    });

    

    const isChecked = ref(false);
    const input = ref("");
    const imageOpacity = ref(0); // 定义opacity的响应式属性

    const opens = () => {
      console.log("图片预览退出页面了");
      imageOpacity.value = 1; // 更改opacity的值为0
    };


    // let img = `data:image/png;base64,${base64}`;

    const url =
      "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg";
    const srcList = [''];

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
      imageOpacity,
      opens,
      url,
      srcList,
      isChecked,

      imgSrc,
      imgUrl,
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

    .tops-les {
      display: flex;

      .edit {
        width: 80px;
        height: 30px;
        background-color: #447be4;
        text-align: center;
        line-height: 30px;
        border-radius: 10px;
        color: white;
        margin-left: 50px;
        display: flex;
      }

      .share {
        width: 80px;
        height: 30px;
        background-color: #447be4;
        text-align: center;
        line-height: 30px;
        border-radius: 10px;
        color: white;
        margin-left: 50px;
        display: flex;
      }

      .delete {
        width: 80px;
        height: 30px;
        background-color: #447be4;
        text-align: center;
        line-height: 30px;
        border-radius: 10px;
        color: white;
        margin-left: 50px;
        display: flex;
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
            margin-left: 40px;
            margin-right: 40px;
            color: #929292;
            text-align: left;
            font-size: 13px;
            // background-color: pink;

            .image-box {
              position: absolute;
              top: 0;
              left: 40px;
              bottom: 0;
              right: 0;
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
                height: 40px;
                margin-left: 10px;
              }

              .file-name {
                margin-left: 20px;
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
</style>
