
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCoursesData } from "@/hooks/useCoursesData";

export function CoursesList() {
  const { 
    courses, 
    isLoading, 
    searchTerm, 
    setSearchTerm,
    // Autres fonctions disponibles:
    // addCourse, 
    // updateCourse, 
    // deleteCourse,
    // refreshCourses
  } = useCoursesData();

  return (
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
          </div>
          <Button>Ajouter un cours</Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Chargement des cours...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du cours</TableHead>
                <TableHead>Enseignant</TableHead>
                <TableHead>Horaire</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Étudiants</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Aucun cours trouvé
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{course.name}</div>
                        <div className="text-xs text-muted-foreground">{course.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{course.teacherName}</TableCell>
                    <TableCell>{course.schedule}</TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>{course.currentStudents}/{course.maxStudents}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Détails</Button>
                        <Button variant="outline" size="sm">Éditer</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
