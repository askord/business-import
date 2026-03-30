import { useCallback } from "react";

export function useSmoothScroll() {
  const scrollToSection = useCallback((sectionId:string,position:ScrollLogicalPosition = 'start') => {
    const element = document.getElementById(sectionId);

		console.log(element,position)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: position
      });
    }
  }, []);

  return scrollToSection;
}