"use client";

import dynamic from 'next/dynamic';

const MapCamaras = dynamic(() => import('./MapCamaras'), { ssr: false });

export default MapCamaras;

