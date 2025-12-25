
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ContactForm from './components/contact-form';

export default function ContactPage() {
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

                <section className="mb-16 h-[400px] w-full rounded-2xl bg-secondary md:h-[500px] overflow-hidden shadow-2xl">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.234567890123!2d-77.8691!3d-6.2314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTMnNTMuMCJTIDc3wrA1MicwOC44Ilc!5e0!3m2!1ses!2spe!4v1234567890123!5m2!1ses!2spe"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación del restaurante Sabor y Tradición en Chachapoyas"
                    ></iframe>
                </section>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    <div className="flex">
                        <Card className="flex w-full flex-col shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <CardTitle className="font-headline text-3xl">Nuestra Información</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col justify-between space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                                        <MapPin className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-1">Dirección</h3>
                                        <p className="text-muted-foreground text-base">Jr Bolivia 715</p>
                                        <p className="text-muted-foreground text-base">Chachapoyas, Amazonas, Perú</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                                        <Phone className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-1">Teléfono</h3>
                                        <p className="text-muted-foreground text-base">(+51) 941 234 567</p>
                                        <p className="text-sm text-muted-foreground mt-1">Llámanos para reservas</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                                        <Mail className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-1">Email</h3>
                                        <p className="text-muted-foreground text-base">contacto@saborytradicion.pe</p>
                                        <p className="text-sm text-muted-foreground mt-1">Respondemos en 24h</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                                        <Clock className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-1">Horario</h3>
                                        <p className="text-muted-foreground text-base">Lunes - Viernes: 13:00 - 16:00, 20:00 - 23:30</p>
                                        <p className="text-muted-foreground text-base">Sábado - Domingo: 13:00 - 23:30</p>
                                        <p className="text-sm text-primary font-medium mt-1">Cerrado: Martes</p>
                                    </div>
                                </div>
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
