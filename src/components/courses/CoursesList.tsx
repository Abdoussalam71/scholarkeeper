
import { Search, Loader2, Pencil, Eye, Trash2, Plus, BookOpen, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCoursesData } from "@/hooks/useCoursesData";
import { CourseDialog } from "@/components/courses/CourseDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Course } from "@/types/courses";

export function CoursesList() {
  const { 
    courses, 
    isLoading, 
    searchTerm, 
    setSearchTerm,
    addCourse,
    updateCourse,
    deleteCourse
  } = useCoursesData();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteCourse(id);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setDeletingId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsDialogOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsDialogOpen(true);
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveCourse = (courseData: Omit<Course, "id">) => {
    if (selectedCourse) {
      updateCourse(selectedCourse.id, courseData);
    } else {
      addCourse(courseData);
    }
  };

  const getStatusBadge = (status: Course["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Actif</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500">Inactif</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Terminé</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl">Liste des Cours</CardTitle>
          <div className="flex space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un cours..."
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
            <Button onClick={handleAddCourse}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un cours
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2">Chargement des cours...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du cours</TableHead>
                    <TableHead>Enseignant</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Horaire</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Étudiants</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        {searchTerm 
                          ? "Aucun cours trouvé pour cette recherche" 
                          : "Aucun cours disponible. Cliquez sur 'Ajouter un cours' pour commencer."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{course.name}</div>
                            <div className="text-xs text-muted-foreground">{course.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{course.teacherName}</TableCell>
                        <TableCell>{course.className || "Aucune"}</TableCell>
                        <TableCell>{course.schedule}</TableCell>
                        <TableCell>{course.duration}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            course.currentStudents === course.maxStudents 
                              ? 'text-amber-600' 
                              : course.currentStudents > course.maxStudents 
                                ? 'text-red-600' 
                                : ''
                          }`}>
                            {course.currentStudents}/{course.maxStudents}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(course.status)}</TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewCourse(course)}>
                              <Eye className="h-4 w-4 mr-1" />
                              Détails
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEditCourse(course)}>
                              <Pencil className="h-4 w-4 mr-1" />
                              Éditer
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteClick(course)}
                              disabled={deletingId === course.id}
                              className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
                            >
                              {deletingId === course.id ? (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 mr-1" />
                              )}
                              Supprimer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour ajouter ou modifier un cours */}
      <CourseDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        course={selectedCourse || undefined}
        onSave={handleSaveCourse}
        title={selectedCourse ? "Modifier le cours" : "Ajouter un cours"}
      />

      {/* Dialog de confirmation pour la suppression */}
      {selectedCourse && (
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title="Supprimer le cours"
          description={`Êtes-vous sûr de vouloir supprimer le cours "${selectedCourse.name}" ? Cette action est irréversible.`}
          onConfirm={() => handleDelete(selectedCourse.id)}
          confirmLabel="Supprimer"
        />
      )}
    </>
  );
}
