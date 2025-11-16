import { Company } from '@/types/api';

interface CompanyHeroProps {
  company: Company | null;
  loading: boolean;
}

export function CompanyHero({ company, loading }: CompanyHeroProps) {
  if (loading || !company) {
    return <CompanyHeroLoading />;
  }

  if (!loading && !company) {
    return <CompanyHeroEmpty />;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-blue-200 dark:from-primary/30 dark:to-blue-900 flex items-center justify-center text-4xl">
          {company?.logo}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{company?.name}</h1>
          <p className="text-muted-foreground">Gerenciar membros e configurações da empresa</p>
        </div>
      </div>
    </div>
  );
}

function CompanyHeroLoading() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-blue-200 dark:from-primary/30 dark:to-blue-900 flex items-center justify-center text-4xl">
          <div className="w-10 h-10 bg-muted-foreground/20 rounded animate-pulse"></div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Carregando...</h1>
          <p className="text-muted-foreground">Gerenciar membros e configurações da empresa</p>
        </div>
      </div>
    </div>
  );
}

function CompanyHeroEmpty() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-blue-200 dark:from-primary/30 dark:to-blue-900 flex items-center justify-center text-4xl">
          <div className="w-10 h-10 bg-muted-foreground/20 rounded"></div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nenhuma Empresa</h1>
          <p className="text-muted-foreground">Gerenciar membros e configurações da empresa</p>
        </div>
      </div>
    </div>
  );
}
