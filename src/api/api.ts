//封装请求方法

import axios from "axios";

axios.defaults.baseURL = "http://192.168.37.77:8520";

// 测试使用
// axios.defaults.baseURL = "http://192.168.43.238:8520";

//搜索关键字
export const search = (params: any, token: String | null) => {
  return axios.post("search_files", null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      path: "",
      keyword: params,
    },
  });
};

//删除
export const deletes = (pa: any, token: String | null) => {
  return axios.post(
    "delete",
    {
      paths: pa,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
//回收站删除文件
export const recycleDeletes = (pa: any, token: String | null) => {
  return axios.post(
    "delete_from_recycle_bin",
    {
      paths: pa,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
//回收站恢复文件
export const returnFiles = (pa: any, token: String | null) => {
  return axios.post(
    "restore",
    {
      paths: pa,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

//进入目录的
export const enters = function (v: any, token: String | null): Promise<any> {
  return axios({
    method: "get",
    url: `/`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      cmd: "list",
      path: v,
    },
  });
};

export const getUsedSpace = function (token: String | null): Promise<any> {
  return axios({
    method: "get",
    url: `/user_folder_size`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 新建文件夹
export const createFolder = function (
  token: any,
  path: String,
  name: String
): Promise<any> {
  return axios.post("/create_folder", null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      path: path,
      folder_name: name,
    },
  });
};

//降序
export const descendingOrder = function (token: String | null): Promise<any> {
  return axios({
    method: "get",
    url: `/`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      cmd: "list",
      sort: "dir_name_down",
    },
  });
};

//升序
export const ascendingOrder = function (token: String | null): Promise<any> {
  return axios({
    method: "get",
    url: `/`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      cmd: "list",
      sort: "dir_name_up",
    },
  });
};

//删除回收站指定文件
export const removeFile = function (
  path: String,
  token: String | null
): Promise<any> {
  return axios({
    method: "post",
    url: `/delete_from_recycle_bin`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      path: path,
    },
  });
};

//图片预览
export const picturePreview = function (
  v: String,
  token: String | null
): Promise<any> {
  return axios({
    method: "get",
    url: `/preview_file/`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      path: v,
    },
  });
};

// 下载
export const getDownload = (
  v: String[],
  token: string | null
): Promise<any> => {
  return axios.get("/download/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },

    params: {
      path: v,
    },

    // @ts-ignore
    responseType: "arraybuffer",
  });
};
