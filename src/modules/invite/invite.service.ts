import prisma from '@/lib/prisma';
import { findInviteByToken, setInviteAccepted } from './invite.repository';
import { SessionPayload, signJWT } from '@/lib/auth';
import nodemailer from 'nodemailer';
import { createMembership, findMembership } from '../membership/membership.repository';
import { requireRole } from '@/lib/role-auth';
import { findUserById } from '../user/user.repository';
import { Role } from '@/types/api';
import { ApiError } from '@/lib/api-error';

interface CreateInviteParams {
  email: string;
  role: Role;
}

export async function createInvite(
  { email, role }: CreateInviteParams,
  { activeCompanyId, userId }: SessionPayload,
) {
  await requireRole(userId, activeCompanyId!, ['OWNER', 'ADMIN']);

  const token = signJWT(
    {
      email,
      activeCompanyId,
    } as SessionPayload,
    '1h',
  );

  const inviteAlreadyExists = await prisma.invite.findFirst({
    where: {
      email,
      companyId: activeCompanyId!,
      accepted: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (inviteAlreadyExists) {
    await prisma.invite.update({
      where: {
        id: inviteAlreadyExists.id,
      },
      data: {
        expiresAt: new Date(Date.now()), // Expires in 1 hour
      },
    });

    inviteAlreadyExists.expiresAt = new Date(Date.now());
  }

  const invite = await prisma.invite.create({
    data: {
      email,
      companyId: activeCompanyId!,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
      token: token,
      role,
    },
  });

  if (!invite) {
    throw new ApiError(404, 'ERROR_CREATING_INVITE', 'Não foi possível criar o convite');
  }

  const account = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  const inviteUrl = `http://${process.env.FRONTEND_URL || 'localhost:3000'}/accept-invite?token=${invite.token}`;

  const data = await transporter.sendMail({
    from: process.env.RESEND_EMAIL,
    to: email,
    subject: 'You are invited to join our company',
    html: `<p>You have been invited to join our company. Click the link below to accept the invite:
              <a href="${inviteUrl}">Accept Invite</a>
      </p>`,
  });

  const url = nodemailer.getTestMessageUrl(data);

  return { invite, previewUrl: url };
}

export async function acceptInvite(token: string, { userId }: SessionPayload) {
  const invite = await findInviteByToken(token);

  if (!invite) {
    throw new ApiError(404, 'INVITE_NOT_FOUND', 'Convite não encontrado ou inválido');
  }

  if (invite.accepted) {
    throw new ApiError(409, 'INVITE_ALREADY_ACCEPTED', 'Convite já foi aceito');
  }

  if (invite.expiresAt < new Date()) {
    throw new ApiError(409, 'INVITE_EXPIRED', 'Convite expirado');
  }

  const membership = await findMembership(userId, invite.companyId);

  if (membership) {
    throw new ApiError(409, 'USER_ALREADY_MEMBER', 'Usuário já é membro da empresa');
  }

  const user = await findUserById(userId);

  if (invite.email === user?.email) {
    throw new ApiError(
      409,
      'INVITE_EMAIL_MISMATCH',
      'O e-mail do convite não corresponde ao e-mail do usuário',
    );
  }

  await createMembership(userId, invite.companyId, invite.role);

  await setInviteAccepted(invite.id);

  return true;
}
