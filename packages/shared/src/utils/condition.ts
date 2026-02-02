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
