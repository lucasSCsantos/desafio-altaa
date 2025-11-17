'use client';

import { CompanyCard } from '@/components/company-card';
import { Company } from '@/types/api';

interface CompanyGridProps {
  companies: Array<Company>;
  onSelectCompany: (companyId: string) => void;
  loading?: boolean;
}

export function CompanyGrid({ companies, onSelectCompany, loading }: CompanyGridProps) {
  if (loading && companies?.length === 0) {
    return <CompanyGridLoading />;
  }

  if (companies?.length === 0 && !loading) {
    return <CompanyGridEmpty />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies?.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onSelect={() => onSelectCompany(company.id)}
        />
      ))}
    </div>
  );
}

function CompanyGridLoading() {
  return (
    <div className="flex items-center justify-center py-12 rounded-lg border border-dashed border-border">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">Buscando empresas...</p>
      </div>
    </div>
  );
}

export function CompanyGridEmpty() {
  return (
    <div className="flex items-center justify-center py-12 rounded-lg border border-dashed border-border">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">Nenhuma empresa encontrada</p>
        <p className="text-sm text-muted-foreground">Crie sua primeira empresa para começar</p>
      </div>
    </div>
  );
}
