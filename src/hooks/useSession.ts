'use client';

import { api } from '@/lib/api';
import { User } from '@/types/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function useSession() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        const userData = await api<User>('/api/auth/me');
        setUser(userData);
      } catch (error: any) {
        toast.error('Erro', {
          description: error.message as string,
        });

        await api('/api/auth/logout', { method: 'POST' });
        router.push('/login');
      }
    };

    getSession();
  }, []);

  return user;
}
