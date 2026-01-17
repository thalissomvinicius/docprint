import React from 'react';

export type ViewState = 'HOME' | 'UPLOAD' | 'EDITOR' | 'COMPOSER' | 'EXPORT' | 'CONTRACTS' | 'CONTRACT_FORM';
export type NavState = 'ABOUT' | 'DASHBOARD' | 'DOCPRINT' | 'INDICES' | 'CONTRACTS' | 'RECEIPT' | 'DOWNLOADER' | 'CALCULATOR' | 'CONVERTER' | 'QRCODE' | 'NEWS';

export interface Point {
  x: number;
  y: number;
}

export interface DocImage {
  id: string;
  src: string; // DataURL
  width: number;
  height: number;
  rotation: number; // 0, 90, 180, 270
  filters: {
    brightness: number; // -100 to 100
    contrast: number; // -100 to 100
    grayscale: number; // 0 to 100
    threshold: number; // 0 to 255 (0 = off)
    autoEnhance: boolean; // "Magic" filter
  };
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  cropPoints?: Point[]; // [TL, TR, BR, BL]
}

export interface ComposedItem {
  id: string;
  imageId: string;
  x: number; // Position on A4 in px (300DPI scale or normalized)
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
}

export interface ToolPlugin {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export interface EconomicIndex {
  id: string;
  name: string;
  fullName: string;
  description: string;
  bcbSeriesId?: number; // ID for Central Bank API
  values?: Record<string, number>; // "YYYY-MM": value
}

// Toast Notification Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // milliseconds, default 5000
}