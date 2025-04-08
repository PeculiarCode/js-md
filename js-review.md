# 复习方案，下面是 js 的重点大纲

## 数据类型相关：

## 对象深拷贝与浅拷贝，单独问了 Object.assign

### 浅拷贝

- 浅拷贝只复制对象第一层属性
- 如果属性是引用类型,则复用的是引用
- Object.assign() 展开运算符... Array.prototype.slice()

### 深拷贝

- 修改拷贝对象的值不影响原来的对象的值

### 模拟实现一个对象的深拷贝

```js
/* 
  *** 扩展
  1. 不能处理函数,Symbol,undefined
  2. 会丢失对象的 constructor (为什么会丢失JSON方法)
  3. 不能处理循环引用 (什么是循环引用,为什么WeakMap可以解决)
  4. js中垃圾回收机制
*/
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

### 什么是变量提升

- 使用 var 声明的变量或 function 声明的函数会出现变量提升
- js 执行代码分两个阶段 创建阶段和执行阶段
- 创建变量对象 => 建立作用域链 => 确定 this 指向
- 扫描函数 => 扫描变量 => 处理参数
- js 引擎从上往下依次执行

### == 和 === 的区别是什么

- == 是宽泛比较 比较值
- === 严格相等 数据类型和值都比较
- NaN 和任何值都不想等 包括自己 NaN == NaN => false

### _JS_ 的基本数据类型有哪些？基本数据类型和引用数据类型的区别

- 基础类型 String Number Boolean BigInt Symbol Undefined Null
- 引用类型 Object RegExp Date Array Function
- 基础存储在栈内存中 直接访问 比较实际的值 创建独立副本 本身值不变
- 引用存储在堆内存中 引用访问 比较引用地址 复制引用地址 对象可以被修改

### 引用类型有哪些，有什么特点
- Object RegExp Date Array Function Map Set WeakMap WeakSet


### == 隐试转换的原理？是怎么转换的

### 对变量进行类型判断的方式有哪些

### _typeof null_ 返回结果

### _undefined==null_ 返回的结果是什么？_undefined_ 与 _null_ 的区别在哪？

## 原型原型链

### 原型与原型链

### 说说 _instanceof_ 原理，并回答下面的题目

### _typeof_ 与 _instanceof_ 的区别？ _instanceof_ 是如何实现？

### 对一个构造函数实例化后. 它的原型链指向什么

### prototype 和 _**proto**_ 区别是什么？

## 作用域闭包等

### 作用域与作用域链

### 什么是作用域链、原型链

### JS 的作用域类型

### _let const var_ 的区别？什么是块级作用域？如何用？

### _call、apply、bind_ 的区别 ？

}### 什么是 _js_ 的闭包？有什么作用？

### *JS*的垃圾回收站机制

### _this_ 的指向哪几种 ？

## 异步和单线程 promise 相关

### 为什么会出现 _setTimeout_ 倒计时误差？如何减少

### 事件循环机制（宏任务、微任务）

### _promise.all_ 方法的使用场景？数组中必须每一项都是 _promise_ 对象吗？不是 _promise_ 对象会如何处理 ？

### _async_ 与 _await_ 的作用

### _Promise_

#### <font style="color:rgb(5, 7, 59);background-color:rgb(253, 253, 254);">Promise 的基本原理</font>

<font style="color:rgb(5, 7, 59);background-color:rgb(253, 253, 254);">异步链式调用的实现</font>

#### <font style="color:rgb(5, 7, 59);background-color:rgb(253, 253, 254);">异步链式调用的优点</font>

### _js_ 的异步处理函数

### 简述同步和异步的区别

### _defer_ 与 _async_ 的区别

### _promise_ 的其他方法有用过吗？如 _all、race_。请说下这两者的区别

### _setTimeout、Promise、Async/Await_ 的区别（字节）

### 实现一个 _sleep_ 函数（字节）

test()### _Promise_ 和 _setTimeout_ 的区别 ?

### 如何实现 _Promise.all_ ?

}### 如何实现 Promise.finally ?

### Promise 构造函数是同步还是异步执行，then 呢 ? Promise 如何实现 then 处理 ?

### v8 执行原理

### 谈谈你对 _JS_ 执行上下文栈

### <font style="color:rgb(5, 7, 59);background-color:rgb(253, 253, 254);">对 Generator 的理解</font>

## 其他

### 箭头函数有哪些特点

### _new_ 操作符都做了哪些事？

### 你了解 _node_ 中的事件循环机制吗？_node11_ 版本以后有什么改变

### 什么是函数柯里化？

### 说说严格模式的限制

### 事件委托以及冒泡原理

### 箭头函数与普通函数的区别 ？

### _ES6_ 新增哪些东西？让你自己说（美团 19 年）

### _weakmap、weakset_（美团 _19_ 年）

### 防抖和节流？

### proxy 是实现代理，可以改变 js 底层的实现方式, 然后说了一下和 Object.defineProperty 的区别

### [Object.is](http://Object.is) 方法比较的是什么

### _ES6_ 中模块化导入和导出与 _common.js_ 有什么区别

### 了解过 js 中 arguments 吗？接收的是实参还是形参？

### 纯函数

### _JS_ 模块化

### 为什么普通 _for_ 循环的性能远远高于 _forEach_ 的性能，请解释其中的原因。

### js 继承

#### <font style="color:rgb(5, 7, 59);background-color:rgb(253, 253, 254);">1. 原型链继承</font>

#### <font style="color:rgb(5, 7, 59);background-color:rgb(253, 253, 254);">2. 组合式继承</font>

#### <font style="color:rgb(5, 7, 59);background-color:rgb(253, 253, 254);">3. Class 继承（ES6+）</font>

### Reflect 的理解

### for…in、for…of 和 forEach 有什么区别

### 数组合并的方法

### js 数组去重

### 数组扁平化处理

### **<font style="color:rgb(0, 0, 0);">说一下从输入 URL 到页面加载完中间发生了什么？</font>**

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>
