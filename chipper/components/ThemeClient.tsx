'use client';

import { useEffect } from 'react';

export default function ThemeClient() {
  useEffect(() => {
    document.body.setAttribute('data-theme', 'corporate');
    document.body.classList.add('chromane-sonic-dark');
  }, []);

  return null;
}
