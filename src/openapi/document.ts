import { registry } from './registry';
import A from '@asteasolutions/zod-to-openapi';

export const openApiDocument = A.getOpenApiMetadata(registry.definitions, {
  openapi: '3.0.0',
  info: {
    title: 'My SaaS API',
    version: '1.0.0',
  },
  servers: [{ url: 'http://localhost:3000' }],
});
