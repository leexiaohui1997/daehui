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
}
