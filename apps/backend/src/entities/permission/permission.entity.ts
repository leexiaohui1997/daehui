import { Column, Entity } from 'typeorm'

import { BaseEntity } from '../base.entity'

@Entity('permission')
export class Permission extends BaseEntity {
  @Column({
    unique: true,
    comment: '权限标识',
  })
  name: string

  @Column({
    comment: '权限名称',
  })
  title: string

  @Column({
    nullable: true,
    comment: '权限描述',
  })
  description: string
}
