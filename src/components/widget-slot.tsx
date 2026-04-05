type WidgetSlotProps = {
  id: string;
  title: string;
  description: string;
  minHeight?: string;
  "data-widget-kind"?: string;
};

/**
 * Stable DOM region for SaaS embeds (chat, analytics, NPS, billing portals).
 * Embed scripts can target `[data-widget-region]` or the explicit `id`.
 */
export function WidgetSlot({
  id,
  title,
  description,
  minHeight = "min-h-[120px]",
  "data-widget-kind": kind,
}: WidgetSlotProps) {
  return (
    <section
      id={id}
      data-widget-region={id}
      data-widget-kind={kind}
      className={`rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/80 p-6 dark:border-zinc-700 dark:bg-zinc-900/40 ${minHeight}`}
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
        Empty by design — inject your vendor script, iframe, or web component here in production.
      </p>
    </section>
  );
}
