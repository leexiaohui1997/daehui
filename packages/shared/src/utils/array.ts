/**
 * 深度查找数组中的第一个符合条件的元素
 * @param arr - 要查找的数组
 * @param fn - 用于测试每个元素的函数
 * @returns 符合条件的第一个元素，或 undefined 如果未找到
 */
export function deepFind<T extends { children?: T[] }>(
  arr: T[],
  fn: (item: T) => boolean,
): T | undefined {
  for (const item of arr) {
    if (fn(item)) {
      return item
    }
    if (item.children) {
      const found = deepFind(item.children, fn)
      if (found) {
        return found
      }
    }
  }
  return undefined
}
