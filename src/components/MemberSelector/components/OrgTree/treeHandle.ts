const isComplexType = (obj) =>
  (typeof obj === 'object' || typeof obj === 'function') && obj !== null

// 深拷贝
export const deepClone = function (obj, hash = new Map()) {
  if (obj.constructor === Date) {
    return new Date(obj)
  }
  if (obj.constructor === RegExp) return new RegExp(obj)

  if (hash.has(obj)) return hash.get(obj)
  let allDesc = Object.getOwnPropertyDescriptors(obj)

  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)
  hash.set(obj, cloneObj)
  for (let key of Reflect.ownKeys(obj)) {
    cloneObj[key] =
      isComplexType(obj[key]) && typeof obj[key] !== 'function'
        ? deepClone(obj[key], hash)
        : obj[key]
  }
  return cloneObj
}

// tree拍平
const TreeToArray = () => {}

// 找到节点
export const findNode = (node, treeData, key = 'key') => {
  for (let i = 0; i < treeData.length; i++) {
    if (treeData[i][key] === node[key]) {
      return treeData[i]
    } else {
      if (treeData[i].children) {
        let res = findNode(node, treeData[i].children, key)
        if (res) {
          return res
        }
      }
    }
  }
}
/**
 * //记录音色
 * @param currentNode 节点
 * @param isContainChildren 是否修改 子孙n+1节点
 * @param childrenChecked 记录父子节点映射
 * @param editField 修改字段
 * @param nodeId id字段
 */
export const editNodes = ({
  currentNode,
  isContainChildren = true,
  editField,
  childrenChecked,
  nodeId = 'key',
  isDel = false
}) => {
  const { key, value } = editField
  const id = currentNode[nodeId]
  if (currentNode.children) {
    currentNode.children = currentNode.children?.map((el) => {
      if (isDel) {
        // 取消虚拟节点
        if (childrenChecked[id]) {
          delete childrenChecked[id]
        }
      } else {
        // 记录子节点虚拟选中
        if (childrenChecked[id]) {
          childrenChecked[id].push(el)
        } else {
          childrenChecked[id] = [el]
        }
      }
      el[key] = value
      if (isContainChildren && el.children) {
        return editNodes({
          currentNode: el,
          isContainChildren,
          editField,
          childrenChecked,
          nodeId,
          isDel
        })
      } else {
        return el
      }
    })
  }
  return currentNode
}

export const editTreeNode = ({
  node,
  treeData,
  editField,
  childrenChecked,
  isDel = false
}: any) => {
  let key = 'key'
  // 找到节点，对节点及其子孙节点进行编辑，copy出子孙节点
  if (Array.isArray(node)) {
    node.forEach((el) => {
      let currentNode = findNode(el, treeData, key)
      // 修改子孙节点的 disable属性，同时copy所有的子孙节点
      currentNode = editNodes({
        currentNode,
        editField,
        childrenChecked,
        isDel
      })
    })
  } else {
    let currentNode = findNode(node, treeData, key)
    // 修改子孙节点的 disable属性，同时copy所有的子孙节点
    currentNode = editNodes({
      currentNode,
      editField,
      childrenChecked,
      isDel
    })
  }
}

export const editTreeNodeFields = ({ treeData, el, editField, nodeId }: any) => {
  const { key, value } = editField
  let currentNode = findNode(el, treeData, nodeId)
  function editChildren(el) {
    el?.forEach((v: any) => {
      v[key] = value
      if (v.children?.length > 0) {
        editChildren(v.children)
      }
    })
  }
  currentNode.children?.length && editChildren(currentNode.children)
}
