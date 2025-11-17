'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CompanyHeader } from '@/components/company-header';
import { MembersTable } from '@/components/members-table';
import { InviteModal } from '@/components/invite-modal';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { getCompany } from '@/lib/data';
import { useSession } from '@/hooks/useSession';
import { DeleteModal } from '@/components/delete-modal';
import { Company, Invite, Member, Role } from '@/types/api';
import { useCompanyActions } from '@/hooks/useCompanyActions';
import { CompanyHero } from '@/components/company-hero';

export default function CompanyPage() {
  const params = useParams();
  const user = useSession();

  const companyId = params.id as string;
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    loading,
    inviteMember,
    deleteCompany,
    removeMember,
    changeRole,
    getCompany,
    company,
    members,
  } = useCompanyActions(companyId);

  useEffect(() => {
    getCompany();
  }, []);

  const handleInviteMember = async (data: Partial<Invite>) => await inviteMember(data);

  const handleDeleteCompany = async () => await deleteCompany();

  const handleRemoveMember = async (memberId: string) => await removeMember(memberId);

  const handleChangeRole = async (memberId: string, role: Role) => await changeRole(memberId, role);

  return (
    <div className="min-h-screen bg-background">
      <CompanyHeader userName={user?.name || ''} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Info */}
        <CompanyHero company={company} loading={loading.gettingCompany} />

        {/* Members Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Membros</h2>
              <p className="text-muted-foreground">
                {company?.memberships.length} membros na empresa
              </p>
            </div>
            <div className="gap-2 flex">
              {user?.role === 'MEMBER' ? null : (
                <Button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  Convidar Usuário
                </Button>
              )}
              {user?.role !== 'OWNER' ? null : (
                <Button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="gap-2 bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Apagar empresa
                </Button>
              )}
            </div>
          </div>

          <MembersTable
            members={members}
            onRemove={handleRemoveMember}
            onChangeRole={handleChangeRole}
            user={user}
            loading={loading.changingRoleId}
          />
        </div>

        {/* Invite Modal */}
        <InviteModal
          loading={loading.inviting}
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onInvite={handleInviteMember}
        />

        {/* Delete Company Modal */}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteCompany}
        />
      </main>
    </div>
  );
}
