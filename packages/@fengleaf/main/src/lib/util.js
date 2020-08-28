export function deepClone (obj) {
  const result = Array.isArray(obj) ? [] : {}
  // 进行深拷贝的不能为空，并且是对象或者是
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === 'object') {
          result[key] = deepClone(obj[key])
        } else {
          result[key] = obj[key]
        }
      }
    }
  }
  return result
}
