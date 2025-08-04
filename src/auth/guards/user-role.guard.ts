import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  //Para tener la informacion de la metadata
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    //esto significa que si no viene o esta vacion se deja pasar
    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    //ya tenemos aqui los parametros de los roles { validRoles: [ 'admin', 'super-user' ] }
    //console.log({ validRoles });

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new BadRequestException('User not found');

    //Aqui ya tengo el rol del usuario desde la base de datos { userRoles: [ 'user' ] }
    //console.log({ userRoles: user.roles });

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }
    throw new ForbiddenException(
      `User ${user.fullName}  need a valid role: [${validRoles}]`,
    );
  }
}
