import {
  ApiCode,
  ApiError,
  ConditionParsedResult,
  OperateEnum,
  parseCondition,
} from '@daehui/shared'
import {
  And,
  Between,
  Equal,
  FindOptionsWhere,
  In,
  IsNull,
  Like,
  Not,
  ObjectLiteral,
  Or,
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
  [OperateEnum.Exist]: () => And(Not(IsNull()), Not('')),
  [OperateEnum.NotExist]: () => Or(IsNull(), Equal('')),
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
   * 解析条件解析结果数组为 TypeORM where 对象
   * @param results 条件解析结果数组
   * @returns FindOptionsWhere<T>
   */
  static parseResult<T extends ObjectLiteral>(
    results: ConditionParsedResult[],
  ): FindOptionsWhere<T> {
    const parts = results.map(({ field, operate, values }) => {
      if (!OperateMap[operate]) {
        throw new ApiError(ApiCode.PARAM_ERROR, '错误的操作符')
      }
      return { [field]: OperateMap[operate](...values) }
    })
    return Object.assign({}, ...parts)
  }

  /**
   * 解析单个条件字符串并合并到 where 对象中
   * @param condition 单个条件字符串
   * @returns FindOptionsWhere<T>
   */
  private static parseCondition<T extends ObjectLiteral>(
    condition: string,
  ): FindOptionsWhere<T> {
    const parsedResult = parseCondition(condition)
    return this.parseResult<T>(parsedResult)
  }
}
