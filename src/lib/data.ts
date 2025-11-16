import { Company } from '@/types/api';
import { api } from './api';
import { toast } from 'sonner';

export async function getCompanies() {
  try {
    const data = await api<Company[]>('/api/companies');

    return data;
  } catch (error: any) {
    toast.error('Erro', {
      description: error.message as string,
    });
  }
}

export async function getCompany() {
  try {
    const data = await api<Company>(`/api/company/`);

    return data;
  } catch (error: any) {
    toast.error('Erro', {
      description: error.message as string,
    });
  }
}
