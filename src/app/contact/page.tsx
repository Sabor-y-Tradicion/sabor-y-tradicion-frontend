"use client";

import { Mail, Phone, MapPin, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ContactForm from './components/contact-form';
import { useTenant } from '@/contexts/tenant-context';
import { TenantHours } from '@/types/tenant';
import dynamic from 'next/dynamic';

// Importar el mapa dinámicamente para evitar errores de SSR
const ContactMap = dynamic(
  () => import('./components/contact-map'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full min-h-[400px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
);

export default function ContactPage() {
    const { tenant } = useTenant();

    // Obtener datos del tenant
    const restaurantName = tenant?.name || "Restaurante";
    const address = tenant?.settings?.location?.address || "";
    const city = tenant?.settings?.location?.city || "";
    const state = tenant?.settings?.location?.state || "";
    const country = tenant?.settings?.location?.country || "";
    const phone = tenant?.settings?.phone || "";
    const email = tenant?.settings?.email || "";
    const hours: TenantHours[] = tenant?.settings?.hours || [];

    // Formatear dirección completa
    const fullAddress = [address, city, state, country].filter(Boolean).join(", ");

    // Formatear horarios
    const formatHours = () => {
        if (!hours || hours.length === 0) return null;

        const dayNames: { [key: string]: string } = {
            monday: 'Lunes',
            tuesday: 'Martes',
            wednesday: 'Miércoles',
            thursday: 'Jueves',
            friday: 'Viernes',
            saturday: 'Sábado',
            sunday: 'Domingo'
        };

        const openDays = hours.filter((h: TenantHours) => !h.closed);
        const closedDays = hours.filter((h: TenantHours) => h.closed).map((h: TenantHours) => dayNames[h.day]);

        return { openDays, closedDays, dayNames };
    };

    const hoursInfo = formatHours();

    return (
        <div className="py-20 md:py-32">
            <div className="container mx-auto px-4">
                <header className="text-center mb-20">
                    <div className="inline-block mb-4">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider">Contáctanos</span>
                    </div>
                    <h1 className="font-headline text-5xl font-bold md:text-6xl lg:text-7xl mb-6">Ponte en Contacto</h1>
                    <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
                        ¿Tienes alguna pregunta o quieres hacer una reserva? Estamos aquí para ayudarte.
                    </p>
                </header>

                {tenant?.settings?.location?.latitude && tenant?.settings?.location?.longitude && (
                    <section className="mb-16 h-[400px] w-full rounded-2xl bg-secondary md:h-[500px] overflow-hidden shadow-2xl">
                        <ContactMap
                            latitude={tenant.settings.location.latitude}
                            longitude={tenant.settings.location.longitude}
                            address={fullAddress || ""}
                            restaurantName={restaurantName}
                        />
                    </section>
                )}

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    <div className="flex">
                        <Card className="flex w-full flex-col shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <CardTitle className="font-headline text-3xl">Nuestra Información</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col justify-between space-y-8">
                                {fullAddress && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                                            <MapPin className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-1">Dirección</h3>
                                            <p className="text-muted-foreground text-base">{fullAddress}</p>
                                        </div>
                                    </div>
                                )}
                                {phone && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                                            <Phone className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-1">Teléfono</h3>
                                            <p className="text-muted-foreground text-base">{phone}</p>
                                            <p className="text-sm text-muted-foreground mt-1">Llámanos para reservas</p>
                                        </div>
                                    </div>
                                )}
                                {email && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                                            <Mail className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-1">Email</h3>
                                            <p className="text-muted-foreground text-base">{email}</p>
                                            <p className="text-sm text-muted-foreground mt-1">Respondemos en 24h</p>
                                        </div>
                                    </div>
                                )}
                                {hoursInfo && hoursInfo.openDays.length > 0 && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                                            <Clock className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-1">Horario</h3>
                                            {hoursInfo.openDays.map((h: TenantHours) => (
                                                <p key={h.day} className="text-muted-foreground text-base">
                                                    {hoursInfo.dayNames[h.day]}: {h.open} - {h.close}
                                                </p>
                                            ))}
                                            {hoursInfo.closedDays.length > 0 && (
                                                <p className="text-sm text-primary font-medium mt-1">
                                                    Cerrado: {hoursInfo.closedDays.join(', ')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {!fullAddress && !phone && !email && (
                                    <p className="text-muted-foreground text-center py-8">
                                        Configura la información de contacto desde el panel de administración.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
