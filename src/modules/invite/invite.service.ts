import prisma from '@/lib/prisma';
import { findInviteByToken, setInviteAccepted } from './invite.repository';
import { SessionPayload, signJWT } from '@/lib/auth';
import { Resend } from 'resend';

interface CreateInviteParams {
  email: string;
}

interface AcceptInviteParams {
  token: string;
}

export async function createInvite({ email }: CreateInviteParams, { companyId }: SessionPayload) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const token = signJWT(
    {
      email,
      companyId: companyId!,
    } as SessionPayload,
    '1h',
  );

  const invite = await prisma.invite.create({
    data: {
      email,
      companyId: companyId!,
      expiresAt: new Date(Date.now() + 60 * 1000), // Expires in 7 days
      token: token,
    },
  });

  if (!invite) {
    throw new Error('Error creating user');
  }

  const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite?token=${invite.token}`;

  await resend.emails.send({
    from: 'luc.cristovam10@gmail.com',
    to: email,
    subject: 'You are invited to join our company',
    html: `<p>You have been invited to join our company. Click the link below to accept the invite:
              <a href="${inviteUrl}">Accept Invite</a>
      </p>`,
  });

  return invite;
}

export async function acceptInvite({ token }: AcceptInviteParams, { userId }: SessionPayload) {
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

  await prisma.membership.create({
    data: {
      userId,
      companyId: invite.companyId,
      role: 'MEMBER',
    },
  });

  await setInviteAccepted(invite.id);

  return true;
}
