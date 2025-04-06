'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { signOut, useSession } from 'next-auth/react';
import { CogIcon } from 'lucide-react';
import { AnoAtivoModal } from '../modal/ano-ativo-modal';
import { useState } from 'react';
import { useAnoStore } from '@/stores/useAnoStore';
import { useAnoController } from '@/hooks/use-ano-controller';
export function ParametroNav() {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const { anoAtivo } = useAnoStore()

  if (session) {
    return (<>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon'>
            <CogIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem onClick={() => setModalOpen(true)}>
            Alterar Ano Ativo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AnoAtivoModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
    );
  }
}
