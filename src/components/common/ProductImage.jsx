import { useState } from 'react';

export function ProductImage({ src, alt, className }) {
  const [hasError, setHasError] = useState(!src);

  if (hasError) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-teal-50 p-4 text-center`}
        role="img"
        aria-label={alt || 'iPhone Mobi Kart product image'}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-accent">iPhone Mobi Kart</p>
          <p className="mt-2 text-base font-black text-ink">{alt || 'Product Image'}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
