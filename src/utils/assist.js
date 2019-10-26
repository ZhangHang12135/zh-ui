/**
 * @description 判断value 是否存在于list中
 * @param {any} value
 * @param {Array} list
 */
export const oneOf = (value, list = []) => {
  let len = list.length
  for (let index = 0; index < len; index++) {
    const element = list[index]
    if (element === value) {
      return true
    };
  }
  return false
}
