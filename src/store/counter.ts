/*
 * @Author: maple_jy
 * @Date: 2023-09-02 15:32:07
 */
import { defineStore } from "pinia";

// 定义公共数据模块
export const useCounterStore: any = defineStore("count", {
  state() {
    const cnname = "Ypan云盘";
    const enname = "SULA CLOUD DISK";
    const iconType = {
      excel: ["xlsx", "xlsm", "xlsb", "xltx", "xltm", "xls", "xml"],
      txt: ["txt"],
      ppt: ["ppt", "pptx", "potx", "pot"],
      music: ["ogg", "mp3", "wav"],
      video: ["mp4", "webm", "ogg", "mov", "m2v"],
      img: ["png","jpg","jpeg","jfif","pjpeg","pjp","bmp","ico","cur","tif","tiff","webp","svg","gif","apng","avif"],
      word:["doc", "docx", "docm","dot","dotx","dotm"],
      zip:["rar","zip","7z"],
      file:["pdf","xmind"]
    };

    const isUpload = false;

    return {
      cnname,
      enname,
      iconType,
      isUpload,
    };
  },

  actions:{
    upLoad_value (){
      this.isUpload = !this.isUpload;
    }
  }

});
