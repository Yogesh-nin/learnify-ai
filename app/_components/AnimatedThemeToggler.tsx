"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { cn } from "../../lib/utils";

function getCircleClipPaths(
  x: number,
  y: number,
  maxRadius: number
): [string, string] {
  return [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${maxRadius}px at ${x}px ${y}px)`,
  ];
}

function applyDomTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
}

export function AnimatedThemeToggler({
  className,
  duration = 500,
  ...props
}: AnimatedThemeTogglerProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [iconDark, setIconDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIconDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const nextDark = !iconDark;
    const nextTheme = nextDark ? "dark" : "light";

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const { top, left, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;

    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    );

    const runThemeUpdate = () => {
      applyDomTheme(nextDark);
      setTheme(nextTheme);
      setIconDark(nextDark);
    };

    if (typeof document.startViewTransition !== "function") {
      runThemeUpdate();
      return;
    }

    const syncTheme = () => {
      applyDomTheme(nextDark);
      setTheme(nextTheme);
    };

    const clipPath = getCircleClipPaths(x, y, maxRadius);
    const root = document.documentElement;

    root.dataset.themeVt = "active";
    root.style.setProperty("--theme-vt-clip-from", clipPath[0]);

    const cleanup = () => {
      delete root.dataset.themeVt;
      root.style.removeProperty("--theme-vt-clip-from");
    };

    const transition = document.startViewTransition(() => {
      flushSync(syncTheme);
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath },
          {
            duration,
            easing: "ease-in-out",
            fill: "forwards",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {});

    transition.finished
      .then(() => setIconDark(nextDark))
      .finally(cleanup);
  }, [duration, iconDark, setTheme]);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-hidden
        className={cn(
          "fixed bottom-6 right-6 z-[100] h-12 w-12 rounded-full border border-border bg-surface shadow-lg",
          className
        )}
      />
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      className={cn(
        "fixed bottom-6 right-6 z-[100] flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-lg transition-colors hover:bg-surface-hover",
        className
      )}
      aria-label={iconDark ? "Switch to light mode" : "Switch to dark mode"}
      title={iconDark ? "Light mode" : "Dark mode"}
      {...props}
    >
      {iconDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
