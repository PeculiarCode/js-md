# 复习方案，下面是 js 的重点大纲

### 浅拷贝

- 浅拷贝只复制对象第一层属性
- 如果属性是引用类型,则复用的是引用
- Object.assign() 展开运算符... Array.prototype.slice()

- 修改拷贝对象的值不影响原来的对象的值

### 模拟实现一个对象的深拷贝

```js
/* 
  *** 扩展
  1. 不能处理函数,Symbol,undefined
  2. 会丢失对象的 constructor (JSON方法)
  3. 不能处理循环引用 (什么是循环引用,为什么WeakMap可以解决)
  4. js中垃圾回收机制
*/

//面试
function deepClone(obj, hash = new WeakMap()) {
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

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

// 简易版
function deepClone(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  let clone = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key])
    }
  }
  return clone
}

// 处理边界情况
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
```

### 什么是变量提升(js 执行上下文)

- 创建变量对象(变量提升) => 建立作用域链 => 确定 this 指向
- 扫描函数 => 扫描变量 => 处理参数
- js 引擎从上往下依次执行 作用域链从下往上

### == 和 === 的区别是什么

- == 是宽泛比较 比较值
- === 严格相等 数据类型和值都比较
- NaN 和任何值都不想等 包括自己 NaN == NaN => false

### _JS_ 的基本数据类型有哪些？基本数据类型和引用数据类型的区别

- 基础类型 String Number Boolean BigInt Symbol Undefined Null
- 引用类型 Object RegExp Date Array Function
- 基础存储在栈内存中 直接访问 比较实际的值 创建独立副本 本身值不变
- 引用存储在堆内存中 引用访问 比较引用地址 复制引用地址 对象可以被修改

### 对变量进行类型判断的方式有哪些

- 基本类型 typeof
- 引用类型 instanceof
- Object.prototype.toString.call()
- Array.isArray()

  1. instanceof 的原理(模拟内部实现)

  ```js
  // [1,2,3] instanceof Array
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
  ```

  2. new 操作符做了哪些事情

  ```js
  function myNew(constructor, ...args) {
    //创建一个对象 将原型链指向构造函数protytype
    const obj = Object.create(constructor.prototype)
    // 调用构造函数 将this绑定到新对象
    const result = constructor.call(obj, args)
    return result instanceof Object ? result : obj
  }
  ```

### 对一个构造函数实例化后. 它的原型链指向什么

```js
function Person() {}

const person = new Person()
```

person (实例)
│
├── **proto** → Person.prototype
│ │
│ ├── constructor → Person (构造函数)
│ │
│ └── **proto** → Object.prototype
│ │
│ ├── constructor → Object
│ │
│ └── **proto** → null

### prototype 和 _**proto**_ 区别是什么？

1. prototype 是函数的属性，决定它创建的实例的原型
2. **proto**是对象的属性，指向它的原型（形成原型链）
3. 两者通过 new 操作符建立联系：instance.**proto** === Constructor.prototype

### JS 作用域 闭包 作用域链 作用域类型 等

### 作用域

1. 全局(window)
2. 局部

- 函数作用域
- 块级作用域
- 模块作用域

### 闭包

**概念**

- 内部函数能访问外部函数的变量
- 外部函数的变量不会被垃圾回收

**作用**

- 数据私有化和封装
- 函数工厂
- 回调函数和事件处理

### 作用域链

**概念**

- js 引擎查找变量沿着当前作用域链查找,没找到向上作用域查找,直到全局作用域

**工作原理**

1. 每个函数都有一个 scope 属性,保存被创建时的作用域链
2. 函数调用,会创建一个新的执行环境
3. 执行环境会复制函数 scope 属性来创建作用域链
4. 然后创建一个活动对象,推入作用域前端

### _call、apply、bind_ 的区别 ？

**call**

```js
/*
  1. 立即执行函数
  2. 第一个参数 this 指向
  3. 后续参数是函数接收的参数列表
*/
function greet(name, age) {
  console.log(`Hello, ${name}. You are ${age} years old. I'm ${this.title}`)
}
const person = { title: 'Mr' }
greet.call(person, 'John', 30)
// 输出: Hello, John. You are 30 years old. I'm Mr
```

**apply**

```js
/*
  1. 立即执行函数
  2. 第一个参数 this 指向
  3. 后续参数是函数接收的参数数组
*/
function greet(name, age) {
  console.log(`Hello, ${name}. You are ${age} years old. I'm ${this.title}`)
}
const person = { title: 'Mr' }
greet.apply(person, ['Jane', 28])
// 输出: Hello, Jane. You are 28 years old. I'm Mrs
```

**bind**

```js
/* 
  1. 不立即执行 返回一个新的函数 新函数可以稍后调用
  2. 第一个参数this指向
  3. 徐虎参数可选参数
*/
function greet(name, age) {
  console.log(`Hello, ${name}. You are ${age} years old. I'm ${this.title}`)
}

const person = { title: 'Dr' }
const greetPerson = greet.bind(person, 'Mike')

greetPerson(45)
// 输出: Hello, Mike. You are 45 years old. I'm Dr
```

### _this_ 的指向哪几种 ？

**默认绑定 window global undefined**

**隐式绑定 方法调用**

**显示绑定 apply call bind**

**构造函数**
当使用 new 关键字调用构造函数 this 指向构造函数实例

```js
function Person(name) {
  this.name = name
}
const person = new Person('Alice')
console.log(person.name) // Alice
```

**箭头函数**

- 箭头函数没有自己的 this 会捕获上下文的 this

```js
const obj = {
  name: 'Dave',
  regularFunc: function () {
    console.log(this.name) // Dave
  },
  arrowFunc: () => {
    console.log(this.name) // undefined (或全局对象的name)
  }
}

obj.regularFunc() // Dave
obj.arrowFunc() // undefined (箭头函数this指向外层作用域)
```

**dom 事件 this**

**定时器回调的 this**

**特殊情况**

### *JS*的垃圾回收站机制

- 引用计数 (无法处理循环引用)
- 标记清除

**V8 引擎的垃圾回收优化**

- 分代收集(新生代和老生代)
- 增量标记(将标记分成多个小步骤,避免长时间停顿)
- 空闲时间收集

**内存泄漏造成的原因**

1. 意外全局变量
2. 闭包使用不当
3. 未清理定时器和回调
4. dom 引用未移除

### 为什么会出现 _setTimeout_ 倒计时误差？如何减少

**产生原因**

1. js 单线程 setTimeout 回调需等待当前栈全部执行完才执行,前面有耗时任务会延时执行
2. 系统最小时间间隔限制 浏览器最小延迟时间
3. 事件循环机制 setTimeout 是宏任务 需要等待微任务执行完
4. 设备性能差异 不同设备的计算能力会影响定时器精度
5. 标签页休眠 当页面处于后台 浏览器会降低定时器评率节省资源

**减少精度方法**

```js
//1. 使用高精度的时间戳补偿
let startTime = Date.now()
let count = 0
let total = 10000 // 10秒倒计时
function run() {
  count++
  // 计算已过去的时间
  let offset = Date.now() - (startTime + count * 1000)
  let nextTime = 1000 - offset
  if (nextTime < 0) nextTime = 0
  if (count * 1000 < total) {
    setTimeout(run, nextTime)
  }
  console.log(`误差: ${offset}ms, 下一次执行间隔: ${nextTime}ms`)
}

setTimeout(run, 1000)

// 2.使用 Web Worker
// main.js
const worker = new Worker('timer-worker.js')
worker.postMessage({ command: 'start', duration: 10000 })

// timer-worker.js
self.onmessage = function (e) {
  if (e.data.command === 'start') {
    const endTime = Date.now() + e.data.duration
    const interval = setInterval(() => {
      const remaining = endTime - Date.now()
      if (remaining <= 0) {
        clearInterval(interval)
        self.postMessage({ done: true })
      } else {
        self.postMessage({ remaining })
      }
    }, 100)
  }
}

// 3. 使用 requestAnimationFrame
function countdown(duration, callback) {
  let start = performance.now()
  function frame(time) {
    let elapsed = time - start
    let remaining = duration - elapsed

    if (remaining > 0) {
      callback(remaining)
      requestAnimationFrame(frame)
    } else {
      callback(0)
    }
  }
  requestAnimationFrame(frame)
}

// 4.  使用 Web Audio API 计时器
const audioContext = new (window.AudioContext || window.webkitAudioContext)()
let startTime
function preciseTimer(callback, interval) {
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()
  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.onended = () => callback()
  oscillator.start(0)
  oscillator.stop(audioContext.currentTime + interval / 1000)
  startTime = audioContext.currentTime
}
```

**最佳实践建议**

- 对于短时间倒计时：使用 requestAnimationFrame + 时间戳补偿
- 对于长时间倒计时：使用 Web Worker + 服务器时间同步
- 对于需要极高精度的场景：考虑 Web Audio API
- 定期同步服务器时间：避免客户端本地时间被修改

### 事件循环机制（宏任务、微任务）

### _promise.all_ 方法的使用场景？数组中必须每一项都是 _promise_ 对象吗？不是 _promise_ 对象会如何处理 ？

**使用场景**

1. 并行执行多个异步操作：当你有多个不相互依赖的异步操作需要同时执行时
2. 等待所有异步操作完成：需要所有操作都成功完成才能继续执行后续代码
3. 聚合多个异步结果：需要收集所有异步操作的结果一起处理

**常见用例包括**

1. 同时发起多个 API 请求
2. 并行读取多个文件
3. 同时执行多个数据库查询

**对非 Promise 对象的处理**
_Promise.all 的数组中不必须每一项都是 Promise 对象。当数组包含非 Promise 值时_

1. 非 Promise 值会被自动转换为已解决的 Promise，其解决值就是该值本身
2. 这些值会直接出现在结果数组中，就像它们是被 Promise.resolve() 包装过一样

```js
const p1 = Promise.resolve(3)
const p2 = 42 // 非Promise值
const p3 = new Promise(resolve => {
  setTimeout(resolve, 100, 'foo')
})

Promise.all([p1, p2, p3]).then(values => {
  console.log(values) // 输出: [3, 42, "foo"]
})
```

**注意事项**

1. 快速失败机制：如果数组中任何一个 Promise 被拒绝，Promise.all 会立即拒绝，并返回第一个拒绝的原因
2. 全部成功才成功：只有所有 Promise 都成功解决，Promise.all 才会解决
3. 顺序保留：结果数组中值的顺序与输入数组中的顺序一致，而不是按完成顺序排列

### _async_ 与 _await_ 的作用

async 和 await 是 JavaScript 中处理异步操作的语法糖，它们基于 Promise，但让异步代码的编写和阅读更加直观，类似于同步代码

**async 的作用**

1. 标记异步函数：async 关键字用于声明一个函数是异步的
2. 自动包装返回值：async 函数总是返回一个 Promise 对象
   - 如果返回非 Promise 值，会自动用 Promise.resolve() 包装
   - 如果抛出异常，会返回被拒绝的 Promise

```js
async function foo() {
  return 42 // 等价于 return Promise.resolve(42)
}
```

**await 的作用**

1. 暂停执行：await 可以暂停 async 函数的执行
2. 等待 Promise 完成：等待右侧的 Promise 完成（resolved 或 rejected）
   - 如果是非 Promise 值，会自动用 Promise.resolve() 包装
3. 获取结果：返回 Promise 的值

```js
async function bar() {
  const result = await somePromise // 等待somePromise解决
  console.log(result) // 使用解决后的值
}
```

#### Promise 的基本异步链式调用的优点原理 异步链式调用的实现

**Promise 异步链式调用的优点**

1. 解决回调地狱：通过链式调用替代嵌套回调，使代码更清晰易读
2. 错误处理集中化：可以使用一个 .catch() 处理整个链中的错误
3. 顺序执行保证：.then() 会按照顺序执行，确保异步操作的顺序性
4. 值传递方便：前一个 .then() 的返回值会自动传递给下一个 .then()
5. Promise 状态一旦改变就不会再变，保证可靠性

**Promise 链式调用的原理**

1. 每个.then() 或.catch() 都会返回一个新的 Promise 对象
2. 值穿透：如果.then() 的参数不是函数，值会直接传递给下一个 .then()
3. 状态传递：新 Promise 的状态由回调函数的执行结果决定

### 简述同步和异步的区别

特性 ---------同步---------- 异步
执行方式 顺序执行，阻塞后续代码 非阻塞，后续代码立即执行
性能影响 可能导致界面冻结 不会阻塞主线程
代码复杂度 简单直观 相对复杂（回调/Promise/await）
适用场景 即时计算、简单操作 网络请求、文件 I/O、定时操作
错误处理 直接使用 try-catch 需要回调参数或.catch()处理
返回值获取 直接获取返回值 通过回调或 Promise 获取结果

### _defer_ 与 _async_ 的区别

|:特性: |:无属性:| :async: |:defer:|
|阻塞 HTML 解析 |是 |否|否|
|脚本执行时机 |立即 |下载完成后立即 |HTML |
|执行顺序保证 |文档顺序| 下载完成的顺序 |文档顺序|
|DOM 就绪状态|可能未完成 |可能未完成| 已完成|
|典型使用场景| 必要脚本 |独立第三方脚本 |需要 DOM 的脚本|

HTML 解析开始
│
├─ 无属性脚本 → 暂停解析 → 下载执行 → 继续解析
│
├─ async 脚本 → 异步下载 → (下载完成) → 立即执行
│
├─ defer 脚本 → 异步下载 → (HTML 解析完成) → 按顺序执行
│
HTML 解析结束

### _promise_ 的其他方法有用过吗？如 _all、race_ 请说下这两者的区别

**Promise.all 基本特性**

1. 并行执行：接收一个 Promise 数组，并行执行所有 Promise
2. 全成功才成功：只有当所有 Promise 都成功时才返回成功
3. 快速失败：如果有一个 Promise 失败，立即 reject

**使用场景**

- 需要等待多个异步操作全部完成
- 多个无依赖关系的请求需要同时发起
- 需要收集多个异步操作的结果

**Promise.race 基本特性**

1. 竞速机制：接收一个 Promise 数组，返回最先 settled 的 Promise
2. 不论成功失败：第一个完成的 Promise 是成功就成功，失败就失败
3. 短路特性：其他 Promise 的结果会被忽略

**使用场景**

- 设置请求超时
- 从多个数据源获取数据，只需要最快返回的结果
- 竞态条件处理

### _setTimeout、Promise、Async/Await_ 的区别（字节）

- setTimeout 是一个异步回调函数 用于延时操作
- Promise 是一个异步结果的操作(成功或失败)
- async 返回 Promise 对象 await 相当于.then()后的操作

### 实现一个 _sleep_ 函数（字节）

```js
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 使用方式（需要在 async 函数中）
async function demo() {
  console.log('开始')
  await sleep(2000) // 暂停2秒
  console.log('2秒后')
}
```

### 如何实现 Promise.all,Promise.finally

```js
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
```

### Promise 构造函数是同步还是异步执行，then 呢 ? Promise 如何实现 then 处理 ?

**then 函数特点**

1. 状态管理 Promise 有三种状态(pending,fulfilled,rejected).then 方法会根据当前状态做回调处理
2. 回调注册 当 Promise 处于 pending 状态 then 会将回调函数存储起来 当状态变为 fulfilled 或 rejected 会调用相应回调
3. 链式调用 then 方法会返回新的 Promise
4. 异步执行 回调函数会放入微任务队列 确保他们在当前执行栈清空在执行

```js
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
```

### v8 执行原理

1. 解析
   - 词法分析 将源代码分解为 tokens
   - 语法分析 根据语法规则构建 ast
2. 编译
   - 解释器
     - 将 ast 转化为字节码
     - 快速启动执行 效率较低
   - 优化编译器
     - 监控热点代码
     - 将热点代码编译为优化后的机器码
     - 使用内敛缓存等优化技术
3. 执行优化
   - 隐藏类 动态创建对象描述结构 加速属性访问
   - 内联缓存 缓存方法调用和属性访问结果
   - 逃逸分析 确定对象是否在函数外使用 决定栈分配还是堆分配
4. 垃圾回收
   - 新生代 使用复制算法
   - 老生代 标记清除和压缩算法
   - 增量标记 减少停顿时间
5. 事件循环

### 谈谈你对 _JS_ 执行上下文栈

**概念**

- 执行上下文是一个后进先出的数据结构 用于存储和管理执行的上下文
- 当 js 执行代码 会创建一个全局的执行上下文压入栈中
- 每当函数被调用 就会为函数创建一个新的执行上下文压入栈顶
- 函数执行完毕 执行上下文从栈中弹出

**生命周期**

1. 创建阶段
   - 创建变量 建立作用域链 确定 this 指向
2. 执行阶段
   - 变量赋值 函数引用 执行代码
3. 销毁阶段
   - 函数执行完从栈中弹出 等待垃圾回收

### 对 Generator 的理解

在执行过程可以恢复和暂停 处理异步操作 创建迭代器 处理大数据集合

```js
function* generatorExample() {
  yield '第一次暂停'
  yield '第二次暂停'
  return '结束'
}
```

**主要特点**

1. 暂停与恢复：生成器可以在执行过程中暂停（通过 yield），并在需要时恢复执行
2. 迭代器协议：生成器实现了迭代器接口，可以使用 for...of 循环
3. 双向通信：可以通过 yield 接收值，也可以通过 next() 方法传入值

**实际应用场景**

1. 异步流程控制：配合 Promise 实现类似 async/await 的效果
2. 惰性求值：只在需要时生成值，节省内存
3. 无限序列：可以表示无限长的序列（如斐波那契数列）
4. 状态机：用生成器实现复杂的状态管理

### 箭头函数有哪些特点 箭头函数与普通函数的区别

1. 语法简洁
2. 没有自己的 this
3. 没有自己的 arguments 对象,可以访问外层函数的 arguments 对象
4. 不能用作构造函数
5. 不能作为生成器函数
6. 没有 super 和 new.target

### 你了解 _node_ 中的事件循环机制吗？_node11_ 版本以后有什么改变

### 什么是函数柯里化？

**概念**
柯里化将一个接受多个参数的函数，转换成一系列使用一个参数的函数

```js
// 原始函数
function add(a, b, c) {
  return a + b + c
}

// 柯里化后的函数
function curriedAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c
    }
  }
}

// 使用方式
add(1, 2, 3) // 6
curriedAdd(1)(2)(3) // 6
```

**柯里化的特点**

1. 参数的分步传递：可以分步传递参数，在参数未完全传递时返回中间函数
2. 延迟执行：直到所有参数都传递完毕才执行原函数
3. 函数组合：便于函数组合和复用

### 说说严格模式的限制

1. 变量必须声明
2. 禁止删除不可删除的属性
3. 函数参数名必须唯一
4. 禁止使用 with 语句
5. 禁止 this 指向全局变量
6. 禁止 8 进制字面量
7. 限制对 arguments 的操作
8. 禁止 eval 和 arguments 作为变量名称
9. 限制 eval 作用域
10. 禁止 arguments.callee 和 arguments.caller
11. 保留关键字限制
12. 禁止函数声明在非函数块中

### 事件委托以及冒泡原理

**事件冒泡**

1. 捕获阶段（从 window 对象向下传播到目标元素）
2. 目标阶段（事件到达目标元素）
3. 冒泡阶段（从目标元素向上传播回 window 对象）

**事件委托**

事件委托是一种利用事件冒泡机制的技术，它将事件处理程序绑定到一个父元素上，而不是直接绑定到多个子元素上

1. 减少内存消耗（只需一个处理程序）
2. 动态添加的子元素无需额外绑定事件
3. 代码更简洁

### _ES6_ 新增哪些东西？让你自己说（美团 19

1. 变量声明
2. 箭头函数
3. 模板字符串
4. 解构赋值
5. 默认参数
6. 扩展运算符
7. 剩余参数
8. class
9. 模块化
10. Promise
11. Map Set WeakMap WeakSet
12. 迭代器 生成器
13. Symbol
14. Proxy Reflect

### _weakmap、weakset_（美团 _19_ 年）

**WeakMap 弱映射**

1. 键必须是对象（不能是原始值）
2. 键是弱引用：如果键对象没有其他引用，它会被 GC 回收，对应的值也会被清除
3. 不可遍历（没有 keys()、values()、entries() 等方法）
4. 常见方法：set()、get()、has()、delete()

**优势**

1. 外部无法访问私有变量
2. 对象销毁时,私有数据自动消除,避免内存泄漏
3. 存储 dom 节关联数据 避免手动清理
4. 缓存计算结果 允许对象被 GC 回收

**WeakSet 弱集合**

1. 成员必须是对象（不能是原始值）
2. 成员是弱引用：如果对象没有其他引用，会被 GC 自动回收
3. 不可遍历（没有 forEach()、size 等）
4. 常见方法：add()、has()、delete()

**优势**

1. 检测循环引用
2. 标记已处理的 dom 节点
3. 临时注册表

### 防抖和节流？

**防抖**

- 在事件触发后 等待一段时间在执行 如果这段时间再触发 重新计时

**应用场景**

- 输入框搜索
- 窗口大小调整

```js
function debounce(fn, delay) {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}

// 使用示例
const input = document.getElementById('search')
input.addEventListener(
  'input',
  debounce(function () {
    console.log('发送搜索请求:', this.value)
  }, 500)
)
```

**节流**

- 在一定时间间隔内 只执行一次回调函数

**应用场景**

- 滚动事件
- 鼠标移动事件

```js
function throttle(fn, delay) {
  let lastTime = 0
  return function () {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, arguments)
      lastTime = now
    }
  }
}

// 使用示例
window.addEventListener(
  'scroll',
  throttle(function () {
    console.log('处理滚动事件')
  }, 200)
)
```

### proxy 是实现代理，可以改变 js 底层的实现方式, 然后说了一下和 Object.defineProperty 的区别

**区别**

1. 拦截能力不同
   - proxy 拦截能力更强(get,set,delete,函数调用)
   - defineProperty(get,set)
2. 对数组的处理
   - proxy 可以检测数组索引和 length 变化
3. 性能方面 Proxy 更强
4. 初始时机
   - proxy 对象拦截
   - defineProperty 是属性拦截
5. 兼容性
   - proxy 是 ES6 属性 无法被 polyfill
   - Object.defineProperty 在 ES5 中就已存在，兼容性更好

### [Object.is](http://Object.is) 方法比较的是什么

- Object.is 提供了一种比 === 更严格的比较方式，特别适用于处理 NaN 和 ±0 的边缘情况

### _ES6_ 中模块化导入和导出与 _common.js_ 有什么区别

1. 语法差异

**ES6**
import export

**CommonJS**

module.exports require

2. 加载方式

**ES6**

- 静态加载(编译时加载)
- 导出导出语句必须在模块顶层,不能动态导入
- 支持静态分析 (tree shaking)

**CommonJS**

- 动态加载(运行时加载)
- require 可以在代码任何地方调用
- 不支持静态分析

3. 值绑定

**ES6**

- 导出是值的引用
- 导入的值只读
- 如果导出模块中的值发生变化 导入模块这个值也会变化

**CommonJS**

- 导出是值的拷贝
- 导入的值可以修改
- 如果导出模块中的值发生变化 导入模块这个值不受印象

4. 执行时机

**ES6**

- 预解析阶段确定依赖关系
- 模块代码只执行一次,结果被缓存

**CommonJS**

- 每次 require 都会执行
- 导入的值可以修改
- 结果会被缓存 后续 require 返回缓存结果

5. 浏览器支持

**ES6**

需要添加 type="module"属性：<script type="module" src="..."></script>

**CommonJS**

览器中需要打包工具（如 Webpack、Browserify）转换缓存结果

### 了解过 js 中 arguments 吗？接收的是实参还是形参？

**接收的是实参**
arguments 对象包含的是实际传递给函数的参数（实参），而不是函数定义时声明的参数（形参）
**类数组对象**
arguments 是一个类数组对象，它有 length 属性和索引访问，但不是真正的数组，没有数组的方法（如 forEach,map)
**与形参的关系**
在非严格模式下，arguments 和形参是同步的（修改一个会影响另一个）
在严格模式下，这种同步关系不存在

### 纯函数

**特点**

1. 相同的输入总是返回相同的输出（确定性）
2. 不产生副作用（不会改变外部状态或与外部交互）

**优点**

1. 可预测性：相同的输入总是得到相同的输出
2. 可测试性：不需要复杂的设置或模拟
3. 可缓存性：可以记忆化(Memoization)函数调用
4. 并行安全：可以在多线程环境中安全运行
5. 引用透明：函数调用可以被其返回值替换而不影响程序行为

### _JS_ 模块化

**优势**

1. 代码组织：将代码分割为逻辑单元
2. 作用域隔离：避免全局变量污染
3. 依赖管理：明确声明和解析依赖关系
4. 可重用性：模块可以在不同项目中复用
5. 可维护性：便于团队协作和代码维护

**实践**

1. 尽量使用 ES6 模块语法
2. 一个文件只做一个模块
3. 避免循环依赖
4. 合理使用默认导出和命名导出
5. 在浏览器中使用 <script type="module"></script>

### 为什么普通 _for_ 循环的性能远远高于 _forEach_ 的性能，请解释其中的原因

1. 调用开销（Call Overhead）
   for 循环：是 JavaScript 的底层控制结构，直接由引擎解释执行，无需额外的函数调用
   forEach：是一个高阶函数，每次迭代都需要调用一次传入的回调函数。函数调用涉及堆栈操作、作用域创建等开销，尤其在处理大量数据时累积的调用成本显著
2. 引擎优化
   for 循环：更容易被 JavaScript 引擎（如 V8）优化
   循环展开 减少条件判断次数
   内联缓存 快速访问数组元素
   类型推断 避免动态类型检查
   forEach: 由于回调函数的动态性（可能被重写或包含副作用），引擎难以做激进优化
3. 数组访问方式
   for 循环: 直接通过索引访问数组元素（如 arr[i]），通常被优化为连续内存访问
   forEach: 内部需要通过函数参数传递元素，可能增加一层间接访问的开销
4. 提前终止的灵活性
   for 循环：可以通过 break 或 return 提前终止，减少不必要的迭代。
   forEach：无法中断，必须完整遍历整个数组（即使使用 try-catch 模拟中断也会带来额外成本）
5. 内存与上下文开销
   forEach：需要为每次迭代维护回调函数的执行上下文（包括 this、参数等），而 for 循环的上下文是固定的

### Reflect 的理解

**优势**

1. 更一致的 API：统一了原本分散的操作（如 in、delete 等操作符）
2. 更好的错误处理：方法返回布尔值而不是抛出错误（如 defineProperty）
3. 函数式风格：更适合函数式编程范式
4. 与 Proxy 完美配合：每个 Proxy 陷阱都有对应的 Reflect 方法

### for…in、for…of 和 forEach 有什么区别

1. 遍历数组：优先使用 for...of 或 forEach
2. 遍历对象属性：使用 for...in (配合 hasOwnProperty 检查)
3. 需要中断循环时：使用 for...of 或传统 for 循环

### 数组合并的方法 数组去重 数组扁平化处理

### js 继承

1. 原型链继承

```js
function Parent() {
  this.name = 'parent'
}

Parent.prototype.sayName = function () {
  console.log(this.name)
}

const parent = new Parent()

function Child() {}
Child.prototype = parent
const child = new Child()
child.sayName() // 'parent'
```

**优点**

- 简单易实现
- 父类新增原型方法/属性，子类都能访问到

**缺点**

- 所有子类实例共享父类实例属性，修改一个会影响其他
- 创建子类实例时，无法向父类构造函

2. 构造函数继承

```js
function Parent(name) {
  this.name = name
}

function Child(name) {
  Parent.call(this, name)
}

const child = new Child('child')
console.log(child.name) // 'child'
```

**优点**

- 解决了原型链继承中共享引用属性的问题
- 可以在子类构造函数中向父类构造函数传参

**缺点**

- 方法都在构造函数中定义，每次创建实例都会创建一遍方法
- 不能继承父类原型上的属性和方法

3. 组合式继承

```js
function Parent(name) {
  this.name = name
}
Parent.prototype.sayName = function () {
  console.log(this.name)
}

function Child(name, age) {
  Parent.call(this, name) // 第二次调用Parent
  this.age = age
}
Child.prototype = new Parent() // 第一次调用Parent
Child.prototype.constructor = Child

const child = new Child('child', 10)
child.sayName() // 'child'
```

**优点**

- 融合了原型链继承和构造函数继承的优点
- 可以继承父类原型上的属性和方法
- 每个实例有自己的属性

**缺点**

- 调用了两次父类构造函数，子类原型上会有多余的父类实例属性

4. 寄生式继承

```js
function createAnother(original) {
  const clone = Object.create(original)
  clone.sayHi = function () {
    console.log('hi')
  }
  return clone
}

const parent = {
  name: 'parent'
}

const child = createAnother(parent)
child.sayHi() // 'hi'
```

**优点**

- 可以在不自定义类型的情况下为对象添加函数

**缺点**

- 函数难以复用，类似于构造函数模式

5. 寄生组合式继承

```js
function inheritPrototype(child, parent) {
  const prototype = Object.create(parent.prototype)
  prototype.constructor = child
  child.prototype = prototype
}

function Parent(name) {
  this.name = name
}
Parent.prototype.sayName = function () {
  console.log(this.name)
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

inheritPrototype(Child, Parent)

const child = new Child('child', 10)
child.sayName() // 'child'
```

**优点**

只调用一次父类构造函数
避免了在子类原型上创建不必要的属性
原型链保持不变
目前最理想的继承方式

**缺点**
实现相对复杂

6. Class 继承

```js
class Parent {
  constructor(name) {
    this.name = name
  }
  sayName() {
    console.log(this.name)
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name)
    this.age = age
  }
}

const child = new Child('child', 10)
child.sayName() // 'child'
```

**优点**
语法简洁，易于理解
内置的 super 关键字可以方便调用父类方法
是 JavaScript

**缺点**

某些旧浏览器可能需要 Babel 等工具转译

### **说一下从输入 URL 到页面加载完中间发生了什么？**
