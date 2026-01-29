---
name: 'daehui-style-guide'
description: '提供 Daehui 项目的编码风格准则。在编写后端 NestJS 代码、前端 Vue 3 代码或 Shared 库时调用此技能，以保持架构和风格的一致性。'
---

# Daehui 项目编码风格指南

本指南提炼自 Daehui 项目的代码库，旨在指导 AI 按项目既有风格进行编码，确保 Monorepo 架构下的代码一致性。

## 1. 核心架构模式 (Monorepo)

- **工具链**: pnpm workspaces。
- **项目布局**:
  - `apps/backend`: NestJS 后端。
  - `apps/frontend`: Vue 3 + Vite 前端。
  - `packages/shared`: 存放跨端共享的逻辑（错误处理、工具类、请求封装）。

## 2. 后端开发规范 (NestJS)

### 类型定义与装饰器

- **强制规则**: 凡是被 NestJS 装饰器（如 `@Body()`, `@CurrentUser()`）修饰的类型参数，必须使用 `class` 而非 `interface`。
  - _原因_: `interface` 在编译时会被擦除，导致 `emitDecoratorMetadata` 无法获取正确的类型信息。
- **示例**:
  ```typescript
  // 正确 (interfaces/user-info.interface.ts)
  export class UserInfo {
    sub: number
    username: string
  }
  ```

### 错误处理

- **规范**: 严禁直接抛出 `Error`。必须使用 `packages/shared` 中的 `ApiError` 和 `ApiCode`。
- **示例**: `throw new ApiError(ApiCode.UNAUTHORIZED)`。

### 模块组织

- **Service/Controller**: 采用 kebab-case 命名，如 `user.service.ts`。
- **Config**: 优先通过 `ConfigService` 获取环境变量，避免使用 `process.env`。

## 3. 前端开发规范 (Vue 3 + Arco Design)

### 组件开发

- **风格**: 强制使用 `<script setup lang="ts">`。
- **UI 框架**: Arco Design Vue。组件按需自动导入。
- **命名**: 视图组件文件采用 PascalCase，如 `UserLogin.vue`。

### 状态管理 (Pinia)

- **模式**: 强制使用 **Setup Store** 风格。
- **示例**:
  ```typescript
  export const useUserStore = defineStore('user', () => {
    const token = ref(null)
    const setToken = val => {
      token.value = val
    }
    return { token, setToken }
  })
  ```

### API 交互

- **定义**: 在 `api/` 目录下通过 `requestUtils.defineFunc` 定义接口函数。
- **鉴权**: 请求拦截器已在 `request.ts` 中封装，自动注入 `Authorization: Bearer <token>`。

## 4. 代码风格一致性

- **导入排序**:
  1. 外部库 (如 `vue`, `@nestjs/common`)。
  2. 内部共享库 (以 `@daehui/` 开头)。
  3. 相对路径导入。
- **CSS**: 使用 Less，优先复用 Arco Design 的全局变量 (`@color-fill-2`、`@size-2` 等)。
- **注释**: 核心业务逻辑及 DTO 字段需包含 JSDoc 注释。
