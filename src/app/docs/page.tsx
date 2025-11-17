'use client';

import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import 'swagger-ui-react/swagger-ui.css';

// Página wrapper
export default function DocsPage() {
  // Se estiver em produção -> retorna 404 real
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  // Lazy import do SwaggerUI apenas no client
  const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
    ssr: false,
  });

  return <SwaggerUI url="swagger.json" />;
}
