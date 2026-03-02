export default function Loader({ size = 'md', text = '' }) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8" role="status">
      <div
        className={`${sizeClasses[size]} rounded-full border-slate-200 border-t-brand-600 animate-spin`}
        aria-hidden="true"
      />
      {text && <p className="text-sm text-slate-500 font-medium">{text}</p>}
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
