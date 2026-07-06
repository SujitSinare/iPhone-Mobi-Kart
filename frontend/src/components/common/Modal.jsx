export function Modal({ title, children, onClose, fullWidth = true }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 px-4 py-6">
      <div className={` ${fullWidth ? 'w-full' : ''} max-w-3xl overflow-hidden rounded-lg bg-white shadow-soft`}>
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <button
            className="btn-secondary min-h-9 px-3"
            type="button"
            onClick={onClose}
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
