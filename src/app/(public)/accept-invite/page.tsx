'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export default function AcceptInvitePage() {
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get('token');

  useEffect(() => {
    if (!token) {
      toast.error('Token não encontrado.');
      router.push('/login');
      return;
    }

    const acceptInvite = async () => {
      try {
        await api(`/api/auth/accept-invite?token=${token}`, { method: 'POST' });

        toast.success('Convite aceito com sucesso!');
        router.push('/');
      } catch (error: any) {
        toast.error('Erro', {
          description: error.message as string,
        });
        router.push('/login');
      }
    };

    acceptInvite();
  }, [token, router]);

  return null;
}
