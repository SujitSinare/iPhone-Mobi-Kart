import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center">
      <section className="max-w-xl text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-accent">404</p>
        <h1 className="mt-3 text-4xl font-black text-ink">Page not found</h1>
        <p className="mt-3 text-steel">The route you opened is not available in iPhone Mobi Kart.</p>
        <Link to="/" className="btn-primary mt-6">
          Go Home
        </Link>
      </section>
    </main>
  );
}
