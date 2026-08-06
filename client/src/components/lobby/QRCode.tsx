import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

// ============================================================
// QRCode — QR code for joining game via scan
// ============================================================

interface QRCodeProps {
  pin: string;
}

export function QRCode({ pin }: QRCodeProps) {
  const url = `${window.location.origin}/join?pin=${pin}`;

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-3">Scan to Join</p>
      <div className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-surface-100">
        <QRCodeSVG
          value={url}
          size={140}
          bgColor="#FFFFFF"
          fgColor="#1A1D26"
          level="M"
        />
      </div>
    </div>
  );
}
