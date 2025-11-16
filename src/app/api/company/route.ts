import {
  createCompanyController,
  deleteCompanyController,
  getCompanyController,
} from '@/modules/company/company.controller';

export const POST = createCompanyController;

export const GET = getCompanyController;

export const DELETE = deleteCompanyController;
