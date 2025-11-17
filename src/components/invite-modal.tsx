'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Invite, Role } from '@/types/api';
import { toast } from 'sonner';
import { CreateInviteBodySchema } from '@/schemas/invite.schema';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: Partial<Invite>) => void;
  loading: boolean;
}

export function InviteModal({ isOpen, onClose, onInvite, loading }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>(Role.MEMBER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = CreateInviteBodySchema.safeParse({
      email,
      role,
    });

    if (!result.success) {
      const message = result.error.issues[0].message;

      toast.error('Erro', {
        description: message,
      });

      return;
    }

    const payload = result.data;

    onInvite({ ...payload, role: role as Role });

    setEmail('');
    setRole(Role.MEMBER);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Convidar novo membro</DialogTitle>
          <DialogDescription>
            Envie um convite para um novo membro se juntar à sua equipe.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Cargo
            </label>
            <Select value={role} onValueChange={(value) => setRole(value as Role)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="MEMBER">Membro</SelectItem>
              </SelectContent>
            </Select>
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
              {loading ? 'Enviando...' : 'Enviar convite'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
