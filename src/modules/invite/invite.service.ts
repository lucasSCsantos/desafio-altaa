import prisma from '@/lib/prisma';
import { findInviteByToken, setInviteAccepted } from './invite.repository';
import { SessionPayload, signJWT } from '@/lib/auth';
import nodemailer from 'nodemailer';
import { createMembership, findMembership } from '../membership/membership.repository';

interface CreateInviteParams {
  email: string;
}

export async function createInvite({ email }: CreateInviteParams, { companyId }: SessionPayload) {
  const token = signJWT(
    {
      email,
      companyId,
    } as SessionPayload,
    '1h',
  );

  const invite = await prisma.invite.create({
    data: {
      email,
      companyId: companyId!,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
      token: token,
    },
  });

  if (!invite) {
    throw new Error('Error creating user');
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
    throw new Error('Invalid invite token');
  }

  if (invite.accepted) {
    throw new Error('Invite has already been accepted');
  }

  if (invite.expiresAt < new Date()) {
    throw new Error('Invite has expired');
  }

  const membership = await findMembership(userId, invite.companyId);

  if (membership) {
    throw new Error('User is already a member of the company');
  }

  await createMembership(userId, invite.companyId);

  await setInviteAccepted(invite.id);

  return true;
}
