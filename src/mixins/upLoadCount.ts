/*
 * @Author: maple_jy
 * @Date: 2023-09-07 15:52:32
 */
const upLoadCount = (c:Array<number> ) => {
  // 更新当前传输的文件数量
  return c.reduce((i: number, value: number) => {
    if (value < 100) {
      return i + 1;
    } else {
      return i;
    }
  }, 0);

}

export {upLoadCount}