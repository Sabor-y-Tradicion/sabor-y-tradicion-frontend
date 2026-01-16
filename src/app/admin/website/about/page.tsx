"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Loader2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useTenant } from "@/contexts/tenant-context";
import { useToast } from "@/hooks/use-toast";
import { ImageUploader, SectionToggle, LivePreview } from "../components";
import { AboutPage } from "@/types/tenant";

// Valores por defecto
const DEFAULT_ABOUT_PAGE: AboutPage = {
  header: {
    title: "Nuestra Esencia",
    subtitle: "",
  },
  history: {
    enabled: true,
    image: "",
    title: "Nuestra Historia",
    content: "",
  },
  philosophy: {
    enabled: true,
    image: "",
    title: "Nuestra Filosofía",
    content: "",
  },
  team: {
    enabled: true,
    image: "",
    title: "Conoce al Equipo",
    content: "",
  },
};

export default function AboutEditorPage() {
  const { tenant, updateTenantSettings } = useTenant();
  const { toast } = useToast();

  const [formData, setFormData] = useState<AboutPage>(DEFAULT_ABOUT_PAGE);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("header");

  // Cargar datos existentes
  useEffect(() => {
    if (tenant?.settings?.aboutPage) {
      setFormData({
        ...DEFAULT_ABOUT_PAGE,
        ...tenant.settings.aboutPage,
        header: { ...DEFAULT_ABOUT_PAGE.header, ...tenant.settings.aboutPage.header },
        history: { ...DEFAULT_ABOUT_PAGE.history, ...tenant.settings.aboutPage.history },
        philosophy: { ...DEFAULT_ABOUT_PAGE.philosophy, ...tenant.settings.aboutPage.philosophy },
        team: { ...DEFAULT_ABOUT_PAGE.team, ...tenant.settings.aboutPage.team },
      });
    } else {
      // Cargar valores actuales del tenant si existen
      setFormData({
        ...DEFAULT_ABOUT_PAGE,
        header: {
          ...DEFAULT_ABOUT_PAGE.header,
          subtitle: tenant?.settings?.description || `Conoce más sobre ${tenant?.name || "nosotros"} y nuestra historia.`,
        },
        history: {
          ...DEFAULT_ABOUT_PAGE.history,
          content: tenant?.settings?.longDescription || "",
        },
        philosophy: {
          ...DEFAULT_ABOUT_PAGE.philosophy,
          content: `En ${tenant?.name || "nuestro restaurante"} nos dedicamos a ofrecer la mejor experiencia gastronómica. Trabajamos con productos de calidad para garantizar ingredientes frescos y auténticos en cada preparación.`,
        },
        team: {
          ...DEFAULT_ABOUT_PAGE.team,
          content: "Nuestro equipo está comprometido con brindarte la mejor atención y experiencia gastronómica. Cada miembro está dedicado a hacer de tu visita algo memorable.",
        },
      });
    }
  }, [tenant]);

  // Detectar cambios
  useEffect(() => {
    const originalData = tenant?.settings?.aboutPage;
    setHasChanges(JSON.stringify(formData) !== JSON.stringify(originalData || DEFAULT_ABOUT_PAGE));
  }, [formData, tenant]);

  // Handlers
  const updateHeader = useCallback((updates: Partial<AboutPage["header"]>) => {
    setFormData((prev) => ({
      ...prev,
      header: { ...prev.header, ...updates },
    }));
  }, []);

  const updateHistory = useCallback((updates: Partial<AboutPage["history"]>) => {
    setFormData((prev) => ({
      ...prev,
      history: { ...prev.history, ...updates },
    }));
  }, []);

  const updatePhilosophy = useCallback((updates: Partial<AboutPage["philosophy"]>) => {
    setFormData((prev) => ({
      ...prev,
      philosophy: { ...prev.philosophy, ...updates },
    }));
  }, []);

  const updateTeam = useCallback((updates: Partial<AboutPage["team"]>) => {
    setFormData((prev) => ({
      ...prev,
      team: { ...prev.team, ...updates },
    }));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validar que las imágenes sean base64 y no blob URLs
      const validateImageUrl = (url: string | undefined) => {
        if (!url) return url;
        if (url.startsWith('blob:')) {
          console.error('URL blob detectada:', url);
          return ''; // Eliminar URLs blob que no se pueden guardar
        }
        return url;
      };

      const sanitizedData: AboutPage = {
        ...formData,
        history: {
          ...formData.history,
          image: validateImageUrl(formData.history?.image),
        },
        philosophy: {
          ...formData.philosophy,
          image: validateImageUrl(formData.philosophy?.image),
        },
        team: {
          ...formData.team,
          image: validateImageUrl(formData.team?.image),
        },
      };

      console.log('Guardando datos:', sanitizedData);

      await updateTenantSettings({
        aboutPage: sanitizedData,
      });

      toast({
        title: "¡Guardado!",
        description: "Los cambios se han guardado correctamente",
      });
      setHasChanges(false);
    } catch (error) {
      console.error('Error al guardar:', error);
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
    if (tenant?.settings?.aboutPage) {
      setFormData({
        ...DEFAULT_ABOUT_PAGE,
        ...tenant.settings.aboutPage,
      });
    } else {
      setFormData(DEFAULT_ABOUT_PAGE);
    }
  };

  // Preview Components
  const HeaderPreview = () => (
    <div className="py-8 text-center px-4">
      <h1 className="text-2xl font-bold mb-2">{formData.header?.title || "Nuestra Esencia"}</h1>
      <p className="text-sm text-gray-500 max-w-md mx-auto">
        {formData.header?.subtitle || "Conoce más sobre nosotros y nuestra historia."}
      </p>
    </div>
  );

  const SectionPreview = ({ section, title, imageFirst = true }: {
    section: AboutPage["history"];
    title: string;
    imageFirst?: boolean;
  }) => {
    if (!section?.enabled) return null;

    const imageComponent = (
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
        {section.image ? (
          <img src={section.image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Sin imagen
          </div>
        )}
      </div>
    );

    const contentComponent = (
      <div className="space-y-1">
        <h2 className="text-lg font-bold">{section.title || title}</h2>
        <p className="text-xs text-gray-500 line-clamp-4">
          {section.content || `Contenido de ${title.toLowerCase()}...`}
        </p>
      </div>
    );

    return (
      <div className="py-6 px-4 border-t border-gray-100 dark:border-gray-800">
        <div className={`flex flex-col gap-4 ${!imageFirst ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
          <div className="flex-1">{imageComponent}</div>
          <div className="flex-1">{contentComponent}</div>
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
              Editar Sobre Nosotros
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              Personaliza la información de tu restaurante
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
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="header">Encabezado</TabsTrigger>
              <TabsTrigger value="history">Historia</TabsTrigger>
              <TabsTrigger value="philosophy">Filosofía</TabsTrigger>
              <TabsTrigger value="team">Equipo</TabsTrigger>
            </TabsList>

            {/* Header Section */}
            <TabsContent value="header" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Encabezado de la Página</CardTitle>
                  <CardDescription>
                    El título y descripción principal de la página
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título principal</Label>
                    <Input
                      value={formData.header?.title || ""}
                      onChange={(e) => updateHeader({ title: e.target.value })}
                      placeholder="Nuestra Esencia"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Subtítulo / Descripción</Label>
                    <Textarea
                      value={formData.header?.subtitle || ""}
                      onChange={(e) => updateHeader({ subtitle: e.target.value })}
                      placeholder="Conoce más sobre nosotros y nuestra historia."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Section */}
            <TabsContent value="history" className="space-y-4 mt-4">
              <SectionToggle
                title="Nuestra Historia"
                description="Cuenta los orígenes de tu restaurante"
                enabled={formData.history?.enabled ?? true}
                onToggle={(enabled) => updateHistory({ enabled })}
              >
                <div className="space-y-4">
                  <ImageUploader
                    value={formData.history?.image}
                    onChange={(url) => updateHistory({ image: url })}
                    onRemove={() => updateHistory({ image: "" })}
                    aspectRatio="square"
                    label="Imagen de la sección"
                  />

                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={formData.history?.title || ""}
                      onChange={(e) => updateHistory({ title: e.target.value })}
                      placeholder="Nuestra Historia"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Contenido</Label>
                    <Textarea
                      value={formData.history?.content || ""}
                      onChange={(e) => updateHistory({ content: e.target.value })}
                      placeholder="Cuenta la historia de cómo comenzó tu restaurante, su fundación, valores..."
                      rows={6}
                    />
                    <p className="text-xs text-gray-500">
                      Puedes usar saltos de línea para separar párrafos
                    </p>
                  </div>
                </div>
              </SectionToggle>
            </TabsContent>

            {/* Philosophy Section */}
            <TabsContent value="philosophy" className="space-y-4 mt-4">
              <SectionToggle
                title="Nuestra Filosofía"
                description="Los valores y principios de tu restaurante"
                enabled={formData.philosophy?.enabled ?? true}
                onToggle={(enabled) => updatePhilosophy({ enabled })}
              >
                <div className="space-y-4">
                  <ImageUploader
                    value={formData.philosophy?.image}
                    onChange={(url) => updatePhilosophy({ image: url })}
                    onRemove={() => updatePhilosophy({ image: "" })}
                    aspectRatio="square"
                    label="Imagen de la sección"
                  />

                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={formData.philosophy?.title || ""}
                      onChange={(e) => updatePhilosophy({ title: e.target.value })}
                      placeholder="Nuestra Filosofía"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Contenido</Label>
                    <Textarea
                      value={formData.philosophy?.content || ""}
                      onChange={(e) => updatePhilosophy({ content: e.target.value })}
                      placeholder="Describe la filosofía, valores y compromiso de tu restaurante..."
                      rows={6}
                    />
                  </div>
                </div>
              </SectionToggle>
            </TabsContent>

            {/* Team Section */}
            <TabsContent value="team" className="space-y-4 mt-4">
              <SectionToggle
                title="Conoce al Equipo"
                description="Presenta a tu equipo de trabajo"
                enabled={formData.team?.enabled ?? true}
                onToggle={(enabled) => updateTeam({ enabled })}
              >
                <div className="space-y-4">
                  <ImageUploader
                    value={formData.team?.image}
                    onChange={(url) => updateTeam({ image: url })}
                    onRemove={() => updateTeam({ image: "" })}
                    aspectRatio="video"
                    label="Imagen del equipo"
                  />

                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={formData.team?.title || ""}
                      onChange={(e) => updateTeam({ title: e.target.value })}
                      placeholder="Conoce al Equipo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Contenido</Label>
                    <Textarea
                      value={formData.team?.content || ""}
                      onChange={(e) => updateTeam({ content: e.target.value })}
                      placeholder="Describe a tu equipo, su compromiso y dedicación..."
                      rows={5}
                    />
                  </div>
                </div>
              </SectionToggle>
            </TabsContent>
          </Tabs>
        </div>

        {/* Panel de vista previa */}
        <div className="lg:sticky lg:top-4 h-fit">
          <LivePreview className="min-h-[500px]">
            <HeaderPreview />
            <SectionPreview section={formData.history} title="Historia" />
            <SectionPreview section={formData.philosophy} title="Filosofía" imageFirst={false} />
            <SectionPreview section={formData.team} title="Equipo" />
          </LivePreview>
        </div>
      </div>
    </div>
  );
}

