import { ApiCode, ApiError } from '@daehui/shared'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as ExcelJS from 'exceljs'
import { Response } from 'express'
import { FindOptionsOrder, FindOptionsWhere, Like, Repository } from 'typeorm'

import { Permission } from '../../entities/permission.entity'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { QueryPermissionDto } from './dto/query-permission.dto'

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const { name, parentId } = createPermissionDto
    const exist = await this.permissionRepository.findOne({ where: { name } })
    if (exist) {
      throw new ApiError(ApiCode.PARAM_ERROR, '权限标识已存在')
    }

    const permission = new Permission()
    permission.name = createPermissionDto.name
    permission.title = createPermissionDto.title

    if (parentId) {
      const parent = await this.permissionRepository.findOne({
        where: { id: parentId },
      })
      if (!parent) {
        throw new ApiError(ApiCode.PARAM_ERROR, '父级权限不存在')
      }
      permission.parent = parent
    }

    return this.permissionRepository.save(permission)
  }

  async findAll(query: QueryPermissionDto) {
    const { page = 1, pageSize = 10, name, title, sortField, sortOrder } = query
    const skip = (page - 1) * pageSize

    const where: FindOptionsWhere<Permission> = {}
    if (name) where.name = Like(`%${name}%`)
    if (title) where.title = Like(`%${title}%`)

    const order: FindOptionsOrder<Permission> = {}
    if (sortField) {
      order[sortField] = sortOrder || 'ASC'
    } else {
      order.id = 'DESC'
    }

    const [items, total] = await this.permissionRepository.findAndCount({
      where,
      order,
      skip,
      take: pageSize,
      relations: ['parent'],
    })

    return { items, total }
  }

  async remove(id: number) {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['children'],
    })
    if (!permission) {
      throw new ApiError(ApiCode.PARAM_ERROR, '权限不存在')
    }
    if (permission.children && permission.children.length > 0) {
      throw new ApiError(ApiCode.PARAM_ERROR, '请先删除子权限')
    }
    return this.permissionRepository.remove(permission)
  }

  async export(res: Response) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Permissions')

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: '标识', key: 'name', width: 20 },
      { header: '名称', key: 'title', width: 20 },
      { header: '父级ID', key: 'parentId', width: 10 },
    ]

    const permissions = await this.permissionRepository.find({
      relations: ['parent'],
    })
    permissions.forEach(p => {
      worksheet.addRow({
        id: p.id,
        name: p.name,
        title: p.title,
        parentId: p.parent?.id,
      })
    })

    res.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    res.header('Content-Disposition', 'attachment; filename=permissions.xlsx')

    await workbook.xlsx.write(res)
    res.end()
  }

  async import(file: Express.Multer.File) {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(file.buffer as unknown as ExcelJS.Buffer)
    const worksheet = workbook.getWorksheet(1)

    if (!worksheet) {
      throw new ApiError(ApiCode.PARAM_ERROR, 'Excel 文件格式错误')
    }

    const permissionsToSave: Permission[] = []

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return // Skip header

      const name = row.getCell(2).value?.toString()
      const title = row.getCell(3).value?.toString()
      // 暂时忽略父级ID导入，避免复杂性

      if (name && title) {
        const p = new Permission()
        p.name = name
        p.title = title
        permissionsToSave.push(p)
      }
    })

    let successCount = 0
    for (const p of permissionsToSave) {
      try {
        const exist = await this.permissionRepository.findOne({
          where: { name: p.name },
        })
        if (!exist) {
          await this.permissionRepository.save(p)
          successCount++
        }
      } catch {
        // ignore
      }
    }

    return { successCount }
  }
}
