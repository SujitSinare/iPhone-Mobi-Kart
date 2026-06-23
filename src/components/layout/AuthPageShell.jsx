const authBackground =
  'linear-gradient(120deg, rgba(15, 118, 110, 0.9), rgba(17, 24, 39, 0.82)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 800\'%3E%3Crect width=\'1200\' height=\'800\' fill=\'%23111827\'/%3E%3Cg fill=\'none\' stroke=\'%23ffffff\' stroke-opacity=\'0.22\' stroke-width=\'3\'%3E%3Crect x=\'120\' y=\'110\' width=\'210\' height=\'420\' rx=\'34\'/%3E%3Crect x=\'380\' y=\'230\' width=\'180\' height=\'360\' rx=\'30\'/%3E%3Crect x=\'710\' y=\'90\' width=\'230\' height=\'460\' rx=\'38\'/%3E%3Crect x=\'970\' y=\'250\' width=\'160\' height=\'320\' rx=\'28\'/%3E%3C/g%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.16\'%3E%3Ccircle cx=\'225\' cy=\'478\' r=\'16\'/%3E%3Ccircle cx=\'470\' cy=\'548\' r=\'13\'/%3E%3Ccircle cx=\'825\' cy=\'500\' r=\'17\'/%3E%3Ccircle cx=\'1050\' cy=\'532\' r=\'12\'/%3E%3C/g%3E%3Cg fill=\'%2314b8a6\' fill-opacity=\'0.28\'%3E%3Ccircle cx=\'240\' cy=\'180\' r=\'70\'/%3E%3Ccircle cx=\'670\' cy=\'690\' r=\'150\'/%3E%3Ccircle cx=\'1030\' cy=\'120\' r=\'110\'/%3E%3C/g%3E%3C/svg%3E")';

export function AuthPageShell({ eyebrow, title, subtitle, children }) {
  return (
    <section
      className="relative flex min-h-[calc(100vh-65px)] items-center justify-center overflow-hidden bg-cover bg-center px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: authBackground }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.28),transparent_28%)]" />
      <div className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
        <div className="hidden text-white lg:block">
          <p className="text-sm font-bold uppercase tracking-wide text-teal-100">{eyebrow}</p>
          <h1 className="mt-4 max-w-md text-2xl font-black leading-tight">{title}</h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-teal-50">{subtitle}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
