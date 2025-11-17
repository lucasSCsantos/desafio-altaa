'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted px-4">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 hero */}
        <div className="space-y-2">
          <div className="text-8xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            404
          </div>
          <h1 className="text-4xl font-bold text-foreground">Página não encontrada</h1>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-lg text-muted-foreground">
            Desculpe, não conseguimos encontrar a página que você está procurando. Ela pode ter sido
            movida ou não existir mais.
          </p>
        </div>

        {/* Illustration */}
        <div className="py-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-muted">
            <svg
              className="w-16 h-16 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={() => router.back()} variant="outline" className="w-full h-11 text-base">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Link href="/" className="w-full">
            <Button className="w-full h-11 text-base">
              <Home className="w-4 h-4 mr-2" />
              Voltar para o Dashboard
            </Button>
          </Link>
          <Link href="/login" className="w-full">
            <Button variant="ghost" className="w-full h-11 text-base">
              Voltar ao Login
            </Button>
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
