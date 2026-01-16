"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Save, Eye, Loader2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useTenant } from "@/contexts/tenant-context";
import { useToast } from "@/hooks/use-toast";
import { ImageUploader, SectionToggle, CarouselEditor, LivePreview } from "../components";
import { HomePage, CarouselItem } from "@/types/tenant";
import Image from "next/image";

// Valores por defecto
const DEFAULT_HOME_PAGE: HomePage = {
  hero: {
    image: "",
    title: "",
    subtitle: "",
    buttonText: "Ver Nuestro Menú",
    buttonLink: "/menu",
    overlayOpacity: 50,
  },
  features: {
    enabled: true,
    sectionTitle: "El Corazón de Nuestra Cocina",
    sectionSubtitle: "Descubre lo que nos hace especiales",
    items: [],
    autoplay: true,
    autoplayDelay: 5,
  },
  story: {
    enabled: true,
    image: "",
    badge: "Nuestra Esencia",
    title: "Nuestra Historia",
    content: "",
    buttonText: "Conoce más sobre nosotros",
    buttonLink: "/about",
  },
};

export default function HomeEditorPage() {
  const router = useRouter();
  const { tenant, updateTenantSettings } = useTenant();
  const { toast } = useToast();

  const [formData, setFormData] = useState<HomePage>(DEFAULT_HOME_PAGE);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  // Cargar datos existentes
  useEffect(() => {
    if (tenant?.settings?.homePage) {
      setFormData({
        ...DEFAULT_HOME_PAGE,
        ...tenant.settings.homePage,
        hero: { ...DEFAULT_HOME_PAGE.hero, ...tenant.settings.homePage.hero },
        features: { ...DEFAULT_HOME_PAGE.features, ...tenant.settings.homePage.features },
        story: { ...DEFAULT_HOME_PAGE.story, ...tenant.settings.homePage.story },
      });
    } else {
      // Cargar valores actuales del tenant si existen
      setFormData({
        ...DEFAULT_HOME_PAGE,
        hero: {
          ...DEFAULT_HOME_PAGE.hero,
          title: tenant?.name || "",
          subtitle: tenant?.settings?.slogan || tenant?.settings?.description || "",
        },
        story: {
          ...DEFAULT_HOME_PAGE.story,
          content: tenant?.settings?.longDescription || "",
        },
      });
    }
  }, [tenant]);

  // Detectar cambios
  useEffect(() => {
    const originalData = tenant?.settings?.homePage;
    setHasChanges(JSON.stringify(formData) !== JSON.stringify(originalData || DEFAULT_HOME_PAGE));
  }, [formData, tenant]);

  // Handlers
  const updateHero = useCallback((updates: Partial<HomePage["hero"]>) => {
    setFormData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...updates },
    }));
  }, []);

  const updateFeatures = useCallback((updates: Partial<HomePage["features"]>) => {
    setFormData((prev) => ({
      ...prev,
      features: { ...prev.features, ...updates },
    }));
  }, []);

  const updateStory = useCallback((updates: Partial<HomePage["story"]>) => {
    setFormData((prev) => ({
      ...prev,
      story: { ...prev.story, ...updates },
    }));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateTenantSettings({
        homePage: formData,
      });
      toast({
        title: "¡Guardado!",
        description: "Los cambios se han guardado correctamente",
      });
      setHasChanges(false);
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (tenant?.settings?.homePage) {
      setFormData({
        ...DEFAULT_HOME_PAGE,
        ...tenant.settings.homePage,
      });
    } else {
      setFormData(DEFAULT_HOME_PAGE);
    }
  };

  // Preview Components
  const HeroPreview = () => (
    <div className="relative h-64 overflow-hidden bg-gray-900">
      {formData.hero?.image ? (
        <Image
          src={formData.hero.image}
          alt="Hero"
          fill
          className="object-cover"
          style={{ filter: `brightness(${100 - (formData.hero.overlayOpacity || 50)}%)` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700" />
      )}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {formData.hero?.title || tenant?.name || "Título del restaurante"}
          </h1>
          <p className="text-sm opacity-90 mb-4">
            {formData.hero?.subtitle || "Subtítulo o eslogan"}
          </p>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
            {formData.hero?.buttonText || "Ver Menú"}
          </button>
        </div>
      </div>
    </div>
  );

  const FeaturesPreview = () => {
    if (!formData.features?.enabled) return null;
    const items = formData.features?.items || [];

    return (
      <div className="py-8 bg-secondary/30">
        <div className="text-center mb-6 px-4">
          <h2 className="text-xl font-bold mb-1">{formData.features?.sectionTitle}</h2>
          <p className="text-sm text-gray-500">{formData.features?.sectionSubtitle}</p>
        </div>
        {items.length > 0 ? (
          <div className="flex gap-4 px-4 overflow-x-auto pb-4">
            {items.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-48">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-2">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Sin imagen
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-sm truncate">{item.title || "Sin título"}</h3>
                <p className="text-xs text-gray-500 truncate">{item.description || "Sin descripción"}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 text-sm py-8">
            Agrega elementos al carrusel
          </div>
        )}
      </div>
    );
  };

  const StoryPreview = () => {
    if (!formData.story?.enabled) return null;

    return (
      <div className="py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/2 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            {formData.story?.image ? (
              <img src={formData.story.image} alt="Historia" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2 space-y-2">
            <span className="text-xs text-primary font-semibold uppercase">
              {formData.story?.badge}
            </span>
            <h2 className="text-xl font-bold">{formData.story?.title}</h2>
            <p className="text-sm text-gray-500 line-clamp-4">
              {formData.story?.content || "Agrega la historia de tu restaurante..."}
            </p>
            <button className="text-sm text-primary hover:underline">
              {formData.story?.buttonText} →
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/website">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Editar Página de Inicio
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              Personaliza el contenido de tu página principal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Deshacer
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Guardar cambios
          </Button>
        </div>
      </div>

      {/* Editor y Preview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Panel de edición */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="features">Carrusel</TabsTrigger>
              <TabsTrigger value="story">Historia</TabsTrigger>
            </TabsList>

            {/* Hero Section */}
            <TabsContent value="hero" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Banner Principal (Hero)</CardTitle>
                  <CardDescription>
                    La primera sección que verán tus visitantes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUploader
                    value={formData.hero?.image}
                    onChange={(url) => updateHero({ image: url })}
                    onRemove={() => updateHero({ image: "" })}
                    aspectRatio="video"
                    label="Imagen de fondo"
                    hint="Recomendado: 1920x1080px o superior"
                  />

                  <div className="space-y-2">
                    <Label>Oscurecimiento de imagen</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[formData.hero?.overlayOpacity || 50]}
                        onValueChange={([value]) => updateHero({ overlayOpacity: value })}
                        max={80}
                        min={0}
                        step={5}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500 w-12">
                        {formData.hero?.overlayOpacity || 50}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Título principal</Label>
                    <Input
                      value={formData.hero?.title || ""}
                      onChange={(e) => updateHero({ title: e.target.value })}
                      placeholder={tenant?.name || "Nombre del restaurante"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Subtítulo / Eslogan</Label>
                    <Textarea
                      value={formData.hero?.subtitle || ""}
                      onChange={(e) => updateHero({ subtitle: e.target.value })}
                      placeholder="Tu eslogan o descripción breve"
                      rows={2}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Texto del botón</Label>
                      <Input
                        value={formData.hero?.buttonText || ""}
                        onChange={(e) => updateHero({ buttonText: e.target.value })}
                        placeholder="Ver Nuestro Menú"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Enlace del botón</Label>
                      <Input
                        value={formData.hero?.buttonLink || ""}
                        onChange={(e) => updateHero({ buttonLink: e.target.value })}
                        placeholder="/menu"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features Section */}
            <TabsContent value="features" className="space-y-4 mt-4">
              <SectionToggle
                title="Carrusel de Características"
                description="Muestra imágenes destacadas de tu restaurante"
                enabled={formData.features?.enabled ?? true}
                onToggle={(enabled) => updateFeatures({ enabled })}
              >
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Título de la sección</Label>
                      <Input
                        value={formData.features?.sectionTitle || ""}
                        onChange={(e) => updateFeatures({ sectionTitle: e.target.value })}
                        placeholder="El Corazón de Nuestra Cocina"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtítulo</Label>
                      <Input
                        value={formData.features?.sectionSubtitle || ""}
                        onChange={(e) => updateFeatures({ sectionSubtitle: e.target.value })}
                        placeholder="Descubre lo que nos hace especiales"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <Label>Reproducción automática</Label>
                      <p className="text-xs text-gray-500">El carrusel cambiará automáticamente</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {formData.features?.autoplay && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            className="w-16 h-8"
                            value={formData.features?.autoplayDelay || 5}
                            onChange={(e) => updateFeatures({ autoplayDelay: Number(e.target.value) })}
                            min={2}
                            max={15}
                          />
                          <span className="text-sm text-gray-500">seg</span>
                        </div>
                      )}
                      <Switch
                        checked={formData.features?.autoplay ?? true}
                        onCheckedChange={(autoplay) => updateFeatures({ autoplay })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Elementos del carrusel</Label>
                    <CarouselEditor
                      items={formData.features?.items || []}
                      onChange={(items) => updateFeatures({ items })}
                      maxItems={10}
                    />
                  </div>
                </div>
              </SectionToggle>
            </TabsContent>

            {/* Story Section */}
            <TabsContent value="story" className="space-y-4 mt-4">
              <SectionToggle
                title="Nuestra Historia"
                description="Cuenta la historia de tu restaurante"
                enabled={formData.story?.enabled ?? true}
                onToggle={(enabled) => updateStory({ enabled })}
              >
                <div className="space-y-4">
                  <ImageUploader
                    value={formData.story?.image}
                    onChange={(url) => updateStory({ image: url })}
                    onRemove={() => updateStory({ image: "" })}
                    aspectRatio="square"
                    label="Imagen de la sección"
                  />

                  <div className="space-y-2">
                    <Label>Etiqueta superior</Label>
                    <Input
                      value={formData.story?.badge || ""}
                      onChange={(e) => updateStory({ badge: e.target.value })}
                      placeholder="Nuestra Esencia"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={formData.story?.title || ""}
                      onChange={(e) => updateStory({ title: e.target.value })}
                      placeholder="Nuestra Historia"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Contenido</Label>
                    <Textarea
                      value={formData.story?.content || ""}
                      onChange={(e) => updateStory({ content: e.target.value })}
                      placeholder="Cuenta la historia de tu restaurante, su fundación, valores..."
                      rows={5}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Texto del botón</Label>
                      <Input
                        value={formData.story?.buttonText || ""}
                        onChange={(e) => updateStory({ buttonText: e.target.value })}
                        placeholder="Conoce más sobre nosotros"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Enlace del botón</Label>
                      <Input
                        value={formData.story?.buttonLink || ""}
                        onChange={(e) => updateStory({ buttonLink: e.target.value })}
                        placeholder="/about"
                      />
                    </div>
                  </div>
                </div>
              </SectionToggle>
            </TabsContent>
          </Tabs>
        </div>

        {/* Panel de vista previa */}
        <div className="lg:sticky lg:top-4 h-fit">
          <LivePreview className="min-h-[500px]">
            <HeroPreview />
            <FeaturesPreview />
            <StoryPreview />
          </LivePreview>
        </div>
      </div>
    </div>
  );
}

