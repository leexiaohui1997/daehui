import { DynamicModule, Module, Provider, Type } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { BaseRepository } from './base.repository'
import { getBaseRepositoryToken } from './base-repository.decorator'

@Module({})
export class TypeOrmExModule {
  static forFeature(entities: Type[]): DynamicModule {
    const providers: Provider[] = entities.map(entity => ({
      provide: getBaseRepositoryToken(entity),
      useFactory: (dataSource: DataSource) => {
        return new BaseRepository(entity, dataSource.createEntityManager())
      },
      inject: [DataSource],
    }))

    return {
      module: TypeOrmExModule,
      imports: [TypeOrmModule.forFeature(entities)],
      providers: providers,
      exports: providers,
    }
  }
}
