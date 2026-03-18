import { Injectable, UnauthorizedException } from '@nestjs/common'
import { TokenPayloadModel } from 'src/shared/model/auth.model'
//import { GetInitDataUseCase } from 'src/users/useCase/getInitDataUseCase.useCase';
import { UserRepository } from 'src/shared/repositories/user.repository'
import { PasswordService } from 'src/shared/services/password.service'
import { INVALID_ACCESS_DATA_MESSAGE } from '../constant/messages.constant'
import { SignInRequestDto } from '../dtos/auth.dto'
import { AuthService } from '../services/auth.service'

@Injectable()
export class SignInUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly authService: AuthService,
    // private readonly initDataUseCase: GetInitDataUseCase,
  ) {}

  async run(signInData: SignInRequestDto) {
    const user = await this.userRepository.findOneBy({
      email: signInData.email,
    })

    if (!user) {
      throw new UnauthorizedException(INVALID_ACCESS_DATA_MESSAGE)
    }

    const passwordCorrect = await this.passwordService.compare(
      signInData.password,
      user.password,
    )

    if (!passwordCorrect) {
      throw new UnauthorizedException(INVALID_ACCESS_DATA_MESSAGE)
    }
    const tokens = await this.authService.generateTokens({
      email: user.email,
      sub: user.id,
    })
    return {
      ...tokens,
    }
  }
  /*
  async loginDomain(
    signInData: SignInRequestDto,
    storeId: string,
    organizationId: string,
  ) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userOrganizations', 'userOrganization')
      .innerJoinAndSelect('userOrganization.organization', 'organization')

      .leftJoinAndSelect(
        'userOrganization.userStores',
        'userStore',
        'userStore.storeId = :storeId',
        { storeId },
      )

      .innerJoinAndSelect('user.people', 'people')
      .where('user.email = :email', { email: signInData.email })
      .andWhere('organization.id = :organizationId', { organizationId })
      .getOne();

    if (!user) {
      throw new UnauthorizedException(INVALID_ACCESS_DATA_MESSAGE);
    }

    const userOrg = user.userOrganizations[0];

    if (userOrg.isActive === false) {
      throw new UnauthorizedException(
        'El usuario se encuentra inactivo. Contacte al administrador.',
      );
    }

    if (!userOrg.userStores || userOrg.userStores.length === 0) {
      throw new UnauthorizedException(
        'El usuario no tiene permisos asignados para esta tienda.',
      );
    }

    const checkExistence =
      await this.crudUserStoreRewardsService.checkExistence(
        user.id,
        Number(storeId),
      );

    if (!checkExistence) {
      const userStoreRewardData: UserStoreRewardsEntity = {
        userId: user.id,
        storeId: Number(storeId),
        organizationId: Number(organizationId),
        points: 0,
      };

      await this.crudUserStoreRewardsService.create(userStoreRewardData);
    }

    const passwordCorrect = await this.passwordService.compare(
      signInData.password,
      user.password,
    );

    if (!passwordCorrect) {
      throw new UnauthorizedException(INVALID_ACCESS_DATA_MESSAGE);
    }

    const tokens = await this.authService.generateTokens({
      email: user.email,
      sub: user.id,
      organizationId: user.userOrganizations[0].organizationId,
    });

    const response = {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        isProfileCompleted: user.isProfileCompleted,
        organizationId: user.userOrganizations[0].organizationId,
        people: {
          id: user.people[0].id,
          lastnames: user.people[0].lastnames,
          names: user.people[0].names,
        },
      },
    };

    return response;
  }

  async loginGoogle(user: TokenPayloadModel) {
    const tokens = await this.authService.generateTokens({
      email: user.email,
      sub: user.sub,
      organizationId: user.organizationId,
    });

    return tokens;
  }*/
}
