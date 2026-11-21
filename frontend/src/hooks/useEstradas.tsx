import { useCallback, useEffect, useState } from 'react';
import { estradaService, getErrorMessage } from '../services/api';
import type { Estrada } from '../types';

export function useEstradas() {
  const [estradas, setEstradas] = useState<Estrada[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      setEstradas(await estradaService.listar());
    } catch (e) {
      setErro(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { estradas, loading, erro, setErro, recarregar };
}