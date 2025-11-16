import { registry } from './registry';
import { UserSchema, CreateUserBodySchema, LoginUserBodySchema } from '@/modules/user/user.schema';

import { CompanySchema, CreateCompanyBodySchema } from '@/modules/company/company.schema';

import {
  MemberSchema,
  UpdateRoleBodySchema,
  DeleteMemberBodySchema,
} from '@/modules/membership/membership.schema';

registry.register('User', UserSchema);
registry.register('CreateUserBody', CreateUserBodySchema);
registry.register('LoginUserBody', LoginUserBodySchema);

registry.register('Company', CompanySchema);
registry.register('CreateCompanyBody', CreateCompanyBodySchema);

registry.register('Member', MemberSchema);
registry.register('UpdateRoleBody', UpdateRoleBodySchema);
registry.register('DeleteMemberBody', DeleteMemberBodySchema);
