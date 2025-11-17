import * as z from 'zod';
import { pt } from 'zod/locales';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

z.config(pt());

extendZodWithOpenApi(z);

export { z };
