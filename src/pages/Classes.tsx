
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react";
import { useClassesData } from "@/hooks/useClassesData";
import { ClassData, StudyLevel } from "@/types/classes";
import { ClassesList } from "@/components/classes/ClassesList";
import { ClassDialog } from "@/components/classes/ClassDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";

const ClassesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<StudyLevel | undefined>(undefined);
  const { classes, isLoading, addClass, updateClass, deleteClass } = useClassesData(searchQuery, selectedLevel);
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);

  const levels: StudyLevel[] = ['Collège', 'Lycée', 'Professionnel', 'Technique', 'Supérieur'];

  const handleAddClass = (classData: Omit<ClassData, "id">) => {
    addClass(classData);
  };

  const handleEditClass = (classData: ClassData) => {
    setSelectedClass(classData);
    setEditDialogOpen(true);
  };

  const handleUpdateClass = (classData: Omit<ClassData, "id">) => {
    if (selectedClass) {
      updateClass({ ...classData, id: selectedClass.id });
    }
  };

  const handleDeleteDialogOpen = (classId: string) => {
    const classData = classes.find(c => c.id === classId);
    if (classData) {
      setSelectedClass(classData);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteClass = () => {
    if (selectedClass) {
      deleteClass(selectedClass.id);
    }
  };

  const handleFilterByLevel = (level?: StudyLevel) => {
    setSelectedLevel(level);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <SidebarTrigger />
          <div className="space-y-6 animate-in">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
                <p className="text-muted-foreground">Gérez toutes vos classes par niveau d'étude</p>
              </div>
              <Button 
                className="flex items-center gap-2"
                onClick={() => setAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4" /> 
                Ajouter une classe
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle>Liste des classes</CardTitle>
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="relative w-full md:w-72">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher une classe..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto">
                          <Filter className="h-4 w-4 mr-2" />
                          {selectedLevel || "Tous les niveaux"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Filtrer par niveau</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={!selectedLevel}
                          onCheckedChange={() => handleFilterByLevel(undefined)}
                        >
                          Tous les niveaux
                        </DropdownMenuCheckboxItem>
                        {levels.map(level => (
                          <DropdownMenuCheckboxItem
                            key={level}
                            checked={selectedLevel === level}
                            onCheckedChange={() => handleFilterByLevel(level)}
                          >
                            {level}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Chargement...</div>
                ) : (
                  <ClassesList 
                    classes={classes} 
                    onEdit={handleEditClass}
                    onDelete={handleDeleteDialogOpen}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Dialogs */}
          <ClassDialog
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            onSave={handleAddClass}
            title="Ajouter une classe"
          />

          {selectedClass && (
            <ClassDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              classData={selectedClass}
              onSave={handleUpdateClass}
              title="Modifier la classe"
            />
          )}

          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteClass}
            title="Supprimer la classe"
            description={`Êtes-vous sûr de vouloir supprimer la classe "${selectedClass?.name}" ? Les élèves ne seront pas supprimés, mais ils n'auront plus de classe attribuée.`}
            confirmLabel="Supprimer"
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClassesPage;
