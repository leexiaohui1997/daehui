import { Expose } from 'class-transformer'
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'

import { BaseEntity } from '../base.entity'
import { PermissionMenu } from '../permission-menu/permission-menu.entity'

@Entity('role')
export class Role extends BaseEntity {
  @Column({
    unique: true,
    comment: '角色标识',
  })
  name: string

  @Column({
    comment: '角色名称',
  })
  title: string

  @Column({
    nullable: true,
    comment: '角色描述',
  })
  description: string

  @ManyToMany(() => PermissionMenu)
  @JoinTable({
    name: 'role_permission_menus',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_menu_id',
      referencedColumnName: 'id',
    },
  })
  permissionMenus: PermissionMenu[]

  @Expose()
  get permissionMenuIds() {
    return this.permissionMenus?.map(item => item.id)
  }
}
