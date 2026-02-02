import { TableColumnData, TableData } from '@arco-design/web-vue'
import { OperateEnum } from '@daehui/shared'
import dayjs from 'dayjs'

export enum ColumnFormatType {
  Date = 4,
  DateTime = 5,
}

export type FormatFunc = (value: unknown) => string

export type Column<T> = TableColumnData & {
  // 表格属性
  dataIndex: keyof T & string
  // 自定义属性
  formatType?: ColumnFormatType
}

export const FORMATTER_MAP: Record<ColumnFormatType, FormatFunc> = {
  [ColumnFormatType.Date]: (value: unknown) => {
    if (!value) return ''
    const date = dayjs(value as string)
    if (date.isValid()) {
      return date.format('YYYY-MM-DD')
    }
    return '无效日期'
  },

  [ColumnFormatType.DateTime]: (value: unknown) => {
    if (!value) return ''
    const date = dayjs(value as string)
    if (date.isValid()) {
      return date.format('YYYY-MM-DD HH:mm:ss')
    }
    return '无效日期时间'
  },
}

export type FilterFormValues<T extends TableData> = {
  [K in keyof T]?: unknown
}

export type FilterObjField<K extends string> = {
  field: K
  title?: string
  operate?: OperateEnum
  supportOperates?: OperateEnum[]
}
export type FilterField<K extends string> = K | FilterObjField<K>
