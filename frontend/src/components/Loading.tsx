interface LoadingProps {
    texto ?: string;
}

export default function Loading({ texto = 'Carregando...' }: LoadingProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-8 text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
      <span className="text-sm">{texto}</span>
    </div>
  );
}