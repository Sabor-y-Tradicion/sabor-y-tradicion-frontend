"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface WeekDay {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: string;
  close: string;
  closed: boolean;
}

interface HoursScheduleProps {
  hours: WeekDay[];
  onChange: (hours: WeekDay[]) => void;
}

const dayNames = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

export function HoursSchedule({ hours, onChange }: HoursScheduleProps) {
  const handleDayChange = (
    dayIndex: number,
    field: keyof WeekDay,
    value: string | boolean
  ) => {
    const newHours = [...hours];
    newHours[dayIndex] = { ...newHours[dayIndex], [field]: value };
    onChange(newHours);
  };

  const copyToAll = (sourceDay: WeekDay) => {
    const newHours = hours.map((day) => ({
      ...day,
      open: sourceDay.open,
      close: sourceDay.close,
      closed: sourceDay.closed,
    }));
    onChange(newHours);
  };

  return (
    <div className="space-y-4">
      {hours.map((dayHours, index) => (
        <div
          key={dayHours.day}
          className="flex items-center gap-4 p-4 border rounded-lg"
        >
          <div className="w-28">
            <Label className="font-medium">
              {dayNames[dayHours.day]}
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={!dayHours.closed}
              onCheckedChange={(checked) =>
                handleDayChange(index, 'closed', !checked)
              }
            />
            <Label className="text-sm text-muted-foreground">
              {dayHours.closed ? 'Cerrado' : 'Abierto'}
            </Label>
          </div>

          {!dayHours.closed && (
            <>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label className="text-xs">Apertura</Label>
                  <Input
                    type="time"
                    value={dayHours.open}
                    onChange={(e) => handleDayChange(index, 'open', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Cierre</Label>
                  <Input
                    type="time"
                    value={dayHours.close}
                    onChange={(e) => handleDayChange(index, 'close', e.target.value)}
                  />
                </div>
              </div>

              <Select onValueChange={(value) => {
                if (value === 'copy') {
                  copyToAll(dayHours);
                }
              }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Acciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="copy">Copiar a todos</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      ))}

      <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          💡 Los horarios se mostrarán en la página de contacto y footer del sitio web
        </p>
      </div>
    </div>
  );
}

