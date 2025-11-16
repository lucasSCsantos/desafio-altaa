import { CompanySchema, CreateCompanyBodySchema } from '@/modules/company/company.schema';
import {
  DeleteMemberBodySchema,
  MemberSchema,
  UpdateRoleBodySchema,
} from '@/modules/membership/membership.schema';
import { CreateUserBodySchema, LoginUserBodySchema, UserSchema } from '@/modules/user/user.schema';
import {
  CreateInviteBodySchema,
  InviteSchema,
  InviteMemberResponse,
} from '@/modules/invite/invite.schema';
import z from 'zod';

export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export interface ErrorResponse {
  message: string;
  error?: unknown;
}

export interface Member extends Omit<z.infer<typeof MemberSchema>, 'user'> {
  user: User;
}
export interface Company extends Omit<z.infer<typeof CompanySchema>, 'memberships'> {
  memberships: Member[];
  membersCount: number;
}
export interface User extends z.infer<typeof UserSchema> {
  role: Role;
}
export type Invite = z.infer<typeof InviteSchema>;
export type CompanyListResponse = {
  total: number;
  totalPages: number;
  companies: Company[];
};
export type InviteMemberResponse = z.infer<typeof InviteMemberResponse>;
export type CreateCompanyBody = z.infer<typeof CreateCompanyBodySchema>;
export type ChangeRoleBody = z.infer<typeof UpdateRoleBodySchema>;
export type DeleteMemberBody = z.infer<typeof DeleteMemberBodySchema>;
export type CreateUserBody = z.infer<typeof CreateUserBodySchema>;
export type LoginUserBody = z.infer<typeof LoginUserBodySchema>;
export type CreateInviteBody = z.infer<typeof CreateInviteBodySchema>;
