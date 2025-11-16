import {
  deleteMemberController,
  updateMemberRoleController,
} from '@/modules/membership/membership.controller';

export const PATCH = updateMemberRoleController;

export const DELETE = deleteMemberController;
