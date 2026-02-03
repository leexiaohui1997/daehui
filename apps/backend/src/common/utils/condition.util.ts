import { ApiCode, ApiError, OperateEnum } from '@daehui/shared'
import {
  Between,
  FindOptionsWhere,
  In,
  IsNull,
  Like,
  Not,
  ObjectLiteral,
} from 'typeorm'

export type OperateFunc = (...values: string[]) => unknown

export const OperateMap: Record<OperateEnum, OperateFunc> = {
  [OperateEnum.Equal]: (...values: string[]) =>
    values.length > 1 ? In(values) : values[0],
  [OperateEnum.NotEqual]: (...values: string[]) =>
    values.length > 1 ? Not(In(values)) : Not(values[0]),
  [OperateEnum.Like]: (value: string) => Like(`%${value}%`),
  [OperateEnum.LikeLeft]: (value: string) => Like(`${value}%`),
  [OperateEnum.LikeRight]: (value: string) => Like(`%${value}`),
  [OperateEnum.In]: (...values: string[]) => In(values),
  [OperateEnum.NotIn]: (...values: string[]) => Not(In(values)),
  [OperateEnum.Range]: (from: string, to: string) => Between(from, to),
  [OperateEnum.Exist]: () => Not(IsNull()),
  [OperateEnum.NotExist]: () => IsNull(),
}

/**
 * 查询条件工具类
 */
export class ConditionUtils {
  /**
   * 解析条件字符串数组为 TypeORM where 对象
   * @param conditions 条件字符串数组
   * @returns FindOptionsWhere<T>[]
   */
  static parse<T extends ObjectLiteral>(
    conditions: string[] = [],
  ): FindOptionsWhere<T>[] {
    return conditions.map(condition => this.parseCondition(condition))
  }

  /**
   * 解析单个条件字符串并合并到 where 对象中
   * @param condition 单个条件字符串
   * @returns FindOptionsWhere<T>
   */
  private static parseCondition<T extends ObjectLiteral>(
    condition: string,
  ): FindOptionsWhere<T> {
    const conditionParts = condition.split('&').filter(Boolean)
    const parts = conditionParts
      .map(part => {
        const [field, ...valueStrs] = part.split('=')
        const valueStr = valueStrs.join('=')
        if (!valueStr) return
        const [, , op = OperateEnum.Equal, value = ''] =
          valueStr.match(/^(\[([^[\]]+)\])?([^[\]]*)$/) || []

        const values = value.split('|')

        if (!OperateMap[op]) {
          throw new ApiError(ApiCode.PARAM_ERROR, '错误的操作符')
        }

        return { [field]: OperateMap[op](...values) }
      })
      .filter(Boolean)

    return Object.assign({}, ...parts)
  }

  /**
   * 转换查询条件（用于处理关联字段查询）
   * @param conditions 条件列表
   * @param key 目标字段键名
   * @param callback 获取 ID 列表的回调函数
   * @returns 修改后的条件列表，如果返回 false 表示结果为空
   */
  static async transformCondition(
    conditions: string[] = [],
    key: string,
    callback: (values: string[], idConditions: string[]) => Promise<number[]>,
  ): Promise<string[] | false> {
    const targetCondition = conditions.find(
      c => c.startsWith(`${key}=`) || c.startsWith(`${key}[`),
    )

    if (!targetCondition) return conditions

    // 解析值，去除 key= 或 key[op]= 部分
    const [, ...valueParts] = targetCondition.split('=')
    const valueStr = valueParts.join('=')

    // 去除可能存在的操作符 [in] 等
    const cleanValue = valueStr.replace(/^\[[a-zA-Z]+\]/, '')
    const values = cleanValue.split('|')

    // 查找所有 id 相关的条件
    const idConditions = conditions.filter(
      c => c.startsWith('id=') || c.startsWith('id['),
    )

    const ids = await callback(values, idConditions)

    if (ids.length === 0) return false

    // 移除旧条件和 id 条件
    const newConditions = conditions.filter(
      c => c !== targetCondition && !idConditions.includes(c),
    )

    // 添加新条件
    newConditions.push(`id[in]=${ids.join('|')}`)

    return newConditions
  }
}
