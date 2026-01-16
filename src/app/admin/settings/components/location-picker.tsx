"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { MapPin, Search, Loader2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import { Autocomplete } from '@react-google-maps/api';
import { useGoogleMaps, GOOGLE_MAPS_API_KEY } from '@/contexts/google-maps-context';

interface LocationPickerProps {
  address: string;
  latitude?: number;
  longitude?: number;
  onLocationChange: (location: {
    address: string;
    latitude?: number;
    longitude?: number;
  }) => void;
}

// Importar el mapa dinámicamente para evitar errores de SSR
const MapComponent = dynamic(
  () => import('./map-component'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
);

export function LocationPicker({
  address,
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState(address);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useGoogleMaps();

  // Actualizar searchQuery cuando cambia address externamente
  useEffect(() => {
    if (address) {
      setSearchQuery(address);
    }
  }, [address]);

  // Manejar selección del autocomplete de Google Places
  const onPlaceSelected = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formattedAddress = place.formatted_address || place.name || '';

        setSearchQuery(formattedAddress);
        onLocationChange({
          address: formattedAddress,
          latitude: lat,
          longitude: lng,
        });
      }
    }
  }, [onLocationChange]);

  // Buscar ubicación usando Google Geocoding API
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      if (isLoaded && GOOGLE_MAPS_API_KEY) {
        // Usar Google Geocoding API
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: searchQuery }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const result = results[0];
            const lat = result.geometry.location.lat();
            const lng = result.geometry.location.lng();

            setSearchQuery(result.formatted_address);
            onLocationChange({
              address: result.formatted_address,
              latitude: lat,
              longitude: lng,
            });
          } else {
            onLocationChange({
              address: searchQuery,
              latitude: undefined,
              longitude: undefined,
            });
          }
          setIsSearching(false);
        });
      } else {
        // Fallback a Nominatim si no hay API de Google
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
          { headers: { 'Accept-Language': 'es' } }
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const result = data[0];
          onLocationChange({
            address: result.display_name || searchQuery,
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
          });
          setSearchQuery(result.display_name || searchQuery);
        }
        setIsSearching(false);
      }
    } catch (error) {
      console.error('Error buscando ubicación:', error);
      setIsSearching(false);
    }
  }, [searchQuery, onLocationChange, isLoaded]);

  // Obtener ubicación actual del dispositivo
  const handleUseCurrentLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    const isSecureContext = window.isSecureContext ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (!isSecureContext) {
      alert('La geolocalización solo funciona en conexiones seguras (HTTPS) o en localhost.\n\nPuedes buscar la dirección manualmente o hacer clic en el mapa para seleccionar tu ubicación.');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;

        try {
          if (isLoaded && GOOGLE_MAPS_API_KEY) {
            // Usar Google Reverse Geocoding
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                const newAddress = results[0].formatted_address;
                setSearchQuery(newAddress);
                onLocationChange({
                  address: newAddress,
                  latitude: lat,
                  longitude: lng,
                });
              } else {
                onLocationChange({
                  address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                  latitude: lat,
                  longitude: lng,
                });
              }
              setIsGettingLocation(false);
            });
          } else {
            // Fallback a Nominatim
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
              { headers: { 'Accept-Language': 'es' } }
            );
            const data = await response.json();
            const newAddress = data.display_name || `${lat}, ${lng}`;
            setSearchQuery(newAddress);
            onLocationChange({
              address: newAddress,
              latitude: lat,
              longitude: lng,
            });
            setIsGettingLocation(false);
          }
        } catch {
          onLocationChange({
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            latitude: lat,
            longitude: lng,
          });
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        let errorMessage = 'No se pudo obtener tu ubicación.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso denegado. Por favor, permite el acceso a tu ubicación.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Ubicación no disponible. Intenta de nuevo más tarde.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado. Intenta de nuevo.';
            break;
        }

        alert(errorMessage + '\n\nPuedes buscar la dirección manualmente o hacer clic en el mapa.');
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [onLocationChange, isLoaded]);

  // Manejar clic en el mapa - Reverse Geocoding
  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    try {
      if (isLoaded && GOOGLE_MAPS_API_KEY) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const newAddress = results[0].formatted_address;
            setSearchQuery(newAddress);
            onLocationChange({
              address: newAddress,
              latitude: lat,
              longitude: lng,
            });
          } else {
            onLocationChange({
              address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
              latitude: lat,
              longitude: lng,
            });
          }
        });
      } else {
        // Fallback a Nominatim
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          { headers: { 'Accept-Language': 'es' } }
        );
        const data = await response.json();
        const newAddress = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setSearchQuery(newAddress);
        onLocationChange({
          address: newAddress,
          latitude: lat,
          longitude: lng,
        });
      }
    } catch {
      onLocationChange({
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        latitude: lat,
        longitude: lng,
      });
    }
  }, [onLocationChange, isLoaded]);

  // Valores por defecto (Perú, Lima)
  const mapCenter = useMemo(() => ({
    lat: latitude || -12.0464,
    lng: longitude || -77.0428,
  }), [latitude, longitude]);

  const markerPosition = useMemo(() => {
    if (latitude && longitude) {
      return { lat: latitude, lng: longitude };
    }
    return null;
  }, [latitude, longitude]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Buscar Dirección</Label>
        <div className="flex gap-2">
          {isLoaded && GOOGLE_MAPS_API_KEY ? (
            // Input con Autocomplete de Google Places
            <div className="flex-1 relative">
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocompleteRef.current = autocomplete;
                }}
                onPlaceChanged={onPlaceSelected}
                options={{
                  componentRestrictions: { country: 'pe' },
                  types: ['geocode'],
                }}
              >
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Escribe una dirección..."
                  className="pr-10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                />
              </Autocomplete>
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          ) : (
            // Input normal sin autocomplete
            <div className="flex-1 relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Escribe una dirección..."
                className="pr-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          )}
          <Button
            type="button"
            variant="secondary"
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {isLoaded && GOOGLE_MAPS_API_KEY
            ? "Escribe y selecciona de las sugerencias, o haz clic en el mapa"
            : "Escribe la dirección y presiona buscar, o haz clic en el mapa"
          }
        </p>
      </div>

      {/* Mapa */}
      <div className="rounded-lg overflow-hidden border">
        <MapComponent
          center={mapCenter}
          markerPosition={markerPosition}
          onMapClick={handleMapClick}
        />
      </div>

      {/* Botón de ubicación actual */}
      <Button
        type="button"
        variant="outline"
        onClick={handleUseCurrentLocation}
        disabled={isGettingLocation}
        className="w-full"
      >
        {isGettingLocation ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Obteniendo ubicación...
          </>
        ) : (
          <>
            <Navigation className="h-4 w-4 mr-2" />
            Usar mi ubicación actual
          </>
        )}
      </Button>

      {/* Mostrar coordenadas si existen */}
      {latitude && longitude && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <MapPin className="h-4 w-4 text-primary" />
          <span>
            Coordenadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </span>
        </div>
      )}
    </div>
  );
}

