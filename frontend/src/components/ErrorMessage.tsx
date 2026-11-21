interface ErrorMessageProps {
  mensagem: string | null;
  onFechar?: () => void;
}

export default function ErrorMessage({ mensagem, onFechar }: ErrorMessageProps) {
  if (!mensagem) return null;

  return (
    <div
      role="alert"
      className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <span>{mensagem}</span>
      {onFechar && (
        <button
          onClick={onFechar}
          aria-label="Fechar mensagem de erro"
          className="font-bold leading-none text-red-500 hover:text-red-700"
        >
          ×
        </button>
      )}
    </div>
  );
}