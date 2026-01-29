import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'

import { BaseEntity } from './base.entity'

@Entity('sys_permission')
export class Permission extends BaseEntity {
  @Column({ unique: true, comment: '权限标识' })
  name: string

  @Column({ comment: '权限名称' })
  title: string

  @ManyToOne(() => Permission, permission => permission.children, {
    nullable: true,
    onDelete: 'CASCADE', // 如果父权限删除，子权限也删除（或者 SET NULL，看需求，CASCADE 更干净）
  })
  parent: Permission

  @OneToMany(() => Permission, permission => permission.parent)
  children: Permission[]
}
