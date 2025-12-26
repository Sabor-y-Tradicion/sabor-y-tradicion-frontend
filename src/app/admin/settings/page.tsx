"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface RestaurantInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
}

interface SocialMedia {
  facebook: string;
  instagram: string;
  whatsapp: string;
  tiktok: string;
}

interface Preferences {
  language: string;
  currency: string;
  theme: string;
}

export default function SettingsPage() {
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);

  // Restaurant Info
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: "Sabor y Tradicion",
    description: "Restaurante de comida peruana tradicional",
    address: "Av. Principal 123, Lima, Peru",
    phone: "+51 999 999 999",
    email: "contacto@saborytradicion.com",
  });

  // Social Media
  const [socialMedia, setSocialMedia] = useState<SocialMedia>({
    facebook: "https://facebook.com/saborytradicion",
    instagram: "https://instagram.com/saborytradicion",
    whatsapp: "+51999999999",
    tiktok: "https://tiktok.com/@saborytradicion",
  });

  // Preferences
  const [preferences, setPreferences] = useState<Preferences>({
    language: "es",
    currency: "PEN",
    theme: "light",
  });

  // Load from localStorage
  useEffect(() => {
    const savedRestaurantInfo = localStorage.getItem("restaurant_info");
    const savedSocialMedia = localStorage.getItem("social_media");
    const savedPreferences = localStorage.getItem("preferences");

    if (savedRestaurantInfo) {
      try {
        setRestaurantInfo(JSON.parse(savedRestaurantInfo));
      } catch {
        // Ignore
      }
    }
    if (savedSocialMedia) {
      try {
        setSocialMedia(JSON.parse(savedSocialMedia));
      } catch {
        // Ignore
      }
    }
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch {
        // Ignore
      }
    }
  }, []);

  const handleSaveRestaurantInfo = () => {
    setIsSaving(true);
    try {
      localStorage.setItem("restaurant_info", JSON.stringify(restaurantInfo));
      toast({
        title: "Cambios guardados",
        description: "La informacion del restaurante ha sido actualizada",
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

  const handleSaveSocialMedia = () => {
    setIsSaving(true);
    try {
      localStorage.setItem("social_media", JSON.stringify(socialMedia));
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

  const handleSavePreferences = () => {
    setIsSaving(true);
    try {
      localStorage.setItem("preferences", JSON.stringify(preferences));
      toast({
        title: "Preferencias guardadas",
        description: "Tus preferencias han sido actualizadas",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar las preferencias",
      });
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuracion</h1>
        <p className="text-muted-foreground">
          Administra la configuracion general del restaurante
        </p>
      </div>

      <Tabs defaultValue="restaurant" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="restaurant">Restaurante</TabsTrigger>
          <TabsTrigger value="social">Redes Sociales</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
        </TabsList>

        {/* Tab: Información del Restaurante */}
        <TabsContent value="restaurant" className="space-y-4">
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">
              Informacion del Restaurante
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rest-name">Nombre del restaurante</Label>
                <Input
                  id="rest-name"
                  value={restaurantInfo.name}
                  onChange={(e) =>
                    setRestaurantInfo({ ...restaurantInfo, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rest-desc">Descripcion</Label>
                <Textarea
                  id="rest-desc"
                  rows={3}
                  value={restaurantInfo.description}
                  onChange={(e) =>
                    setRestaurantInfo({
                      ...restaurantInfo,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rest-address">Direccion</Label>
                <Input
                  id="rest-address"
                  value={restaurantInfo.address}
                  onChange={(e) =>
                    setRestaurantInfo({
                      ...restaurantInfo,
                      address: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rest-phone">Telefono</Label>
                  <Input
                    id="rest-phone"
                    type="tel"
                    value={restaurantInfo.phone}
                    onChange={(e) =>
                      setRestaurantInfo({
                        ...restaurantInfo,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rest-email">Email</Label>
                  <Input
                    id="rest-email"
                    type="email"
                    value={restaurantInfo.email}
                    onChange={(e) =>
                      setRestaurantInfo({
                        ...restaurantInfo,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleSaveRestaurantInfo}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Redes Sociales */}
        <TabsContent value="social" className="space-y-4">
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Redes Sociales</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="social-facebook">Facebook</Label>
                <Input
                  id="social-facebook"
                  type="url"
                  placeholder="https://facebook.com/tu-restaurante"
                  value={socialMedia.facebook}
                  onChange={(e) =>
                    setSocialMedia({ ...socialMedia, facebook: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social-instagram">Instagram</Label>
                <Input
                  id="social-instagram"
                  type="url"
                  placeholder="https://instagram.com/tu-restaurante"
                  value={socialMedia.instagram}
                  onChange={(e) =>
                    setSocialMedia({ ...socialMedia, instagram: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="social-whatsapp">WhatsApp</Label>
                <Input
                  id="social-whatsapp"
                  type="tel"
                  placeholder="+51999999999"
                  value={socialMedia.whatsapp}
                  onChange={(e) =>
                    setSocialMedia({ ...socialMedia, whatsapp: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Formato: +51999999999 (sin espacios)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="social-tiktok">TikTok</Label>
                <Input
                  id="social-tiktok"
                  type="url"
                  placeholder="https://tiktok.com/@tu-restaurante"
                  value={socialMedia.tiktok}
                  onChange={(e) =>
                    setSocialMedia({ ...socialMedia, tiktok: e.target.value })
                  }
                />
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleSaveSocialMedia}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Preferencias */}
        <TabsContent value="preferences" className="space-y-4">
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">
              Preferencias del Panel
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, language: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Espanol</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Moneda</Label>
                <Select
                  value={preferences.currency}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, currency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PEN">Soles Peruanos (S/)</SelectItem>
                    <SelectItem value="USD">Dolares (USD $)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tema</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, theme: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Oscuro</SelectItem>
                    <SelectItem value="auto">Automatico</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  El tema oscuro se implementara en una version futura
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleSavePreferences}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Guardar preferencias
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

