function deepClone(obj, hash = new WeakMap()) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  // 处理循环引用
  if (hash.has(obj)) {
    return hash.get(obj)
  }

  let clone = new obj.constructor()
  //存储当前对象,防止循环引用
  hash.set(obj, clone)

  //复制普通属性
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], hash)
    }
  }
  return clone
}

function deepClone1(obj, hash = new WeakMap()) {
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }

  if (hash.has(obj)) {
    return hash.get(obj)
  }

  const clone = Array.isArray(obj) ? [] : {}
  hash.set(obj, clone)
  for (const key in obj) {
    clone[key] = deepClone(obj[key], hash)
  }
}

// [1] instance

function myExample(obj, constructor) {
  const prototype = constructor.prototype
  let objProto = Object.getPrototypeOf(obj)
  while (objProto != null) {
    if (objProto === prototype) {
      return true
    }
    objProto = Object.getPrototypeOf(objProto)
  }
  return false
}

function myInstance(obj, constructor) {
  //获取构造函数原型
  const prototype = constructor.prototype
  //获取对象原型
  let objProto = Object.getPrototypeOf(obj)
  //沿着原型链向上查找
  while (objProto != null) {
    if (objProto === prototype) {
      return true
    }
    objProto = Object.getPrototypeOf(objProto)
  }

  return false
}

function myNew(constructor, ...args) {
  //创建一个对象 将原型链指向构造函数protytype
  const obj = Object.create(constructor.prototype)
  // 调用构造函数 将this绑定到新对象
  const result = constructor.call(obj, args)
  return result instanceof Object ? result : obj
}

// ;(function () {
//   let privateVarjs = 'I am private'
//   // 你的代码在这里
//   console.log(privateVarjs)
// })()

const obj = {
  name: 'Alice',
  greet: function () {
    console.log(`Hello, ${this.name}`)
  }
}

// obj.greet() // 输出 "Hello, Alice" - this 指向 obj

// async function fn1() {
//   console.log(1)
//   await Promise.resolve().then(() => console.log(2))
//   console.log(3)
// }
// fn1()
// Promise.resolve().then(() => console.log(4))
// console.log(5)

// console.log('Start')
// setTimeout(() => console.log('Timeout'), 0)
// Promise.resolve().then(() => console.log('Promise'))
// async function asyncFunc() {
//   console.log('Async function start')
//   await Promise.resolve()
//   console.log('Async function end')
// }
// asyncFunc()
// console.log('End')

// start -> Async function start  -> End -> Promise -> Async function end -> Timeout

//3s之后要洗澡
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 使用方式（需要在 async 函数中）
async function demo() {
  console.log('开始')
  await sleep(2000) // 暂停2秒
  console.log('2秒后')
}
// demo()

function timeout(url, time) {
  const fetchUrl = fetch(url)
  const timeoutFetch = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('任务超时')), time)
  })
  return Promise.race(fetchUrl, timeoutFetch)
}

// Promise.all 接收一个 Promise 数组，返回一个新的 Promise， 当所有 Promise 都成功时才会 resolve，只要有一个失败就会 reject
Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'))
    }

    let results = []
    let completed = 0
    const total = promises.length

    if (total === 0) {
      return resolve(results)
    }
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value
          completed++
          if (completed === total) {
            resolve(results)
          }
        })
        .catch(reject)
    })
  })
}

Promise.myFinally = function (callback) {
  return this.then(
    value => Promise.resolve(callback()).then(() => value),
    reason =>
      Promise.resolve(callback()).then(() => {
        throw reason
      })
  )
}

class MyPromise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        this.onFulfilledCallbacks.forEach(fn => fn())
      }
    }

    const reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.value = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          // 模拟微任务
          try {
            const x = onFulfilled(this.value)
            resolve(x)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.value)
            resolve(x)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolve(x)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.value)
              resolve(x)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })

    return promise2
  }
}

function Parent() {
  this.name = 'parent'
}
Parent.prototype.sayName = function () {
  console.log(this.name)
}
const parent = new Parent()

function Child() {}
Child.prototype = new Parent()
const child = new Child()
child.sayName() // 'parent'
