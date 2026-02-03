import { joinCondition, OperateEnum, parseCondition } from '@daehui/shared'
import { Injectable } from '@nestjs/common'
import {
  EntityManager,
  EntityTarget,
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm'
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata.js'

import { PaginationDto } from '../dto/pagination.dto'
import { ConditionUtils } from '../utils/condition.util'

@Injectable()
export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  constructor(target: EntityTarget<T>, manager: EntityManager) {
    super(target, manager)
  }

  /**
   * 转换关联条件
   * @param coditions 条件字符串数组
   * @returns 转换后的条件字符串数组
   */
  private async transformRelationConditions(
    coditions: string[],
  ): Promise<(string | false)[]> {
    const runRelationTask = async (
      currentConditions: string[],
      metaData: RelationMetadata,
    ): Promise<(string | false)[]> => {
      const { propertyName } = metaData
      // 获取关联实体的主键字段名
      const inverseEntityPrimaryKey =
        metaData.inverseEntityMetadata.primaryColumns[0].propertyName

      return Promise.all(
        currentConditions.map(async codition => {
          const parsedResults = parseCondition(codition)
          const relationConditions = parsedResults.find(
            item => item.field === propertyName,
          )
          const idConditions = parsedResults.find(item => item.field === 'id')

          if (!relationConditions) {
            return codition
          }

          if (!inverseEntityPrimaryKey) {
            return false
          }

          const qb = this.createQueryBuilder('left')
          qb.innerJoin(`left.${propertyName}`, 'alias')
            .where(`alias.${inverseEntityPrimaryKey} IN (:...ids)`, {
              ids: relationConditions.values,
            })
            .select(['left.id'])

          if (idConditions) {
            qb.andWhere(ConditionUtils.parseResult([idConditions]))
          }

          const rows = await qb.getMany()
          const rowIds = rows.map(item => item.id)

          if (!rowIds.length) {
            return false
          }

          return joinCondition([
            {
              field: 'id',
              operate: OperateEnum.In,
              values: rowIds,
            },
            ...parsedResults.filter(
              item => !['id', relationConditions.field].includes(item.field),
            ),
          ])
        }),
      )
    }

    return this.metadata.relations.reduce(
      async (prev, current) => {
        const currentConditions = (await prev).filter(flag => flag !== false)
        return runRelationTask(currentConditions, current)
      },
      Promise.resolve(coditions as (string | false)[]),
    )
  }

  /**
   * 根据 DTO 分页和排序参数获取列表
   * @param dto 分页 DTO
   */
  async findListByDto(dto: PaginationDto, options?: FindManyOptions<T>) {
    const { page = 1, pageSize = 10, sort = [], conditions = [] } = dto
    const skip = (page - 1) * pageSize

    const transformedConditions = (
      await this.transformRelationConditions(conditions)
    ).filter(flag => flag !== false)

    if (transformedConditions.length !== conditions.length) {
      const list = [] as T[]
      const total = 0
      return { list, total }
    }

    const [list, total] = await this.findAndCount({
      where: ConditionUtils.parse<T>(transformedConditions),
      order: sort.reduce((acc, item) => {
        return {
          ...acc,
          [item.field]: item.order,
        }
      }, {}),
      skip,
      take: pageSize,
      ...options,
    })
    return { list, total }
  }
}
