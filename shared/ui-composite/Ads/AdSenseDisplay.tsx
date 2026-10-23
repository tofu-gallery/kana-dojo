'use client';

// Modified by Tofu (tofu-gallery/kana-dojo) on 2026-10-23: ads are switched off
// for good in copies (`isAdSenseEnabled` below is always false), so no ad slot
// for the upstream site's AdSense account is ever rendered. See TOFU.md.

import { useEffect, useRef } from 'react';

const ADSENSE_CLIENT_ID = 'ca-pub-5494430364707020';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, never>>;
  }
}

interface AdSenseDisplayProps {
  slot: string;
  className?: string;
}

const isAdSenseEnabled = false;

export default function AdSenseDisplay({
  slot,
  className,
}: AdSenseDisplayProps) {
  const hasRequestedAd = useRef(false);

  useEffect(() => {
    if (!isAdSenseEnabled || !slot || hasRequestedAd.current) return;

    hasRequestedAd.current = true;
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  }, [slot]);

  if (!isAdSenseEnabled || !slot) return null;

  return (
    <ins
      className={`adsbygoogle block w-full ${className ?? ''}`}
      style={{ display: 'block' }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format='auto'
      data-full-width-responsive='true'
      aria-label='Advertisement'
    />
  );
}
