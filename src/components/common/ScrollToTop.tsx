import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const location = useLocation();
  const wasModalRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isModal = !!(location.state as { background?: Location })?.background;

    // Don't scroll when opening a modal
    if (isModal) {
      wasModalRef.current = true;
      return;
    }

    // Don't scroll when closing a modal (returning to background page)
    if (wasModalRef.current) {
      wasModalRef.current = false;
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search]);

  return null;
}
