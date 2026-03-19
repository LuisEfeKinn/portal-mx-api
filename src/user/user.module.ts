import { Module } from '@nestjs/common'
import { UserRepository } from 'src/shared/repositories/user.repository'
import { PaginatedService } from 'src/shared/services/paginated.service'
import { S3Service } from 'src/shared/services/s3.service'
import { UploadFileService } from 'src/shared/services/uploadFile.service'
import { SharedModule } from 'src/shared/shared.module'
import { BulkUploadController } from './controllers/bulkUpload.controller'
//import { RolesController } from './controllers/roles.controller'
import { UserController } from './controllers/user.controller'
import { BulkUploadJobRepository } from './repositories/bulkUploadJob.repository'
import { ItemRepository } from './repositories/item.repository'
import { ModuleRepository } from './repositories/module.repository'
import { RolRepository } from './repositories/rol.repository'
import { RolItemPermissionRepository } from './repositories/rolItemPermission.repository'
import { UserRoleRepository } from './repositories/userRol.repository'
import { BulkUploadService } from './services/bulkUpload.service'
import { CrudRolesService } from './services/crudRoles.service'
import { CrudUserService } from './services/crudUser.service'
import { GetAllRolesService } from './services/getAllRoles.service'
import { GetAllUserService } from './services/getAllUser.service'
import { InitDataService } from './services/initData.service'
import { BulkUploadUseCase } from './useCase/bulkUpload.useCase'
import { GetAllRolesUseCase } from './useCase/getAllRoles.useCase'
import { RoleUseCase } from './useCase/role.useCase'
import { CrudUsersUseCase } from './useCase/user.useCase'

@Module({
  imports: [SharedModule.forRoot()],
  providers: [
    CrudUserService,
    InitDataService,
    UserRepository,
    CrudUsersUseCase,
    RolItemPermissionRepository,
    RolRepository,
    ItemRepository,
    CrudRolesService,
    RoleUseCase,
    GetAllRolesUseCase,
    GetAllRolesService,
    PaginatedService,
    ModuleRepository,
    UserRoleRepository,
    UserRepository,
    GetAllUserService,
    BulkUploadJobRepository,
    BulkUploadService,
    BulkUploadUseCase,
    S3Service,
    UploadFileService,
  ],
  controllers: [UserController, BulkUploadController],
  exports: [CrudUserService],
})
export class UserModule {}
