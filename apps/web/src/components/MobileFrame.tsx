/**
 * On mobile (< md), the app is full-bleed. On larger viewports we
 * constrain everything to an iPhone-sized frame centered on a warm
 * backdrop, so the app always feels like a mobile experience even on
 * desktop. All screens inside should use `h-full` / `min-h-full` so
 * they size to the frame rather than the real viewport.
 */
export function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-cream-50 md:bg-cream-200 md:flex md:items-center md:justify-center md:p-6">
      <div
        className="
          relative h-[100dvh] w-full overflow-hidden bg-cream-50
          md:h-[844px] md:max-h-[calc(100dvh-3rem)] md:w-[390px]
          md:rounded-[2.5rem] md:shadow-soft-lg md:ring-1 md:ring-ink-900/10
        "
      >
        {children}
      </div>
    </div>
  );
}
