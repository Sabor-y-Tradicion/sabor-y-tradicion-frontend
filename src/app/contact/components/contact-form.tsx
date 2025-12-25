"use client";

import { useState, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validación básica
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Por favor, introduce un email válido",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulación de envío (aquí conectarías con tu backend)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "¡Mensaje enviado!",
        description: "Gracias por contactarnos. Te responderemos pronto.",
      });

      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el mensaje. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="flex w-full flex-col border-2">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Envíanos un Mensaje</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <form onSubmit={handleSubmit} className="flex h-full flex-col justify-between space-y-6">
          <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <Label htmlFor="subject">Asunto *</Label>
              <Input
                id="subject"
                placeholder="Ej: Reserva para 4 personas"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-6 space-y-2">
              <Label htmlFor="message">Mensaje *</Label>
              <Textarea
                id="message"
                placeholder="Escribe tu mensaje aquí..."
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

