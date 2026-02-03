export enum OperateEnum {
  Equal = 'EQ',
  NotEqual = 'NOT',
  Like = 'LIKE',
  LikeLeft = 'LIKE_LEFT',
  LikeRight = 'LIKE_RIGHT',
  In = 'IN',
  NotIn = 'NIN',
  Range = 'RANGE',
  Exist = 'EXIST',
  NotExist = 'NOT_EXIST',
}

export const OPERATE_ICON_MAP: Record<OperateEnum, string> = {
  [OperateEnum.Like]: 'icon-operator_like',
  [OperateEnum.LikeLeft]: 'icon-operator_startwith',
  [OperateEnum.LikeRight]: 'icon-operator_endwith',
  [OperateEnum.Equal]: 'icon-operator_equal',
  [OperateEnum.NotEqual]: 'icon-operator_notequal',
  [OperateEnum.In]: 'icon-operator_contain',
  [OperateEnum.NotIn]: 'icon-operator_exclude',
  [OperateEnum.Range]: 'icon-operator_range',
  [OperateEnum.Exist]: 'icon-operator_is_empty',
  [OperateEnum.NotExist]: 'icon-operator_not_empty',
}

export const OPERATE_LABEL_MAP: Record<OperateEnum, string> = {
  [OperateEnum.Equal]: '等于',
  [OperateEnum.NotEqual]: '不等于',
  [OperateEnum.Like]: '类似',
  [OperateEnum.LikeLeft]: '开头等于',
  [OperateEnum.LikeRight]: '结尾等于',
  [OperateEnum.In]: '包含',
  [OperateEnum.NotIn]: '不包含',
  [OperateEnum.Range]: '范围',
  [OperateEnum.Exist]: '为空',
  [OperateEnum.NotExist]: '非空',
}

export const EMPTY_VALUE_OPERATES: OperateEnum[] = [
  OperateEnum.Exist,
  OperateEnum.NotExist,
]

export type ConditionParsedResult = {
  field: string
  operate: OperateEnum
  values: string[]
}

/**
 * 解析条件字符串为条件解析结果数组
 * @param condition 条件字符串，例如："field=[EQ]value1|value2&field2=[LIKE]value3"
 * @returns 条件解析结果数组
 */
export function parseCondition(condition: string): ConditionParsedResult[] {
  const conditionParts = condition.split('&').filter(Boolean)
  return conditionParts
    .map(part => {
      const [field, ...valueStrs] = part.split('=')
      const valueStr = valueStrs.join('=')
      if (!valueStr) return
      const [, , op = OperateEnum.Equal, value = ''] =
        valueStr.match(/^(\[([^[\]]+)\])?([^[\]]*)$/) || []

      const values = value.split('|')

      return {
        field,
        operate: op as OperateEnum,
        values,
      }
    })
    .filter(Boolean) as ConditionParsedResult[]
}

/**
 * 将条件解析结果数组拼接为条件字符串
 * @param parts 条件解析结果数组
 * @returns 条件字符串
 */
export function joinCondition(parts: ConditionParsedResult[]) {
  return parts
    .map(({ field, operate, values }) => {
      return `${field}=[${operate}]${values.join('|')}`
    })
    .join('&')
}
