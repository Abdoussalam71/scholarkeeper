
import { useState } from "react";
import { Calendar, Clock, Plus, Pencil, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScheduleEvent } from "@/types/schedule";
import { ClassData } from "@/types/classes";
import { ScheduleEventDialog } from "./ScheduleEventDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DAYS_OF_WEEK = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

interface ScheduleViewProps {
  schedules: ScheduleEvent[];
  classes: ClassData[];
  courses: { id: string; name: string; teacherName: string }[];
  isLoading: boolean;
  selectedClassId?: string;
  onClassChange: (classId: string) => void;
  onAddSchedule: (schedule: Omit<ScheduleEvent, "id">) => void;
  onUpdateSchedule: (schedule: ScheduleEvent) => void;
  onDeleteSchedule: (id: string) => void;
}

export function ScheduleView({
  schedules,
  classes,
  courses,
  isLoading,
  selectedClassId,
  onClassChange,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule
}: ScheduleViewProps) {
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setEventDialogOpen(true);
  };
  
  const handleEditEvent = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setEventDialogOpen(true);
  };
  
  const handleDeleteEvent = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };
  
  const handleSaveEvent = (eventData: Omit<ScheduleEvent, "id">) => {
    if (selectedEvent) {
      onUpdateSchedule({ ...eventData, id: selectedEvent.id });
    } else {
      onAddSchedule(eventData);
    }
  };
  
  const handleConfirmDelete = () => {
    if (selectedEvent) {
      onDeleteSchedule(selectedEvent.id);
    }
  };
  
  const selectedClass = classes.find(c => c.id === selectedClassId);
  
  // Organiser les événements par jour et heure pour faciliter l'affichage
  const eventsByDayAndTime: Record<string, Record<string, ScheduleEvent>> = {};
  
  schedules.forEach(event => {
    if (!eventsByDayAndTime[event.dayOfWeek]) {
      eventsByDayAndTime[event.dayOfWeek] = {};
    }
    
    // Pour simplifier l'exemple, on considère qu'un seul événement peut exister à un moment donné
    const timeKey = `${event.startTime}-${event.endTime}`;
    eventsByDayAndTime[event.dayOfWeek][timeKey] = event;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Planning hebdomadaire
          {selectedClass && (
            <span className="ml-2 text-lg text-muted-foreground">
              - {selectedClass.name}
            </span>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="w-64">
            <Select 
              value={selectedClassId} 
              onValueChange={onClassChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une classe" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(classItem => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {classItem.name} ({classItem.level})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2 flex items-center gap-1"
            onClick={handleAddEvent}
          >
            <Plus className="h-4 w-4" /> Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Horaire</TableHead>
                  {DAYS_OF_WEEK.map((day) => (
                    <TableHead key={day}>{day}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {TIME_SLOTS.map((startTime, index) => {
                  const endTime = TIME_SLOTS[index + 1] || "18:00";
                  const timeSlotKey = `${startTime}-${endTime}`;
                  
                  return (
                    <TableRow key={startTime}>
                      <TableCell className="font-medium">{startTime}-{endTime}</TableCell>
                      {DAYS_OF_WEEK.map((day) => {
                        const event = eventsByDayAndTime[day]?.[timeSlotKey];
                        
                        return (
                          <TableCell key={`${day}-${startTime}`} className="min-w-[200px] h-20">
                            {event ? (
                              <div className="h-full p-1 bg-primary/10 rounded-md border border-primary/20 relative group">
                                <div className="font-medium">{event.courseName}</div>
                                <div className="text-sm">{event.teacherName}</div>
                                <div className="text-xs text-muted-foreground">{event.room}</div>
                                
                                <div className="absolute right-1 top-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-6 w-6"
                                          onClick={() => handleEditEvent(event)}
                                        >
                                          <Pencil className="h-3 w-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Modifier</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-6 w-6 text-destructive"
                                          onClick={() => handleDeleteEvent(event)}
                                        >
                                          <Trash className="h-3 w-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Supprimer</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                            ) : selectedClassId ? (
                              <Button 
                                variant="ghost" 
                                className="h-full w-full justify-start items-start p-1 hover:bg-primary/5"
                                onClick={() => {
                                  setSelectedEvent(null);
                                  setEventDialogOpen(true);
                                }}
                              >
                                <Plus className="h-3 w-3 opacity-30" />
                              </Button>
                            ) : null}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      
      {/* Dialogs */}
      <ScheduleEventDialog 
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        event={selectedEvent || undefined}
        onSave={handleSaveEvent}
        title={selectedEvent ? "Modifier un cours" : "Ajouter un cours"}
        classes={classes}
        courses={courses}
      />
      
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Supprimer ce cours"
        description={`Êtes-vous sûr de vouloir supprimer le cours ${selectedEvent?.courseName} de l'emploi du temps ?`}
        confirmLabel="Supprimer"
      />
    </Card>
  );
}
