import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ScrollToTop() {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        // Snap to top synchronously before React paints the new page
        window.scrollTo(0, 0);
        // Refresh ScrollTrigger positions after navigation
        ScrollTrigger.refresh();
    }, [pathname]);

    return null;
}
