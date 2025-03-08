
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseData } from "@/types/courses";

// Sample course data
const coursesData: CourseData[] = [
  {
    id: "1",
    name: "Mathématiques Avancées",
    description: "Cours de mathématiques pour niveau avancé",
    teacherId: "1",
    teacherName: "Jean Dupont",
    schedule: "Lundi 10:00 - 12:00",
    duration: "2 heures",
    maxStudents: 25,
    currentStudents: 18
  },
  {
    id: "2",
    name: "Physique Fondamentale",
    description: "Introduction aux concepts de base de la physique",
    teacherId: "2",
    teacherName: "Marie Lambert",
    schedule: "Mardi 14:00 - 16:00",
    duration: "2 heures",
    maxStudents: 30,
    currentStudents: 22
  },
  {
    id: "3",
    name: "Littérature Française",
    description: "Étude des grands auteurs français",
    teacherId: "3",
    teacherName: "Sophie Martin",
    schedule: "Mercredi 9:00 - 11:00",
    duration: "2 heures",
    maxStudents: 20,
    currentStudents: 15
  },
  {
    id: "4",
    name: "Anglais Intermédiaire",
    description: "Perfectionnement en anglais pour niveau intermédiaire",
    teacherId: "4",
    teacherName: "Pierre Leclerc",
    schedule: "Jeudi 13:00 - 15:00",
    duration: "2 heures",
    maxStudents: 15,
    currentStudents: 12
  },
  {
    id: "5",
    name: "Programmation Informatique",
    description: "Introduction à la programmation et algorithmes",
    teacherId: "5",
    teacherName: "Thomas Petit",
    schedule: "Vendredi 10:00 - 13:00",
    duration: "3 heures",
    maxStudents: 20,
    currentStudents: 19
  }
];

export function CoursesList() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCourses = coursesData.filter(
    course => 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Aucun cours trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredCourses.map((course) => (
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
      </CardContent>
    </Card>
  );
}
