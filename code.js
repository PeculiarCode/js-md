function deepClone(obj, hash = new WeakMap()) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj)
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj)
  }

  // 处理循环引用
  if (hash.has(obj)) {
    return hash.get(obj)
  }

  let clone = new obj.constructor()

  //存储当前对象,防止循环引用
  hash.set(obj, clone)

  // 复制 Symbol 属性
  let symKeys = Object.getOwnPropertySymbols(obj)
  if (symKeys.length > 0) {
    symKeys.forEach(symKey => {
      clone[key] = deepClone(obj[symKey], hash)
    })
  }

  //复制普通属性
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], hash)
    }
  }
  return clone
}
function numAdd(num, target) {
  const map = new Map()
  for (let i = 0; i < num.length; i++) {
    const tarNum = target - num[i]
    if (map.has(tarNum)) {
      return map.get(tarNum, i)
    } else {
      map.set(tarNum, i)
    }
  }
}
