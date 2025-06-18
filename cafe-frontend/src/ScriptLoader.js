import { useEffect } from 'react';

function ScriptLoader({ scripts }) {
  useEffect(() => {
    let isMounted = true;

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true; // важное отличие
        script.crossOrigin = 'anonymous';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
      });
    };

    const loadScriptsSequentially = async () => {
      for (const src of scripts) {
        if (!isMounted) return;
        try {
          await loadScript(src);
        } catch (e) {
          console.error(e);
        }
      }
    };

    // Подождать пока DOM и React полностью отрисует компоненты
    const timeout = setTimeout(() => {
      loadScriptsSequentially();
    }, 300); // подожди 300 мс для уверенности

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      scripts.forEach((src) => {
        document.querySelectorAll(`script[src="${src}"]`).forEach((s) => s.remove());
      });
    };
  }, [scripts]);

  return null;
}

export default ScriptLoader;
