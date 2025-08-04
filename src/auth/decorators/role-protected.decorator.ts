import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';

//Crear una variable para que solo desde aqui se actualice el string
export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidRoles[]) => {
  return SetMetadata(META_ROLES, args);
};
