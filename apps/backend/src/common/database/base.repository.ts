import { Injectable } from '@nestjs/common'
import { EntityManager, EntityTarget, ObjectLiteral, Repository } from 'typeorm'

@Injectable()
export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  constructor(target: EntityTarget<T>, manager: EntityManager) {
    super(target, manager)
  }
}
