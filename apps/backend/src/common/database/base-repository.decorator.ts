import { Inject, Type } from '@nestjs/common'

export function getBaseRepositoryToken(entity: Type): string {
  return `${entity.name}BaseRepository`
}

export const InjectBaseRepository = (entity: Type) =>
  Inject(getBaseRepositoryToken(entity))
