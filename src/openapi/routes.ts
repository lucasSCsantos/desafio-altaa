import { registry } from './registry';
import { CreateUserBodySchema, UserSchema } from '@/modules/user/user.schema';

registry.registerPath({
  method: 'post',
  path: '/api/users',
  description: 'Create a new user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User created',
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
  },
});
