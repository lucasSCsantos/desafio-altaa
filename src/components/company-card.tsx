'use client';

// import type { Company } from '@/lib/mock-data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { Company } from '@/types/api';

interface CompanyCardProps {
  company: Company;
  onSelect: () => void;
}

export function CompanyCard({ company, onSelect }: CompanyCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-blue-200 dark:from-primary/30 dark:to-blue-900 flex items-center justify-center text-2xl">
          {company.logo}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{company.name}</h3>

      <div className="flex items-center gap-2 text-muted-foreground mb-6 flex-1">
        <Users className="h-4 w-4" />
        <span className="text-sm">
          {company?.membersCount || 1} {company?.membersCount > 1 ? 'membros' : 'membro'}
        </span>
      </div>

      <Button
        onClick={onSelect}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Selecionar
      </Button>
    </Card>
  );
}
