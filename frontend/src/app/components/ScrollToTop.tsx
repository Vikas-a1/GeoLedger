import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset the browser/page scroll
    window.scrollTo(0, 0);

    // Reset the application's main scroll container
    const main = document.querySelector('main');

    if (main) {
      main.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
    }
  }, [pathname]);

  return null;
}