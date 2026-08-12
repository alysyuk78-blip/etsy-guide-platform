import { useEffect, useRef, useState } from "react";

/**
 * Кастомний курсор: маленький помаранчевий напис «Etsy» замість стрілки.
 * Над кнопками/посиланнями/полями напис плавно «розмивається» в м'яку пляму.
 * Системний курсор приховується у всіх станах (включно з text/resize).
 * Працює лише на пристроях із точним вказівником; на тачскрінах не рендериться.
 */
export function CursorGlow() {
  const [enabled] = useState(
    () =>
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const raf = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest("a, button, input, select, textarea, [role='button'], label");
      dotRef.current?.classList.toggle("cursor-blurred", interactive);
    };

    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.2;
      pos.current.y += (target.current.y - pos.current.y) * 0.2;
      const d = dotRef.current;
      if (d) {
        d.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(loop);
    document.documentElement.classList.add("custom-cursor");

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return <div ref={dotRef} aria-hidden className="cursor-dot" />;
}
