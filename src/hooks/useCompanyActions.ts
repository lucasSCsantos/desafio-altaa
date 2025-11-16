import { api } from '@/lib/api';
import {
  Company,
  CompanyListResponse,
  Invite,
  InviteMemberResponse,
  Member,
  Role,
} from '@/types/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function useCompanyActions(companyId?: string) {
  const router = useRouter();

  const [totalPages, setTotalPages] = useState(1);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState({
    inviting: false,
    deletingCompany: false,
    removingMemberId: false,
    changingRoleId: false,
    selectingCompany: false,
    creatingCompany: false,
    gettingCompany: false,
    gettingCompanies: false,
  });

  async function getCompany() {
    try {
      setLoading((l) => ({ ...l, gettingCompany: true }));

      const data = await api<Company>('/api/company/');

      setCompany(data);
      setMembers(data.memberships);
    } catch (error: any) {
      toast.error('Erro', {
        description: error.message as string,
      });
    } finally {
      setLoading((l) => ({ ...l, gettingCompany: false }));
    }
  }

  async function getCompanies(page: number = 1) {
    try {
      setLoading((l) => ({ ...l, gettingCompanies: true }));

      const data = await api<CompanyListResponse>(`/api/companies?page=${page}`);

      setCompanies(data.companies);
      setTotalPages(data.totalPages || 1);
    } catch (error: any) {
      toast.error('Erro', {
        description: error.message as string,
      });
    } finally {
      setLoading((l) => ({ ...l, gettingCompanies: false }));
    }
  }

  async function inviteMember(data: Partial<Invite>) {
    try {
      setLoading((l) => ({ ...l, inviting: true }));

      const { previewUrl } = await api<InviteMemberResponse>(`/api/company/${companyId}/invite`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      toast.success('Convite enviado! Em 3 segundos abrirá uma caixa de e-mail com o convite.');

      setTimeout(() => {
        window.open(previewUrl, '_blank');
      }, 3000);
    } catch (error: any) {
      toast.error('Erro', {
        description: error.message as string,
      });
    } finally {
      setLoading((l) => ({ ...l, inviting: false }));
    }
  }

  async function deleteCompany() {
    try {
      setLoading((l) => ({ ...l, deletingCompany: true }));

      await api(`/api/company/`, {
        method: 'DELETE',
      });

      toast.success('Empresa apagada');
      router.push('/');
    } catch (error: any) {
      toast.error('Erro', {
        description: error.message as string,
      });
    } finally {
      setLoading((l) => ({ ...l, deletingCompany: false }));
    }
  }

  async function removeMember(memberId: string) {
    try {
      await api(`/api/company/member`, {
        method: 'DELETE',
        body: JSON.stringify({ userId: memberId }),
      });

      setLoading((l) => ({ ...l, removingMemberId: true }));

      setMembers((prev) => prev.filter((m) => m.userId !== memberId));

      toast.success('Membro removido com sucesso');
    } catch (error: any) {
      toast.error('Erro', { description: error.message });
    } finally {
      setLoading((l) => ({ ...l, removingMemberId: false }));
    }
  }

  async function changeRole(memberId: string, newRole: Role) {
    try {
      setLoading((l) => ({ ...l, changingRoleId: true }));

      await api(`/api/company/member`, {
        method: 'PATCH',
        body: JSON.stringify({ userId: memberId, role: newRole }),
      });

      setMembers((prev) => prev.map((m) => (m.userId === memberId ? { ...m, role: newRole } : m)));

      toast.success('Cargo atualizado!');
    } catch (error: any) {
      toast.error('Erro', { description: error.message });
    } finally {
      setLoading((l) => ({ ...l, changingRoleId: false }));
    }
  }

  async function selectCompany(id: string) {
    try {
      setLoading((l) => ({ ...l, selectingCompany: true }));

      await api(`/api/company/${id}/select`, {
        method: 'POST',
      });

      router.push(`/company/${id}`);
    } catch (error: any) {
      toast.error('Erro', { description: error.message });
    } finally {
      setLoading((l) => ({ ...l, selectingCompany: false }));
    }
  }

  async function createCompany(data: Partial<Company>) {
    try {
      setLoading((l) => ({ ...l, creatingCompany: true }));

      const company = await api<Company>('/api/company', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      toast.success('Empresa criada com sucesso!');

      setCompanies((prev) => [company, ...prev.slice(0, 5)]);
      setTotalPages(Math.ceil((companies.length + 1) / 6));
    } catch (error: any) {
      toast.error('Erro', { description: error.message });
    } finally {
      setLoading((l) => ({ ...l, creatingCompany: false }));
    }
  }

  return {
    loading,
    inviteMember,
    deleteCompany,
    removeMember,
    changeRole,
    selectCompany,
    createCompany,
    getCompany,
    getCompanies,
    companies,
    company,
    members,
    totalPages,
  };
}
