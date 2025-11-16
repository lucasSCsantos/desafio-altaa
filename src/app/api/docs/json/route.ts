import { openApiDocument } from '@/openapi/document';

export async function GET() {
  return Response.json(openApiDocument);
}
