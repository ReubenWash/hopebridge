import { useRef, useEffect } from 'react';

const ReCaptcha = ({ sitekey, onChange }) => {
  const widgetRef = useRef(null);
  const widgetId = useRef(null);

  useEffect(() => {
    if (window.grecaptcha && !widgetId.current) {
      widgetId.current = window.grecaptcha.render(widgetRef.current, {
        sitekey,
        callback: onChange,
      });
    }
  }, [sitekey, onChange]);

  const reset = () => {
    if (widgetId.current) {
      window.grecaptcha.reset(widgetId.current);
    }
  };

  // Expose reset function to parent via ref or callback
  // But we'll handle reset via registering a callback on the form
  return <div ref={widgetRef}></div>;
};

export default ReCaptcha;