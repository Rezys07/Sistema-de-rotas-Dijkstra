import { useCallback, useEffect, useState } from 'react';
import { cidadeService, getErrorMessage } from '../services/api';
import type { Cidade } from '../types';

export function useCidades() {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      setCidades(await cidadeService.listar());
    } catch (e) {
      setErro(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { cidades, loading, erro, setErro, recarregar };
}