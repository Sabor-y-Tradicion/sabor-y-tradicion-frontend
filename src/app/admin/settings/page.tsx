"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import { Save, Plus, X as XIcon, Trash2, Bell, Mail, ShoppingBag } from "lucide-react";

interface RestaurantInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
}

interface SocialMedia {
  whatsapp: string;
  socialNetworks?: Array<{
    id: string;
    name: string;
    url: string;
    icon: string;
  }>;
}

interface Preferences {
  theme: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  orderAlerts: boolean;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, changeTheme } = useTheme();

  const [isSaving, setIsSaving] = useState(false);

  // Restaurant Info
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: "Sabor y Tradicion",
    description: "Cocina tradicional chachapoyana en el corazón de Amazonas.",
    address: "Jr Bolivia 715, Chachapoyas",
    phone: "(+51) 941 234 567",
    email: "contacto@saborytradicion.pe",
  });

  // Social Media
  const [socialMedia, setSocialMedia] = useState<SocialMedia>({
    whatsapp: "+51",
    socialNetworks: [],
  });

  // Preferences
  const [preferences, setPreferences] = useState<Preferences>({
    theme: "light",
    notificationsEnabled: true,
    emailNotifications: true,
    orderAlerts: true,
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

  // Funciones para redes sociales adicionales
  const [newNetworkType, setNewNetworkType] = useState("");
  const [newNetworkUrl, setNewNetworkUrl] = useState("");
  const [showAddNetwork, setShowAddNetwork] = useState(false);

  const availableNetworks = [
    { value: "instagram", label: "Instagram", icon: "instagram" },
    { value: "facebook", label: "Facebook", icon: "facebook" },
    { value: "x", label: "X (Twitter)", icon: "x" },
    { value: "tiktok", label: "TikTok", icon: "tiktok" },
  ];

  const handleAddNetwork = () => {
    if (!newNetworkType || !newNetworkUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor selecciona una red social e ingresa la URL",
      });
      return;
    }

    const network = availableNetworks.find((n) => n.value === newNetworkType);
    if (!network) return;

    // Verificar si ya existe esta red social (solo se permite una de cada tipo)
    const exists = socialMedia.socialNetworks?.some((n) => n.name === newNetworkType);
    if (exists) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Ya has agregado ${network.label}. Solo puedes tener una red social de cada tipo.`,
      });
      return;
    }

    const newNetwork = {
      id: Date.now().toString(),
      name: newNetworkType,
      url: newNetworkUrl,
      icon: network.icon,
    };

    setSocialMedia({
      ...socialMedia,
      socialNetworks: [...(socialMedia.socialNetworks || []), newNetwork],
    });

    setNewNetworkType("");
    setNewNetworkUrl("");
    setShowAddNetwork(false);

    toast({
      title: "Red social agregada",
      description: `${network.label} ha sido agregada correctamente`,
    });
  };

  const handleRemoveNetwork = (id: string) => {
    setSocialMedia({
      ...socialMedia,
      socialNetworks: socialMedia.socialNetworks?.filter((n) => n.id !== id) || [],
    });

    toast({
      title: "Red social eliminada",
      description: "La red social ha sido eliminada correctamente",
    });
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Configuracion</h1>
        <p className="text-muted-foreground dark:text-gray-400">
          Administra la configuracion general del restaurante
        </p>
      </div>

      <Tabs defaultValue="restaurant" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px] bg-white dark:bg-gray-800">
          <TabsTrigger value="restaurant" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">Restaurante</TabsTrigger>
          <TabsTrigger value="social" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">Redes Sociales</TabsTrigger>
          <TabsTrigger value="preferences" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">Preferencias</TabsTrigger>
        </TabsList>

        {/* Tab: Información del Restaurante */}
        <TabsContent value="restaurant" className="space-y-4">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Informacion del Restaurante
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rest-name" className="dark:text-gray-200">Nombre del restaurante</Label>
                <Input
                  id="rest-name"
                  value={restaurantInfo.name}
                  onChange={(e) =>
                    setRestaurantInfo({ ...restaurantInfo, name: e.target.value })
                  }
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rest-desc" className="dark:text-gray-200">Descripcion</Label>
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
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rest-address" className="dark:text-gray-200">Direccion</Label>
                <Input
                  id="rest-address"
                  value={restaurantInfo.address}
                  onChange={(e) =>
                    setRestaurantInfo({
                      ...restaurantInfo,
                      address: e.target.value,
                    })
                  }
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rest-phone" className="dark:text-gray-200">Telefono</Label>
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
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rest-email" className="dark:text-gray-200">Email</Label>
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
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
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
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Redes Sociales</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="social-whatsapp" className="dark:text-gray-200">WhatsApp</Label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 rounded-md border border-gray-200 dark:border-gray-600 bg-muted dark:bg-gray-700 px-3 text-sm font-medium text-gray-900 dark:text-white">
                    +51
                  </div>
                  <Input
                    id="social-whatsapp"
                    type="tel"
                    placeholder="999 999 999 o 999999999"
                    value={socialMedia.whatsapp.replace("+51", "")}
                    onChange={(e) => {
                      // Permitir solo números y espacios
                      const value = e.target.value.replace(/[^\d\s]/g, "");
                      // Agregar +51 automáticamente
                      setSocialMedia({ ...socialMedia, whatsapp: "+51" + value });
                    }}
                    maxLength={11}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  Ingresa 9 dígitos. Puedes separarlos en grupos de 3 o escribirlos juntos.
                </p>
              </div>

              {/* Redes sociales dinámicas */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Redes Sociales</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddNetwork(!showAddNetwork)}
                    className="gap-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    {showAddNetwork ? <XIcon className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {showAddNetwork ? "Cancelar" : "Agregar Red Social"}
                  </Button>
                </div>

                {/* Formulario para agregar red social */}
                {showAddNetwork && (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-muted/50 dark:bg-gray-700/50 p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <Label htmlFor="network-type" className="dark:text-gray-200">Tipo de Red Social</Label>
                      <Select value={newNetworkType} onValueChange={setNewNetworkType}>
                        <SelectTrigger id="network-type" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Selecciona una red social" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                          {availableNetworks.map((network) => (
                            <SelectItem key={network.value} value={network.value} className="dark:text-white dark:focus:bg-gray-600">
                              {network.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="network-url" className="dark:text-gray-200">URL</Label>
                      <Input
                        id="network-url"
                        type="url"
                        placeholder="https://..."
                        value={newNetworkUrl}
                        onChange={(e) => setNewNetworkUrl(e.target.value)}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>

                    <Button
                      type="button"
                      onClick={handleAddNetwork}
                      className="w-full gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar
                    </Button>
                  </div>
                )}

                {/* Lista de redes sociales */}
                {socialMedia.socialNetworks && socialMedia.socialNetworks.length > 0 && (
                  <div className="space-y-2">
                    {socialMedia.socialNetworks.map((network) => (
                      <div
                        key={network.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground font-semibold">
                            {network.name === "x" && "𝕏"}
                            {network.name === "tiktok" && "TT"}
                            {network.name === "instagram" && "IG"}
                            {network.name === "facebook" && "FB"}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                              {availableNetworks.find((n) => n.value === network.name)?.label}
                            </p>
                            <p className="text-xs text-muted-foreground dark:text-gray-400 truncate max-w-[300px]">
                              {network.url}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveNetwork(network.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Preferencias del Panel
            </h3>
            <div className="space-y-6">
              {/* Tema */}
              <div className="space-y-2">
                <Label className="dark:text-gray-200">Tema</Label>
                <Select
                  value={theme}
                  onValueChange={(value) => {
                    changeTheme(value as 'light' | 'dark');
                    setPreferences({ ...preferences, theme: value });
                  }}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="light" className="dark:text-white dark:focus:bg-gray-600">☀️ Claro</SelectItem>
                    <SelectItem value="dark" className="dark:text-white dark:focus:bg-gray-600">🌙 Oscuro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notificaciones */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Notificaciones</h4>

                {/* Notificaciones generales */}
                <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">Notificaciones del sistema</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">
                        Recibir notificaciones en tiempo real
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.notificationsEnabled}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, notificationsEnabled: checked })
                    }
                  />
                </div>

                {/* Notificaciones por email */}
                <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                      <Mail className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">Notificaciones por email</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">
                        Recibir resumen diario por correo
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, emailNotifications: checked })
                    }
                  />
                </div>

                {/* Alertas de pedidos */}
                <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <ShoppingBag className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">Alertas de pedidos</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">
                        Notificar sobre nuevos pedidos (próximamente)
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.orderAlerts}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, orderAlerts: checked })
                    }
                  />
                </div>
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

