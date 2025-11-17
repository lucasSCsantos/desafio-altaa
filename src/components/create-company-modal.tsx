'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Company } from '@/types/api';
import EmojiPicker from './emoji-picker';
import { CreateCompanyBodySchema } from '@/schemas/company.schema';

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: Partial<Company>) => Promise<void>;
  loading: boolean;
}

export function CreateCompanyModal({
  isOpen,
  onClose,
  onCreate,
  loading,
}: CreateCompanyModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = CreateCompanyBodySchema.safeParse({
      name: companyName,
      logo: companyLogo,
    });

    if (!result.success) {
      const message = result.error.issues[0].message;

      toast.error('Erro', {
        description: message,
      });

      return;
    }

    const payload = result.data;

    onCreate(payload);

    setCompanyName('');
    setCompanyLogo('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar nova empresa</DialogTitle>
          <DialogDescription>
            Adicione uma nova empresa à sua conta. Você será o proprietário e poderá convidar
            membros.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="company-name" className="text-sm font-medium">
              Nome da empresa
            </label>
            <Input
              id="company-name"
              placeholder="Ex: Minha Empresa"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="company-logo" className="text-sm font-medium">
              Logo da empresa
            </label>
            <EmojiPicker
              onEmojiSelect={(e) => setCompanyLogo(e)}
              trigger={
                <Input
                  id="company-logo"
                  className="text-left"
                  value={companyLogo}
                  disabled={loading}
                />
              }
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>

            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar empresa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
