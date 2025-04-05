'use client';
import { useState } from 'react';
import { useAnoStore } from '@/stores/useAnoStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AnoAtivoModal({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { anoAtivo, setAnoAtivo, resetAnoAtivo } = useAnoStore();
  const [anoTemp, setAnoTemp] = useState(anoAtivo ?? '');

  const handleSalvar = () => {
    if (anoTemp.trim() !== '') {
      setAnoAtivo(anoTemp.trim());
      onOpenChange(false);
    }
  };

  const handleReset = () => {
    resetAnoAtivo();
    setAnoTemp('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar Ano Ativo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="text"
            value={anoTemp}
            onChange={(e) => setAnoTemp(e.target.value)}
            placeholder="Digite o ano (ex: 2025)"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={handleReset}>
              Restaurar padrão
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
