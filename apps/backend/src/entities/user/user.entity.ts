import { Column, Entity } from 'typeorm'

import { BaseEntity } from '../base.entity'

@Entity('user')
export class User extends BaseEntity {
  @Column({
    unique: true,
    length: 50,
    comment: '用户名',
  })
  username: string

  @Column({
    comment: '密码',
    select: false, // 默认查询不返回密码
  })
  password: string

  @Column({
    name: 'is_admin',
    type: 'boolean',
    default: false,
    comment: '是否为管理员',
  })
  isAdmin: boolean
}
