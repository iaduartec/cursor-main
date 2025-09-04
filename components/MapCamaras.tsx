"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

type Cam = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  youtubeId: string;
};

// Coordenadas aproximadas de los núcleos urbanos
const cams: Cam[] = [
  { slug: 'silos', name: 'Santo Domingo de Silos', lat: 41.9632, lng: -3.4168, youtubeId: 'czwL7LgjyjU' },
  { slug: 'rabanera-del-pinar', name: 'Rabanera del Pinar', lat: 41.8783, lng: -3.2243, youtubeId: '2FLLNsHmgxc' },
  { slug: 'pineda-de-la-sierra', name: 'Pineda de la Sierra', lat: 42.2377, lng: -3.3073, youtubeId: 'MqU3cNr22XQ' },
  { slug: 'huerta-de-arriba', name: 'Huerta de Arriba', lat: 42.0973, lng: -3.0539, youtubeId: 'Kv2HeXZXWaw' },
];

export default function MapCamaras() {
  const mapProps: any = { center: [42.15, -3.35], zoom: 9 };
  return (
    <div className="w-full h-[480px] rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700">
      <MapContainer {...mapProps} className="w-full h-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {cams.map((c) => (
          <CircleMarker key={c.slug} {...({ center: [c.lat, c.lng], radius: 10, pathOptions: { color: '#0ea5e9', fillColor: '#0ea5e9', fillOpacity: 0.85 } } as any)}>
            <Popup>
              <div className="space-y-3 w-72">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-primary">{c.name}</div>
                </div>

                <div className="relative w-full aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${c.youtubeId}`}
                    title={c.name}
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full rounded-md"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <a href={`https://www.youtube.com/watch?v=${c.youtubeId}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">Ver en YouTube</a>
                  <Link href={`/streaming/${c.slug}`} className="text-accent hover:underline font-medium">Ver cámara</Link>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
