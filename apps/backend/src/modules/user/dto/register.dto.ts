import { PASSWORD_REGEX, USERNAME_REGEX } from '@daehui/shared'
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator'

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(4, 50, { message: '用户名长度在4-50个字符之间' })
  @Matches(USERNAME_REGEX, { message: '用户名只能包含字母、数字和下划线' })
  username: string

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  @Length(6, 20, { message: '密码长度在6-20个字符之间' })
  @Matches(PASSWORD_REGEX, { message: '密码只能包含字母、数字和下划线' })
  password: string
}
