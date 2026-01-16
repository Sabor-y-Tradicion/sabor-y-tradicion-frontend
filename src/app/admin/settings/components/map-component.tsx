"use client";

import { useCallback } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Loader2, MapPin } from 'lucide-react';
import { useGoogleMaps, GOOGLE_MAPS_API_KEY } from '@/contexts/google-maps-context';

interface MapComponentProps {
  center: {
    lat: number;
    lng: number;
  };
  markerPosition: {
    lat: number;
    lng: number;
  } | null;
  onMapClick: (lat: number, lng: number) => void;
}

const containerStyle = {
  width: '100%',
  height: '300px',
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

export default function MapComponent({ center, markerPosition, onMapClick }: MapComponentProps) {
  const { isLoaded, loadError } = useGoogleMaps();

  const handleClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onMapClick(e.latLng.lat(), e.latLng.lng());
    }
  }, [onMapClick]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="h-[300px] bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center rounded-lg">
        <MapPin className="h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground text-center px-4">
          Configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY en .env.local
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-[300px] bg-red-50 dark:bg-red-900/20 flex items-center justify-center rounded-lg">
        <p className="text-red-600 dark:text-red-400">Error cargando el mapa</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[300px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markerPosition || center}
      zoom={15}
      onClick={handleClick}
      options={mapOptions}
    >
      {markerPosition && (
        <Marker
          position={markerPosition}
          animation={google.maps.Animation.DROP}
        />
      )}
    </GoogleMap>
  );
}

