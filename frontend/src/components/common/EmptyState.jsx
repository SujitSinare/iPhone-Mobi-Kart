export function EmptyState({ title, message, action }) {
  return (
    <section className="panel px-6 py-10 text-center">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      {message ? <p className="mx-auto mt-2 max-w-xl text-sm text-steel">{message}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </section>
  );
}
