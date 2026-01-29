import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Response } from 'express'

import { AdminGuard } from '../../common/guards/admin.guard'
import { AuthGuard } from '../../common/guards/auth.guard'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { QueryPermissionDto } from './dto/query-permission.dto'
import { PermissionService } from './permission.service'

@Controller('permissions')
@UseGuards(AuthGuard, AdminGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto)
  }

  @Get()
  findAll(@Query() query: QueryPermissionDto) {
    return this.permissionService.findAll(query)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id)
  }

  @Get('export')
  export(@Res() res: Response) {
    return this.permissionService.export(res)
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  import(@UploadedFile() file: Express.Multer.File) {
    return this.permissionService.import(file)
  }
}
