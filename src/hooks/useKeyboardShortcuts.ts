import { useEffect } from 'react';

export interface ShortcutHandlers {
  onCompose?: () => void;
  onArchive?: () => void;
  onMarkRead?: () => void;
  onToggleStar?: () => void;
  onNextEmail?: () => void;
  onPrevEmail?: () => void;
  onSearchFocus?: () => void;
  onToggleHelp?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onCompose,
  onArchive,
  onMarkRead,
  onToggleStar,
  onNextEmail,
  onPrevEmail,
  onSearchFocus,
  onToggleHelp,
  onEscape,
  enabled = true,
}: ShortcutHandlers) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      // Allow Escape even when typing to unfocus
      if (event.key === 'Escape') {
        if (isTyping) {
          (target as HTMLElement).blur();
        } else if (onEscape) {
          onEscape();
        }
        return;
      }

      // Check for Cmd+K / Ctrl+K search shortcut even when typing
      if ((event.metaKey || event.ctrlKey) && (event.key.toLowerCase() === 'k')) {
        event.preventDefault();
        onSearchFocus?.();
        return;
      }

      // If user is typing in an input/textarea, ignore single-character shortcuts
      if (isTyping) {
        return;
      }

      // Ignore if other modifier keys are held
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const key = event.key;

      switch (key.toLowerCase()) {
        case 'c':
          event.preventDefault();
          onCompose?.();
          break;
        case 'e':
          event.preventDefault();
          onArchive?.();
          break;
        case 'r':
          event.preventDefault();
          onMarkRead?.();
          break;
        case 's':
          event.preventDefault();
          onToggleStar?.();
          break;
        case 'j':
          event.preventDefault();
          onNextEmail?.();
          break;
        case 'k':
          event.preventDefault();
          onPrevEmail?.();
          break;
        case '/':
          event.preventDefault();
          onSearchFocus?.();
          break;
        case '?':
          event.preventDefault();
          onToggleHelp?.();
          break;
        default:
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            onNextEmail?.();
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            onPrevEmail?.();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    enabled,
    onCompose,
    onArchive,
    onMarkRead,
    onToggleStar,
    onNextEmail,
    onPrevEmail,
    onSearchFocus,
    onToggleHelp,
    onEscape,
  ]);
}
