import { Injectable } from '@nestjs/common'
import {
  EntityManager,
  EntityTarget,
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm'

import { PaginationDto } from '../dto/pagination.dto'
import { ConditionUtils } from '../utils/condition.util'

@Injectable()
export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  constructor(target: EntityTarget<T>, manager: EntityManager) {
    super(target, manager)
  }

  /**
   * 根据 DTO 分页和排序参数获取列表
   * @param dto 分页 DTO
   */
  async findListByDto(dto: PaginationDto, options?: FindManyOptions<T>) {
    const { page = 1, pageSize = 10, sort = [], conditions = [] } = dto
    const skip = (page - 1) * pageSize
    const [list, total] = await this.findAndCount({
      where: ConditionUtils.parse<T>(conditions),
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
