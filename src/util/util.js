import { validatenull } from './validate'
import moment from 'moment'
/**
 * 给试题富文本加行内样式
 * @param {string} html
 */
export const addLine = (content) => {
  const P_TAG = '&lt;p'
  const inlineStyle = ' style="display: inline"'
  const startTag = content.slice(0, 5)
  const setLineHTML = `${startTag}${inlineStyle}${content.slice(5)}`
  const targetHTML = startTag === P_TAG ? setLineHTML : content
  const HTML = _.unescape(targetHTML)
  return HTML
}
/**
 * 计算两个时间差经历的时间的文字描述
 * @param {*} timestamp - 毫秒
 */
export const timeCalculate = (start, end) => {
  const label = ['分钟', '小时', '天', '月', '年']
  const unit = [60, 60, 24, 30, 12]
  let restTime = Math.floor((end - start) / 1000)
  let res = ''
  for (let i = 0, len = unit.length; i < len; i++) {
    const pos = len - i // 从年开始算，分钟换算成年 === Math.pow(60, 4)
    const temp = unit.slice(0, pos).reduce((p, c) => p * c, 1)
    const time = Math.floor(restTime / temp)
    time > 0 && (res += time + label[pos - 1])
    restTime -= time * temp
  }
  return res
}
/**
 * 金额转中文
 * 思路：
 * 个 十   百   千   万
 *    十万 百万 千万 亿
 *    十亿 百亿 千亿
 * 1  2    3    4    5
 *    6    7    8    9
 *    10
 *
 */
export function getAmountChinese(val) {
  const amount = +val
  if (Number.isNaN(amount) || amount < 0) return ''
  const NUMBER = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const N_UNIT1 = ['', '拾', '佰', '仟']
  const N_UNIT2 = ['', '万', '亿']
  const D_UNIT = ['角', '分']
  let [integer, decimal] = amount.toFixed(2).split('.')
  if (integer && integer.length > 12) return '金额过大无法计算'
  let res = ''
  // 整数部分
  if (integer) {
    for (let i = 0, len = integer.length; i < len; i++) {
      const num = integer.charAt(i)
      const pos = len - i - 1 // -1 排除个位干扰
      if (i === len - 1 && num === '0') break
      res += NUMBER[num] + N_UNIT1[pos % 4]
      if (pos % 4 === 0) {
        // 排除个位数后 万和亿位置都是4的倍数
        res += N_UNIT2[Math.floor(pos / 4)]
      }
    }
  }
  res += '圆'
  if (decimal) {
    // 小数部分
    for (let i = 0; i < 2; i++) {
      const num = decimal.charAt(i)
      num !== '0' && (res += NUMBER[num] + D_UNIT[i])
    }
  }
  return res
}
/**
 * 去除字符串中所有的html标签
 * @param {string} html
 */
export const deleteHTMLTag = (html = '') => {
  return html.replace(/<[^>]+>/g, '')
}
/**
 * 反转义
 */
export const htmlDecode = (text) => {
  //1.首先动态创建一个容器标签元素，如DIV
  var temp = document.createElement('div')
  //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
  temp.innerHTML = text
  //3.最后返回这个元素的innerText或者textContent，即得到经过HTML解码的字符串了。
  var output = temp.innerText || temp.textContent
  temp = null
  return output
}
/**
 * 转义
 */
export const htmlEncode = (html) => {
  //1.首先动态创建一个容器标签元素，如DIV
  var temp = document.createElement('div')
  //2.然后将要转换的字符串设置为这个元素的innerText或者textContent
  temp.textContent != undefined ? (temp.textContent = html) : (temp.innerText = html)
  //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
  var output = temp.innerHTML
  temp = null
  return output
}
//表单序列化
export const serialize = (data) => {
  let list = []
  Object.keys(data).forEach((ele) => {
    list.push(`${ele}=${data[ele]}`)
  })
  return list.join('&')
}
export const getObjType = (obj) => {
  var toString = Object.prototype.toString
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}
export const getViewDom = () => {
  return window.document.getElementById('avue-view').getElementsByClassName('el-scrollbar__wrap')[0]
}
/**
 * 对象深拷贝
 */
export const deepClone = (data) => {
  var type = getObjType(data)
  var obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    //不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}
/**
 * 设置灰度模式
 */
export const toggleGrayMode = (status) => {
  if (status) {
    document.body.className = document.body.className + ' grayMode'
  } else {
    document.body.className = document.body.className.replace(' grayMode', '')
  }
}
/**
 * 设置主题
 */
export const setTheme = (name) => {
  document.body.className = name
}

/**
 * 加密处理
 */
export const encryption = (params) => {
  let { data, type, param, key } = params
  let result = JSON.parse(JSON.stringify(data))
  if (type == 'Base64') {
    param.forEach((ele) => {
      result[ele] = btoa(result[ele])
    })
  } else if (type == 'Aes') {
    param.forEach((ele) => {
      result[ele] = window.CryptoJS.AES.encrypt(result[ele], key).toString()
    })
  }
  return result
}

/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
  if (fullscreenEnable()) {
    exitFullScreen()
  } else {
    reqFullScreen()
  }
}
/**
 * esc监听全屏
 */
export const listenfullscreen = (callback) => {
  function listen() {
    callback()
  }
  document.addEventListener('fullscreenchange', function() {
    listen()
  })
  document.addEventListener('mozfullscreenchange', function() {
    listen()
  })
  document.addEventListener('webkitfullscreenchange', function() {
    listen()
  })
  document.addEventListener('msfullscreenchange', function() {
    listen()
  })
}
/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
  var isFullscreen =
    document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
  return isFullscreen
}

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen()
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen()
  }
}
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen()
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen()
  }
}
/**
 * 递归寻找子类的父类
 */

export const findParent = (menu, id) => {
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].children.length != 0) {
      for (let j = 0; j < menu[i].children.length; j++) {
        if (menu[i].children[j].id == id) {
          return menu[i]
        } else {
          if (menu[i].children[j].children.length != 0) {
            return findParent(menu[i].children[j].children, id)
          }
        }
      }
    }
  }
}
/**
 * 原地递归过滤节点
 * @param {Node[]} nodes 要过滤的节点
 * @param {node => boolean} predicate 过滤条件，符合条件的节点保留
 * @return 过滤后的节点
 */
export const filterTree = (nodes, predicate, shouldUp = false) => {
  // 如果已经没有节点了，结束递归
  if (!(nodes && nodes.length)) {
    return []
  }

  const newChildren = []
  for (const node of nodes) {
    if (predicate(node)) {
      // 如果节点符合条件，直接加入新的节点集
      newChildren.push(node)
      node.children = filterTree(node.children, predicate, shouldUp)
    } else if (shouldUp) {
      // 如果当前节点不符合条件，递归过滤子节点，
      // 把符合条件的子节点提升上来，并入新节点集
      newChildren.push(...filterTree(node.children, predicate, shouldUp))
    }
  }
  return newChildren
}
/**
 * 查找所有符合条件的节点
 * @param {Node[]} nodes 要查找的节点
 * @param {node => boolean} predicate 查找条件
 * @return {Array} 符合条件的所有节点数组
 **/
export const findTreeNodes = (nodes = [], predicate, result = []) => {
  nodes.forEach((node) => {
    if (predicate(node)) {
      result.push(node)
    }
    if (node.children) {
      findTreeNodes(node.children, predicate, result)
    }
  })
  return result
}
/**
 * 原地排序树节点
 * @param {*} nodes
 * @param {*} compareFunction 比较函数
 */
export const sortTree = (nodes, compareFunction) => {
  nodes.sort(compareFunction)
  nodes.forEach((node) => {
    if (node.children && node.children.length > 0) {
      sortTree(node.children, compareFunction)
    }
  })
}
/**
 * 树结构转一维数组
 */
export const flatTree = (tree, res = []) => {
  tree.forEach((node) => {
    const copy = deepClone(node)
    delete copy.children
    res.push(copy)
    if (node.children && node.children.length > 0) {
      flatTree(node.children, res)
    }
  })
  return res
}
/**
 * 判断2个对象属性和值是否相等
 */

/**
 * 动态插入css
 */

export const loadStyle = (url) => {
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = url
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(link)
}
/**
 * 判断路由是否相等
 */
export const diff = (obj1, obj2) => {
  delete obj1.close
  var o1 = obj1 instanceof Object
  var o2 = obj2 instanceof Object
  if (!o1 || !o2) {
    /*  判断不是对象  */
    return obj1 === obj2
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
    //Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  }

  for (var attr in obj1) {
    var t1 = obj1[attr] instanceof Object
    var t2 = obj2[attr] instanceof Object
    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr])
    } else if (obj1[attr] !== obj2[attr]) {
      return false
    }
  }
  return true
}
/**
 * 根据字典的value显示label
 */
export const findByvalue = (dic, value) => {
  let result = ''
  if (validatenull(dic)) return value
  if (typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean') {
    let index = 0
    index = findArray(dic, value)
    if (index != -1) {
      result = dic[index].label
    } else {
      result = value
    }
  } else if (value instanceof Array) {
    result = []
    let index = 0
    value.forEach((ele) => {
      index = findArray(dic, ele)
      if (index != -1) {
        result.push(dic[index].label)
      } else {
        result.push(value)
      }
    })
    result = result.toString()
  }
  return result
}
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
  for (let i = 0; i < dic.length; i++) {
    if (dic[i].value == value) {
      return i
    }
  }
  return -1
}
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = ''
  random = Math.ceil(Math.random() * 100000000000000)
    .toString()
    .substr(0, len ? len : 4)
  if (date) random = random + Date.now()
  return random
}
/**
 * 打开小窗口
 */
export const openWindow = (url, title, w, h) => {
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height

  const left = width / 2 - w / 2 + dualScreenLeft
  const top = height / 2 - h / 2 + dualScreenTop
  const newWindow = window.open(
    url,
    title,
    // eslint-disable-next-line max-len
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' +
      w +
      ', height=' +
      h +
      ', top=' +
      top +
      ', left=' +
      left
  )

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
}

/**
 * 判断两个日期时间段是否有交集
 */
export const judgeRepeatedTime = (section1, section2) => {
  let section1Start = new Date(section1[0]).getTime()
  let section1End = new Date(section1[1]).getTime()
  let section2Start = new Date(section2[0]).getTime()
  let section2End = new Date(section2[1]).getTime()
  if (section2Start < section1End && section1Start < section2End) {
    return true
  } else {
    return false
  }
}

/**
 * 判断多个日期时间段是否有交集
 */
export const compareDate = (beginArr = [], overArr = []) => {
  beginArr.forEach((item, index) => {
    beginArr[index] = moment(item).valueOf()
  })
  overArr.forEach((item, index) => {
    overArr[index] = moment(item).valueOf()
  })
  beginArr = beginArr.sort()
  overArr = overArr.sort()
  for (let i = 1; i < beginArr.length; i++) {
    if (beginArr[i] <= overArr[i - 1]) {
      return false
    }
  }
  return true
}

/**
 * 生成唯一自增id
 */
export const createUniqueID = (() => {
  var i = 0
  return function() {
    return i++
  }
})()

/**
 * 对象的属性进行重命名
 * @param {object} obj 对象
 * @param {string|string[]} keys 要重命名的键
 * @param {string|string[]} names 重命名的名称数组
 * @returns {object} 不修改原对象，返回一个新的对象
 */
export const renameKey = (target, keys, names) => {
  const cloned = _.omit(target, keys)
  _.isArray(keys)
    ? _.each(keys, (key, i) => (cloned[names[i]] = target[key]))
    : (cloned[names] = target[keys])
  return cloned
}

export const numberToChinese = (num) => {
  if (!/^\d*(\.\d*)?$/.test(num)) {
    alert('Number is wrong!')
    return 'Number is wrong!'
  }
  var AA = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九')
  var BB = new Array('', '十', '百', '千', '万', '亿', '点', '')
  var a = ('' + num).replace(/(^0*)/g, '').split('.'),
    k = 0,
    re = ''
  for (let i = a[0].length - 1; i >= 0; i--) {
    switch (k) {
      case 0:
        re = BB[7] + re
        break
      case 4:
        if (!new RegExp('0{4}\\d{' + (a[0].length - i - 1) + '}$').test(a[0])) re = BB[4] + re
        break
      case 8:
        re = BB[5] + re
        BB[7] = BB[5]
        k = 0
        break
    }
    if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re
    if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re
    k++
  }
  if (a.length > 1) {
    //加上小数部分(如果有小数部分)
    re += BB[6]
    for (let i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)]
  }
  return re
}
/**
 * 判断此对象是否是Object类型
 * @param {Object} obj
 */
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
/**
 * 判断此类型是否是Array类型
 * @param {Array} arr
 */
function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}
/**
 *  深度比较两个对象是否相同
 * @param {Object} oldData
 * @param {Object} newData
 */
export const equalsObj = (oldData, newData) => {
  // 类型为基本类型时,如果相同,则返回true
  if (oldData == newData) return true
  if (
    isObject(oldData) &&
    isObject(newData) &&
    Object.keys(oldData).length == Object.keys(newData).length
  ) {
    // 类型为对象并且元素个数相同

    // 遍历所有对象中所有属性,判断元素是否相同
    for (var key in oldData) {
      if (oldData.hasOwnProperty(key)) {
        if (!equalsObj(oldData[key], newData[key]))
          // 对象中具有不相同属性 返回false
          return false
      }
    }
  } else if (isArray(oldData) && isArray(newData) && oldData.length == newData.length) {
    // 类型为数组并且数组长度相同

    for (var i = 0, length = oldData.length; i < length; i++) {
      if (!equalsObj(oldData[i], newData[i]))
        if (isObject(oldData)) {
          equalsObj(oldData[i], newData[i])
        } else {
          return false
        }
      // 如果数组元素中具有不相同元素,返回false
    }
  } else {
    // 其它类型,均返回false
    return false
  }

  // 走到这里,说明数组或者对象中所有元素都相同,返回true
  return true
}
