'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';

import { use } from 'react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function AcceptInvitePage(props: { searchParams: SearchParams }) {
  const router = useRouter();
  const searchParams = use(props.searchParams);

  const { token } = searchParams;

  useEffect(() => {
    if (!token) {
      toast.error('Token não encontrado. Redirecionando para cadastro.');
      router.push(`/signup?token=${token || ''}`);
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
