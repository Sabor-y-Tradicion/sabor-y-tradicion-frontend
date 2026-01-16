"use client";

import { useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Loader2, Navigation, MapPin } from 'lucide-react';
import { useGoogleMaps, GOOGLE_MAPS_API_KEY } from '@/contexts/google-maps-context';

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px',
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: true,
  mapTypeControl: false,
  fullscreenControl: true,
};

interface ContactMapProps {
  latitude: number;
  longitude: number;
  address: string;
  restaurantName: string;
}

export default function ContactMap({ latitude, longitude, address, restaurantName }: ContactMapProps) {
  const [showInfoWindow, setShowInfoWindow] = useState(true);
  const { isLoaded, loadError } = useGoogleMaps();

  const position = { lat: latitude, lng: longitude };

  const handleGetDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      '_blank'
    );
  };

  // Si no hay API key, mostrar el mapa de OpenStreetMap como fallback
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="relative h-full w-full min-h-[400px]">
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`}
          style={{ border: 0, width: '100%', height: '100%', minHeight: '400px' }}
          allowFullScreen
          loading="lazy"
          title={`Ubicación de ${restaurantName}`}
        />
        <button
          onClick={handleGetDirections}
          className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md shadow-lg hover:bg-primary/90 transition-colors"
        >
          <Navigation className="h-4 w-4" />
          Cómo llegar
        </button>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-full w-full min-h-[400px] bg-red-50 dark:bg-red-900/20 flex flex-col items-center justify-center">
        <MapPin className="h-12 w-12 text-red-400 mb-2" />
        <p className="text-sm text-red-600 dark:text-red-400">Error al cargar el mapa</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full w-full min-h-[400px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={16}
      options={mapOptions}
    >
      <Marker
        position={position}
        onClick={() => setShowInfoWindow(true)}
        animation={google.maps.Animation.DROP}
      />

      {showInfoWindow && (
        <InfoWindow
          position={position}
          onCloseClick={() => setShowInfoWindow(false)}
        >
          <div className="p-2 min-w-[180px]">
            <h3 className="font-semibold text-gray-900 mb-1">{restaurantName}</h3>
            <p className="text-xs text-gray-600 mb-3">{address}</p>
            <button
              onClick={handleGetDirections}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Navigation className="h-4 w-4" />
              Cómo llegar
            </button>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

