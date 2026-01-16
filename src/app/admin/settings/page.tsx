"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import { useTenant } from "@/contexts/tenant-context";
import { Save, Plus, X as XIcon, MapPin, Palette } from "lucide-react";
import { LocationPicker } from "./components/location-picker";
import { HoursSchedule } from "./components/hours-schedule";
import { LogoUpload } from "./components/logo-upload";
import type { TenantHours, TenantSocialNetwork } from "@/types/tenant";
import type { Theme } from "@/hooks/use-theme";

// Default hours template
const defaultHours: TenantHours[] = [
  { day: 'monday', open: '09:00', close: '22:00', closed: false },
  { day: 'tuesday', open: '09:00', close: '22:00', closed: false },
  { day: 'wednesday', open: '09:00', close: '22:00', closed: false },
  { day: 'thursday', open: '09:00', close: '22:00', closed: false },
  { day: 'friday', open: '09:00', close: '22:00', closed: false },
  { day: 'saturday', open: '09:00', close: '23:00', closed: false },
  { day: 'sunday', open: '', close: '', closed: true },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, changeTheme } = useTheme();
  const { tenant, loading, updateTenantSettings } = useTenant();

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("restaurant");

  // Restaurant Info
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: tenant?.name || "",
    slogan: tenant?.settings?.slogan || "",
    description: tenant?.settings?.description || "",
    longDescription: tenant?.settings?.longDescription || "",
    phone: tenant?.settings?.phone || "",
    email: tenant?.settings?.email || "",
    logo: tenant?.settings?.logo || "",
  });

  // Location
  const [location, setLocation] = useState({
    address: tenant?.settings?.location?.address || "",
    latitude: tenant?.settings?.location?.latitude,
    longitude: tenant?.settings?.location?.longitude,
    city: tenant?.settings?.location?.city || "",
    state: tenant?.settings?.location?.state || "",
    country: tenant?.settings?.location?.country || "Perú",
    postalCode: tenant?.settings?.location?.postalCode || "",
  });

  const [hours, setHours] = useState<TenantHours[]>(
    tenant?.settings?.hours || defaultHours
  );

  // Social Media
  const [socialMedia, setSocialMedia] = useState<{
    whatsapp: string;
    socialNetworks: TenantSocialNetwork[];
  }>(() => {
    // Obtener el número de WhatsApp y limpiar el +51 si existe
    const savedWhatsapp = tenant?.settings?.whatsapp || "";
    const cleanWhatsapp = savedWhatsapp.replace(/^\+51/, "").replace(/\D/g, "");

    return {
      whatsapp: cleanWhatsapp ? `+51${cleanWhatsapp}` : "+51",
      socialNetworks: tenant?.settings?.socialNetworks || [],
    };
  });

  // Personalization
  const [personalization, setPersonalization] = useState({
    primaryColor: tenant?.settings?.colors?.primary || "#ff6b35",
    secondaryColor: tenant?.settings?.colors?.secondary || "#f7931e",
    accentColor: tenant?.settings?.colors?.accent || "#c1121f",
    font: tenant?.settings?.font || "Inter",
  });

  // Preferences
  const [preferences, setPreferences] = useState<{ theme: Theme }>({
    theme: theme,
  });

  // Update local state when tenant changes
  useEffect(() => {
    if (tenant) {
      setRestaurantInfo({
        name: tenant.name,
        slogan: tenant.settings?.slogan || "",
        description: tenant.settings?.description || "",
        longDescription: tenant.settings?.longDescription || "",
        phone: tenant.settings?.phone || "",
        email: tenant.settings?.email || "",
        logo: tenant.settings?.logo || "",
      });

      setLocation({
        address: tenant.settings?.location?.address || "",
        latitude: tenant.settings?.location?.latitude,
        longitude: tenant.settings?.location?.longitude,
        city: tenant.settings?.location?.city || "",
        state: tenant.settings?.location?.state || "",
        country: tenant.settings?.location?.country || "Perú",
        postalCode: tenant.settings?.location?.postalCode || "",
      });

      setHours(tenant.settings?.hours || defaultHours);

      // Limpiar WhatsApp de cualquier formato incorrecto
      const savedWhatsapp = tenant.settings?.whatsapp || "";
      const cleanWhatsapp = savedWhatsapp.replace(/^\+51/, "").replace(/\D/g, "");

      setSocialMedia({
        whatsapp: cleanWhatsapp ? `+51${cleanWhatsapp}` : "+51",
        socialNetworks: tenant.settings?.socialNetworks || [],
      });

      setPersonalization({
        primaryColor: tenant.settings?.colors?.primary || "#ff6b35",
        secondaryColor: tenant.settings?.colors?.secondary || "#f7931e",
        accentColor: tenant.settings?.colors?.accent || "#c1121f",
        font: tenant.settings?.font || "Inter",
      });
    }
  }, [tenant]);

  const handleSaveRestaurantInfo = async () => {
    setIsSaving(true);
    try {
      await updateTenantSettings({
        slogan: restaurantInfo.slogan,
        description: restaurantInfo.description,
        longDescription: restaurantInfo.longDescription,
        phone: restaurantInfo.phone,
        email: restaurantInfo.email,
        logo: restaurantInfo.logo,
      });

      toast({
        title: "Cambios guardados",
        description: "La información del restaurante ha sido actualizada",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar los cambios",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLocation = async () => {
    setIsSaving(true);
    try {
      await updateTenantSettings({
        location: {
          address: location.address,
          latitude: location.latitude,
          longitude: location.longitude,
          city: location.city,
          state: location.state,
          country: location.country,
          postalCode: location.postalCode,
        },
        hours: hours,
      });

      toast({
        title: "Ubicación guardada",
        description: "La ubicación y horarios han sido actualizados",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la ubicación",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSocialMedia = async () => {
    setIsSaving(true);
    try {
      await updateTenantSettings({
        whatsapp: socialMedia.whatsapp,
        socialNetworks: socialMedia.socialNetworks,
      });

      toast({
        title: "Cambios guardados",
        description: "Las redes sociales han sido actualizadas",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar los cambios",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePersonalization = async () => {
    setIsSaving(true);
    try {
      await updateTenantSettings({
        colors: {
          primary: personalization.primaryColor,
          secondary: personalization.secondaryColor,
          accent: personalization.accentColor,
        },
        font: personalization.font,
      });

      toast({
        title: "Personalización guardada",
        description: "Los estilos han sido actualizados. Recarga la página para ver los cambios.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la personalización",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = () => {
    changeTheme(preferences.theme);
    toast({
      title: "Preferencias guardadas",
      description: "Tus preferencias han sido actualizadas",
    });
  };

  const handleAddSocialNetwork = () => {
    const newNetwork = {
      id: Date.now().toString(),
      name: 'instagram' as const,
      url: '',
      icon: 'instagram',
    };
    setSocialMedia(prev => ({
      ...prev,
      socialNetworks: [...(prev.socialNetworks || []), newNetwork],
    }));
  };

  const handleRemoveSocialNetwork = (id: string) => {
    setSocialMedia(prev => ({
      ...prev,
      socialNetworks: (prev.socialNetworks || []).filter((n: TenantSocialNetwork) => n.id !== id),
    }));
  };

  const handleUpdateSocialNetwork = (id: string, field: string, value: string) => {
    setSocialMedia(prev => ({
      ...prev,
      socialNetworks: (prev.socialNetworks || []).map((n: TenantSocialNetwork) =>
        n.id === id ? { ...n, [field]: value } : n
      ),
    }));
  };

  // Mostrar skeleton mientras carga
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-56 mb-2" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona la configuración de tu restaurante
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="restaurant">Restaurante</TabsTrigger>
          <TabsTrigger value="location">Ubicación</TabsTrigger>
          <TabsTrigger value="social">Redes Sociales</TabsTrigger>
          <TabsTrigger value="personalization">Personalización</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
        </TabsList>

        {/* Restaurant Tab */}
        <TabsContent value="restaurant" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del Restaurante</CardTitle>
              <CardDescription>
                Información básica que se mostrará en tu sitio web
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Restaurante</Label>
                <Input
                  id="name"
                  value={restaurantInfo.name}
                  disabled
                  className="bg-gray-50 dark:bg-gray-900"
                />
                <p className="text-xs text-muted-foreground">
                  El nombre solo puede ser cambiado por el SuperAdmin
                </p>
              </div>

              {/* Logo Upload */}
              <div className="pt-4 border-t">
                <LogoUpload
                  value={restaurantInfo.logo}
                  onChange={(value) => setRestaurantInfo(prev => ({ ...prev, logo: value }))}
                  label="Logo del Restaurante"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slogan">Slogan</Label>
                <Input
                  id="slogan"
                  placeholder="Ej: Cocina tradicional chachapoyana"
                  value={restaurantInfo.slogan}
                  onChange={(e) => setRestaurantInfo(prev => ({ ...prev, slogan: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción Corta</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción breve para el home y footer"
                  value={restaurantInfo.description}
                  onChange={(e) => setRestaurantInfo(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longDescription">Historia / Descripción Larga</Label>
                <Textarea
                  id="longDescription"
                  placeholder="Historia detallada para la página 'Sobre Nosotros'"
                  value={restaurantInfo.longDescription}
                  onChange={(e) => setRestaurantInfo(prev => ({ ...prev, longDescription: e.target.value }))}
                  rows={6}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    placeholder="+51 941 234 567"
                    value={restaurantInfo.phone}
                    onChange={(e) => setRestaurantInfo(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contacto@restaurante.com"
                    value={restaurantInfo.email}
                    onChange={(e) => setRestaurantInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <Button onClick={handleSaveRestaurantInfo} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ubicación y Horarios
              </CardTitle>
              <CardDescription>
                Configura la ubicación física y horarios de atención
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dirección</h3>

                <LocationPicker
                  address={location.address}
                  latitude={location.latitude}
                  longitude={location.longitude}
                  onLocationChange={(newLocation) => setLocation(prev => ({ ...prev, ...newLocation }))}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      placeholder="Chachapoyas"
                      value={location.city}
                      onChange={(e) => setLocation(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Región/Departamento</Label>
                    <Input
                      id="state"
                      placeholder="Amazonas"
                      value={location.state}
                      onChange={(e) => setLocation(prev => ({ ...prev, state: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      placeholder="Perú"
                      value={location.country}
                      onChange={(e) => setLocation(prev => ({ ...prev, country: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Código Postal</Label>
                    <Input
                      id="postalCode"
                      placeholder="01001"
                      value={location.postalCode}
                      onChange={(e) => setLocation(prev => ({ ...prev, postalCode: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold">Horarios de Atención</h3>
                <HoursSchedule hours={hours} onChange={setHours} />
              </div>

              <Button onClick={handleSaveLocation} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Guardando..." : "Guardar Ubicación y Horarios"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
              <CardDescription>
                Configura tus redes sociales y WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <div className="flex gap-2">
                  <div className="w-16 flex items-center justify-center border rounded-md bg-muted px-3 text-sm font-medium">
                    +51
                  </div>
                  <Input
                    id="whatsapp"
                    value={(() => {
                      // Obtener solo los dígitos (sin +51)
                      const digits = socialMedia.whatsapp.replace("+51", "").replace(/\D/g, "");
                      // Formatear en grupos de 3: XXX XXX XXX
                      if (digits.length <= 3) return digits;
                      if (digits.length <= 6) return digits.slice(0, 3) + " " + digits.slice(3);
                      return digits.slice(0, 3) + " " + digits.slice(3, 6) + " " + digits.slice(6, 9);
                    })()}
                    onChange={(e) => {
                      // Solo números, máximo 9 dígitos
                      const value = e.target.value.replace(/\D/g, "").slice(0, 9);
                      // Guardar con +51 (sin espacios para el backend)
                      setSocialMedia(prev => ({
                        ...prev,
                        whatsapp: "+51" + value
                      }));
                    }}
                    placeholder="999 999 999"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  9 dígitos del número de WhatsApp (ej: 941 234 567)
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Redes Sociales</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSocialNetwork}
                    disabled={(socialMedia.socialNetworks?.length || 0) >= 4}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Red Social
                  </Button>
                </div>

                {socialMedia.socialNetworks && socialMedia.socialNetworks.length > 0 ? (
                  <div className="space-y-4">
                    {socialMedia.socialNetworks.map((network: TenantSocialNetwork) => (
                      <div key={network.id} className="flex gap-4 items-end p-4 border rounded-lg">
                        <div className="flex-1 grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Red Social</Label>
                            <select
                              className="w-full h-10 px-3 border rounded-md bg-background text-foreground"
                              value={network.name}
                              onChange={(e) => handleUpdateSocialNetwork(network.id, 'name', e.target.value)}
                            >
                              <option value="instagram">Instagram</option>
                              <option value="facebook">Facebook</option>
                              <option value="x">X (Twitter)</option>
                              <option value="tiktok">TikTok</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label>URL</Label>
                            <Input
                              placeholder="https://instagram.com/..."
                              value={network.url}
                              onChange={(e) => handleUpdateSocialNetwork(network.id, 'url', e.target.value)}
                            />
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveSocialNetwork(network.id)}
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">
                      No hay redes sociales configuradas
                    </p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  💡 Máximo 4 redes sociales. Se mostrarán en el footer de tu sitio web.
                </p>
              </div>

              <Button onClick={handleSaveSocialMedia} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Guardando..." : "Guardar Redes Sociales"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personalization Tab */}
        <TabsContent value="personalization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Personalización Visual
              </CardTitle>
              <CardDescription>
                Personaliza los colores y estilos de tu sitio web
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Colores del Tema</h3>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Color Primario</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={personalization.primaryColor}
                        onChange={(e) => setPersonalization(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={personalization.primaryColor}
                        onChange={(e) => setPersonalization(prev => ({ ...prev, primaryColor: e.target.value }))}
                        placeholder="#ff6b35"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Color Secundario</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={personalization.secondaryColor}
                        onChange={(e) => setPersonalization(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={personalization.secondaryColor}
                        onChange={(e) => setPersonalization(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        placeholder="#f7931e"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Color de Acento</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={personalization.accentColor}
                        onChange={(e) => setPersonalization(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={personalization.accentColor}
                        onChange={(e) => setPersonalization(prev => ({ ...prev, accentColor: e.target.value }))}
                        placeholder="#c1121f"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    💡 Los colores se aplicarán en botones, enlaces y elementos destacados de tu sitio web
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold">Tipografía</h3>

                <div className="space-y-2">
                  <Label htmlFor="font">Fuente Principal</Label>
                  <select
                    id="font"
                    className="w-full h-10 px-3 border rounded-md bg-background text-foreground"
                    value={personalization.font}
                    onChange={(e) => setPersonalization(prev => ({ ...prev, font: e.target.value }))}
                  >
                    <option value="Inter">Inter (Moderna)</option>
                    <option value="Roboto">Roboto (Clásica)</option>
                    <option value="Open Sans">Open Sans (Limpia)</option>
                    <option value="Poppins">Poppins (Elegante)</option>
                    <option value="Playfair Display">Playfair Display (Elegante Serif)</option>
                    <option value="Montserrat">Montserrat (Geométrica)</option>
                    <option value="Lato">Lato (Profesional)</option>
                    <option value="Nunito">Nunito (Amigable)</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    La fuente se aplicará a todo el sitio web del restaurante
                  </p>
                </div>
              </div>

              {/* Vista previa */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold">Vista Previa</h3>
                <div className="p-6 border rounded-lg bg-white dark:bg-gray-900">
                  <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                      <div
                        className="w-12 h-12 rounded-lg shadow-sm"
                        style={{ backgroundColor: personalization.primaryColor }}
                      />
                      <div
                        className="w-12 h-12 rounded-lg shadow-sm"
                        style={{ backgroundColor: personalization.secondaryColor }}
                      />
                      <div
                        className="w-12 h-12 rounded-lg shadow-sm"
                        style={{ backgroundColor: personalization.accentColor }}
                      />
                    </div>
                    <div className="space-y-2">
                      <button
                        className="px-4 py-2 rounded-md text-white text-sm font-medium"
                        style={{ backgroundColor: personalization.primaryColor }}
                      >
                        Botón Primario
                      </button>
                      <button
                        className="px-4 py-2 rounded-md text-white text-sm font-medium ml-2"
                        style={{ backgroundColor: personalization.secondaryColor }}
                      >
                        Botón Secundario
                      </button>
                      <button
                        className="px-4 py-2 rounded-md text-white text-sm font-medium ml-2"
                        style={{ backgroundColor: personalization.accentColor }}
                      >
                        Botón Acento
                      </button>
                    </div>
                    <p
                      className="text-sm text-muted-foreground"
                      style={{ fontFamily: personalization.font }}
                    >
                      Este es un texto de ejemplo con la fuente {personalization.font} seleccionada.
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={handleSavePersonalization} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Guardando..." : "Guardar Personalización"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias del Sistema</CardTitle>
              <CardDescription>
                Configura tus preferencias personales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Tema de Interfaz</Label>
                <select
                  id="theme"
                  className="w-full h-10 px-3 border rounded-md bg-background text-foreground"
                  value={preferences.theme}
                  onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value as Theme }))}
                >
                  <option value="light">
                    ☀️ Claro
                  </option>
                  <option value="dark">
                    🌙 Oscuro
                  </option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Elige el tema de la interfaz de administración
                </p>
              </div>

              <Button onClick={handleSavePreferences}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Preferencias
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

