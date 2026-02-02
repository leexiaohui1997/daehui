import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'

import { BaseEntity } from '../base.entity'
import { Permission } from '../permission/permission.entity'

@Entity('permission_menus')
export class PermissionMenu extends BaseEntity {
  @Column({
    unique: true,
    comment: '菜单标识',
  })
  name: string

  @Column({
    comment: '菜单名称',
  })
  title: string

  @Column({
    nullable: true,
    comment: '菜单描述',
  })
  description: string

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'permission_menu_permissions',
    joinColumn: {
      name: 'permission_menu_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[]
}
