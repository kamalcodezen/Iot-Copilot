'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AOS from 'aos';

// Initializes AOS exactly once when the app mounts. Because the App Router
// mounts pages after the layout, AOS is re-synced after every navigation so
// freshly rendered elements are observed. `once: true` ensures each element
// animates only on its first appearance.
export default function AOSInit() {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [pathname]);

  return null;
}
