function MySort(arr, type) {
  // type===1:从小到大排序   type===0:从大到小排序
  let newArr = []

  arr.forEach((item, i) => {
    if (newArr.length === 0) {
      newArr.push(item)
    }
    if (type === 1) {
      if (newArr[0].timestamp > item.timestamp) {
        newArr.unshift(item)
      }
    }

    if (type === 0) {
      if (newArr[0].timestamp < item.timestamp) {
        newArr.unshift(item)
      }
    }
  })
  arr.forEach
}

function MySort(array) {
  checkArray(array)
  for (let i = array.length - 1; i > 0; i--) {
    // 从 0 到 `length - 1` 遍历
    for (let j = 0; j < i; j++) {
      if (array[j].timestamp > array[j + 1].timestamp) swap(array, j, j + 1)
    }
  }
  return array
}

function checkArray(array) {
  if (!Array.isArray(array)) {
    return
  }
}
function swap(array, left, right) {
  let rightValue = Object.assign(array[right])
  array[right] = Object.assign(array[left])
  array[left] = Object.assign(rightValue)
}

var re = /(?<=uin\=o).*(?=\;+)/i

function buildLocationTree(list, parentId = 0) {
  if (list.length === 1) {
    return list[0]
  }
  let obj = {}
  list.forEach(item => {
    if (item.pid === parentId || item.id === parentId) {
      obj.name = item.name
      obj.id = item.id
      if (item.pid) {
        obj.pid = item.pid
      }
      let nextList = list.shift()
      let nextParentId = item.pid || 0
      obj.subLocations = buildLocationTree(nextList, nextParentId)
    }
  })
  return obj
}

function buildLocationTree(list, parentId = 0) {
  let newTree = []
  list.forEach(item => {
    if (item.pid == parentId || item.id === 0) {
      let obj = {}
      obj.name = item.name
      obj.id = item.id
      obj.pid = parentId
      obj.subLocations = buildLocationTree(list, item.id)
      newTree.push(obj)
    }
  })
  return newTree
}
