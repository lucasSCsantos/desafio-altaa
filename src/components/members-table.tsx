'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { Member, Role, User } from '@/types/api';

interface MembersTableProps {
  members: Member[];
  onRemove: (memberId: string) => void;
  onChangeRole: (memberId: string, role: Role) => void;
  user: User | null;
  loading: boolean;
}

const roleColors: Record<string, string> = {
  OWNER: 'bg-gradient-to-r from-purple-500 to-pink-500',
  ADMIN: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  MEMBER: 'bg-gradient-to-r from-green-500 to-emerald-500',
};

const roleLabels: Record<string, string> = {
  OWNER: 'Proprietário',
  ADMIN: 'Administrador',
  MEMBER: 'Membro',
};

export function MembersTable({ members = [], onRemove, onChangeRole, user }: MembersTableProps) {
  if (members.length === 0) {
    return <MembersTableEmpty />;
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nome</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Cargo</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Data de Adesão
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.userId}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">{member.user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-muted-foreground text-sm">{member.user.email}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge className={`${roleColors[member.role]} text-white border-0`}>
                    {roleLabels[member.role]}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span className="text-muted-foreground text-sm">
                    {new Intl.DateTimeFormat('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }).format(new Date(member.createdAt))}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {member.role !== 'OWNER' && (
                      <>
                        <Select
                          disabled={user?.role === 'MEMBER'}
                          value={member.role}
                          onValueChange={(value) => onChangeRole(member.userId, value as Role)}
                        >
                          <SelectTrigger className="w-28 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="MEMBER">Membro</SelectItem>
                          </SelectContent>
                        </Select>

                        {user?.role === 'MEMBER' ? null : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemove(member.userId)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function MembersTableEmpty() {
  return (
    <Card className="p-12 flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">Nenhum membro encontrado</p>
        <p className="text-sm text-muted-foreground">Comece convidando membros para sua equipe</p>
      </div>
    </Card>
  );
}

export function MembersTableLoading() {
  return (
    <Card className="p-12 flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">Buscando dados da empresa...</p>
      </div>
    </Card>
  );
}
