import { create } from 'zustand';
import useClient from '@/hooks/use-client';

type AnoStore = {
  anoAtivo: string | null;
  loading: boolean;
  fetchAnoAtivo: () => Promise<void>;
  setAnoAtivo: (ano: string) => Promise<void>;
  resetAnoAtivo: () => void;
};

const LOCAL_KEY = 'ano_ativo';

export const useAnoStore = create<AnoStore>((set, get) => {
    const client = useClient()
    const storedAno = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_KEY) : null;

    return {
        anoAtivo: storedAno ?? null,
        loading: false,

        fetchAnoAtivo: async () => {
        if (get().anoAtivo) return;

        set({ loading: true });

        try {
            const {
            data: { parametro }
            } = await client.get('/parametro?nome=ano_ativo');

            const ano = parametro?.valor || new Date().getFullYear().toString();
            localStorage.setItem(LOCAL_KEY, ano);
            set({ anoAtivo: ano, loading: false });
        } catch (error) {
            console.error('Erro ao buscar ano ativo:', error);
            set({ loading: false });
        }
    },

    setAnoAtivo: async (ano: string) => {
      try {
        // Atualiza localmente
        localStorage.setItem(LOCAL_KEY, ano);
        set({ anoAtivo: ano });

        // Atualiza no banco de dados
        await client.put('/parametro/ano_ativo', {
          valor: ano
        });
      } catch (error) {
        console.error('Erro ao atualizar ano ativo no banco:', error);
      }
    },

    resetAnoAtivo: () => {
      localStorage.removeItem(LOCAL_KEY);
      set({ anoAtivo: null });
    }
  };
});
