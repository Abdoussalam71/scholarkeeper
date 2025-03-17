
import { useState, useRef } from "react";
import { Calendar, ClipboardList, Plus, Pencil, Trash, Printer, Download, Filter, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Evaluation } from "@/types/evaluations";
import { ClassData } from "@/types/classes";
import { EvaluationDialog } from "./EvaluationDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface EvaluationsViewProps {
  evaluations: Evaluation[];
  classes: ClassData[];
  courses: { id: string; name: string; teacherName: string }[];
  isLoading: boolean;
  selectedClassId?: string;
  onClassChange: (classId: string) => void;
  onAddEvaluation: (evaluation: Omit<Evaluation, "id">) => void;
  onUpdateEvaluation: (evaluation: Evaluation) => void;
  onDeleteEvaluation: (id: string) => void;
}

export function EvaluationsView({
  evaluations,
  classes,
  courses,
  isLoading,
  selectedClassId,
  onClassChange,
  onAddEvaluation,
  onUpdateEvaluation,
  onDeleteEvaluation
}: EvaluationsViewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [activeView, setActiveView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const printRef = useRef<HTMLDivElement>(null);
  
  const selectedClass = classes.find(c => c.id === selectedClassId);
  
  const handlePrint = useReactToPrint({
    documentTitle: `Calendrier des évaluations - ${selectedClass?.name || "Toutes les classes"}`,
    onPrintError: (error) => console.error('Print failed', error),
    onAfterPrint: () => console.log('Print completed'),
    contentRef: printRef,
  });
  
  const handleAddEvaluation = () => {
    setSelectedEvaluation(null);
    setDialogOpen(true);
  };
  
  const handleEditEvaluation = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setDialogOpen(true);
  };
  
  const handleDeleteEvaluation = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setDeleteDialogOpen(true);
  };
  
  const handleSaveEvaluation = (evaluationData: Omit<Evaluation, "id">) => {
    if (selectedEvaluation) {
      onUpdateEvaluation({ ...evaluationData, id: selectedEvaluation.id });
    } else {
      onAddEvaluation(evaluationData);
    }
  };
  
  const handleConfirmDelete = () => {
    if (selectedEvaluation) {
      onDeleteEvaluation(selectedEvaluation.id);
      setDeleteDialogOpen(false);
    }
  };
  
  const handleExportCSV = () => {
    const headers = ['Titre', 'Cours', 'Enseignant', 'Classe', 'Date', 'Heure', 'Salle', 'Points', 'Statut'];
    
    const rows = filteredEvaluations.map(evaluation => [
      evaluation.title,
      evaluation.courseName,
      evaluation.teacherName,
      evaluation.className,
      format(new Date(evaluation.date), 'dd/MM/yyyy'),
      `${evaluation.startTime} - ${evaluation.endTime}`,
      evaluation.room,
      evaluation.totalPoints.toString(),
      getStatusLabel(evaluation.status),
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `evaluations_${selectedClass?.name || 'toutes_classes'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Filtrer les évaluations
  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = 
      evaluation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter 
      ? evaluation.status === statusFilter 
      : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // Trier par date (les plus proches d'abord)
  const sortedEvaluations = [...filteredEvaluations].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  // Fonction pour afficher le libellé du statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planned': return 'Planifiée';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };
  
  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Calendrier des Évaluations
          {selectedClass && (
            <span className="ml-2 text-lg text-muted-foreground">
              - {selectedClass.name}
            </span>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value="planned">Planifiées</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
              </SelectContent>
            </Select>
            
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
          </div>
          
          <Tabs value={activeView} onValueChange={setActiveView} className="mr-4">
            <TabsList>
              <TabsTrigger value="list">Liste</TabsTrigger>
              <TabsTrigger value="calendar">Calendrier</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handlePrint()}
            className="flex items-center gap-1"
          >
            <Printer className="h-4 w-4" /> Imprimer
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportCSV}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" /> Exporter CSV
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleAddEvaluation}
          >
            <Plus className="h-4 w-4" /> Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : (
          <div className="overflow-x-auto" ref={printRef}>
            <div className="print:block hidden p-4">
              <h1 className="text-2xl font-bold text-center">
                Calendrier des Évaluations - {selectedClass?.name || "Toutes les classes"}
              </h1>
              <p className="text-center text-muted-foreground">
                Date d'impression: {format(new Date(), 'dd/MM/yyyy')}
              </p>
            </div>
            
            <TabsContent value="list" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Cours</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Horaire</TableHead>
                    <TableHead>Salle</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="w-[100px] print:hidden">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedEvaluations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        Aucune évaluation trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedEvaluations.map((evaluation) => (
                      <TableRow key={evaluation.id}>
                        <TableCell className="font-medium">{evaluation.title}</TableCell>
                        <TableCell>
                          <div>{evaluation.courseName}</div>
                          <div className="text-xs text-muted-foreground">{evaluation.teacherName}</div>
                        </TableCell>
                        <TableCell>{evaluation.className}</TableCell>
                        <TableCell>{format(new Date(evaluation.date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{evaluation.startTime} - {evaluation.endTime}</TableCell>
                        <TableCell>{evaluation.room}</TableCell>
                        <TableCell>{evaluation.totalPoints} pts</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(evaluation.status)}>
                            {getStatusLabel(evaluation.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="print:hidden">
                          <div className="flex items-center gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => handleEditEvaluation(evaluation)}
                                  >
                                    <Pencil className="h-4 w-4" />
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
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => handleDeleteEvaluation(evaluation)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Supprimer</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-0">
              <div className="grid grid-cols-1 gap-4">
                {sortedEvaluations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune évaluation trouvée
                  </div>
                ) : (
                  Object.entries(
                    sortedEvaluations.reduce((acc, evaluation) => {
                      const date = evaluation.date;
                      if (!acc[date]) {
                        acc[date] = [];
                      }
                      acc[date].push(evaluation);
                      return acc;
                    }, {} as Record<string, Evaluation[]>)
                  ).map(([date, evalsForDate]) => (
                    <div key={date} className="border rounded-md p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        {format(new Date(date), 'EEEE d MMMM yyyy', { locale: fr })}
                      </h3>
                      <div className="space-y-2">
                        {evalsForDate.map(evaluation => (
                          <div 
                            key={evaluation.id} 
                            className="p-3 border rounded-md bg-primary/5 hover:bg-primary/10 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{evaluation.title}</div>
                                <div className="text-sm">{evaluation.courseName} - {evaluation.className}</div>
                                <div className="text-sm text-muted-foreground">
                                  {evaluation.startTime} - {evaluation.endTime} | {evaluation.room}
                                </div>
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Points: </span>
                                  {evaluation.totalPoints}
                                </div>
                                {evaluation.notes && (
                                  <div className="text-sm mt-1 text-muted-foreground">
                                    {evaluation.notes}
                                  </div>
                                )}
                              </div>
                              <div className="print:hidden">
                                <Badge variant="outline" className={getStatusColor(evaluation.status)}>
                                  {getStatusLabel(evaluation.status)}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex justify-end mt-2 print:hidden">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7"
                                onClick={() => handleEditEvaluation(evaluation)}
                              >
                                <Pencil className="h-3 w-3 mr-1" /> Modifier
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-destructive"
                                onClick={() => handleDeleteEvaluation(evaluation)}
                              >
                                <Trash className="h-3 w-3 mr-1" /> Supprimer
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </div>
        )}
      </CardContent>
      
      <EvaluationDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        evaluation={selectedEvaluation || undefined}
        onSave={handleSaveEvaluation}
        title={selectedEvaluation ? "Modifier l'évaluation" : "Ajouter une évaluation"}
        classes={classes}
        courses={courses}
      />
      
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Supprimer cette évaluation"
        description={`Êtes-vous sûr de vouloir supprimer l'évaluation "${selectedEvaluation?.title}" ?`}
        confirmLabel="Supprimer"
      />
    </Card>
  );
}
