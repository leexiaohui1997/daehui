import { Injectable } from '@nestjs/common'
import {
  EntityManager,
  EntityTarget,
  FindOptionsOrder,
  ObjectLiteral,
  Repository,
} from 'typeorm'

import { PaginationDto } from '../dto/pagination.dto'

@Injectable()
export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  constructor(target: EntityTarget<T>, manager: EntityManager) {
    super(target, manager)
  }

  /**
   * 根据 DTO 分页和排序参数获取列表
   * @param dto 分页 DTO
   */
  async findListByDto(dto: PaginationDto) {
    const { pageSize = 10, sort = [], skip } = dto

    const order: FindOptionsOrder<T> = sort.reduce((acc, item) => {
      return {
        ...acc,
        [item.field]: item.order,
      }
    }, {})

    const [list, total] = await this.findAndCount({
      order,
      skip,
      take: pageSize,
    })

    return { list, total }
  }
}
