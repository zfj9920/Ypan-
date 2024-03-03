/*
 * @Author: maple_jy
 * @Date: 2023-09-08 21:15:50
 */
// 上传文件
import axios from "axios";
import { getDownload } from "../api/api";

const token = localStorage.getItem("token") || sessionStorage.getItem("token");

// 异步处理下载文件方法
    async function downloadFiles(filePaths: any) {
      try {
        for (let i = 0; i < filePaths.length; i++) {
          const response = await getDownload(filePaths[i], token);

          let name = filePaths[i].split("/");
          const blob = new Blob([response.data]);
          const downloadUrl = URL.createObjectURL(blob);
          const fileName = name[name.length-1];

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

export { downloadFiles }; 