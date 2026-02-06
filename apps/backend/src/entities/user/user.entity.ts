import { Expose } from 'class-transformer'
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'

import { BaseEntity } from '../base.entity'
import { Role } from '../role/role.entity'

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

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[]

  @Expose()
  get roleIds() {
    return this.roles?.map(item => item.id)
  }
}
