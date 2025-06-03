import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

async function loadFlyonUI() {
  return import('flyonui/flyonui');
}

export default function FlyonuiScript() {
  const path = usePathname();

  useEffect(() => {
    const initFlyonUI = async () => {
      await loadFlyonUI();

      const initializeComponents = () => {
        if (
          window.HSStaticMethods &&
          typeof window.HSStaticMethods.autoInit === 'function'
        ) {
          window.HSStaticMethods.autoInit();
        }
      };
      
      setTimeout(initializeComponents, 100);
      setTimeout(initializeComponents, 300);
      setTimeout(initializeComponents, 500);
    };

    initFlyonUI();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (
        window.HSStaticMethods &&
        typeof window.HSStaticMethods.autoInit === 'function'
      ) {
        window.HSStaticMethods.autoInit();
      }
    }, 100);
  }, [path]);

  return null;
}
