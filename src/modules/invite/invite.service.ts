import prisma from '@/lib/prisma';
import { findInviteByToken, setInviteAccepted } from './invite.repository';
import { SessionPayload, signJWT } from '@/lib/auth';
import nodemailer from 'nodemailer';
import { createMembership, findMembership } from '../membership/membership.repository';
import { requireRole } from '@/lib/role-auth';
import { findUserById } from '../user/user.repository';
import { ApiError } from '@/lib/api-error';
import { Role } from '@/generated/prisma/enums';

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
        expiresAt: new Date(Date.now()),
      },
    });
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
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: 'You are invited to join our company',
    html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invitation Email</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f9fafb;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center" style="padding: 40px 10px;">
              <!-- Container -->
              <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background: linear-gradient(135deg, #3b82f6, #06b6d4); border-radius: 16px; overflow: hidden;">
                <tr>
                  <td align="center" style="padding: 40px;">
                    <!-- Header -->
                    <h1 style="font-size: 36px; color: #ffffff; margin: 0;">Você foi convidado!</h1>
                    <p style="font-size: 18px; color: #e0e7ff; margin: 16px 0 32px;">Junte-se à nossa empresa clicando no botão abaixo.</p>

                    <!-- Action Button -->
                    <a href="${inviteUrl}" style="display:inline-block;background-color:#ffffff;color:#3b82f6;font-weight:bold;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:16px;">
                      Aceitar Convite
                    </a>

                    <!-- Footer Note -->
                    <p style="font-size:14px;color:#e0e7ff;margin-top:24px;">
                      Se você não solicitou este convite, ignore este e-mail.
                    </p>
                  </td>
                </tr>
              </table>
              <!-- End Container -->
            </td>
          </tr>
        </table>
      </body>
      </html>`,
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

  if (invite.email !== user?.email) {
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
