export function LoadingState({ label = 'Loading' }) {
  return (
    <div className="flex min-h-48 items-center justify-center text-sm font-medium text-steel">
      {label}...
    </div>
  );
}
