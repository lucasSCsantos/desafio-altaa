'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { CreateUserBodySchema } from '@/schemas/user.schema';
import { api } from '@/lib/api';
import { use } from 'react';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function SignUpPage(props: { searchParams: SearchParams }) {
  const router = useRouter();

  const searchParams = use(props.searchParams);
  const { token } = searchParams;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const result = CreateUserBodySchema.safeParse({ name, email, password });

      if (!result.success) {
        const message = result.error.issues[0].message;

        toast.error('Erro', {
          description: message,
        });

        return;
      }

      const payload = result.data;
      await api('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (token) {
        router.push(`/accept-invite?token=${token}`);
      } else {
        router.push('/');
      }
    } catch (error: any) {
      toast.error('Erro', {
        description: error.message as string,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">A</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-2 text-balance">Criar conta</h1>
          <p className="text-center text-muted-foreground mb-8">Comece sua jornada com Altaa.ai</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome completo
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Ou</span>
            </div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link
              href={`/login${token ? `?token=${token}` : ''}`}
              className="font-semibold text-primary hover:underline"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
