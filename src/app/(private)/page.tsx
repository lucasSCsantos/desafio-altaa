'use client';

import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { CompanyGrid } from '@/components/company-grid';
import { CreateCompanyModal } from '@/components/create-company-modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import CompanyPagination from '@/components/company-pagination';
import { useCompanyActions } from '@/hooks/useCompanyActions';
import { Company } from '@/types/api';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useSession();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { createCompany, selectCompany, loading, getCompanies, companies, totalPages } =
    useCompanyActions();

  const page = Number(searchParams.get('page') || 1);

  useEffect(() => {
    getCompanies(page);
  }, [page]);

  const handleSelectCompany = async (companyId: string) => await selectCompany(companyId);
  const handleCreateCompany = async (data: Partial<Company>) => await createCompany(data);
  const handlePageChange = (p: number) => router.push(`?page=${p}`);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={user?.name || ''} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Minhas Empresas</h1>
            <p className="text-muted-foreground">
              Selecione uma empresa para gerenciar membros e configurações
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Criar Empresa
          </Button>
        </div>

        {/* Companies Grid */}
        <CompanyGrid
          companies={companies}
          onSelectCompany={handleSelectCompany}
          loading={loading.gettingCompanies}
        />

        {/* Company Pagination */}

        <div className="flex items-center justify-between mt-8">
          <CompanyPagination
            currentPage={page}
            pagesCount={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Create Company Modal */}
        <CreateCompanyModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateCompany}
          loading={loading.creatingCompany}
        />
      </main>
    </div>
  );
}
