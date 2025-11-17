export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Member {
  id: string;
  companyId: string;
  userId: string;
  role: Role;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  membersCount: number;
  memberships: Member[];
}

export interface Invite {
  id: string;
  email: string;
  companyId: string;
  role: Role;
  token: string;
  accepted: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyListResponse {
  total: number;
  totalPages: number;
  companies: Company[];
}

export interface InviteMemberResponse {
  previewUrl: string;
}
