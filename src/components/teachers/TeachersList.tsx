
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Calendar } from "lucide-react";
import { TeacherData } from "@/types/teachers";

interface TeachersListProps {
  teachers: TeacherData[];
  onEdit: (teacher: TeacherData) => void;
  onDelete: (teacherId: string) => void;
  onViewSchedule?: (teacherId: string) => void;
}

export const TeachersList = ({ teachers, onEdit, onDelete, onViewSchedule }: TeachersListProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Matière</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Disponibilité</TableHead>
            <TableHead>Date d'embauche</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Aucun enseignant trouvé
              </TableCell>
            </TableRow>
          ) : (
            teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell className="font-medium">{teacher.name}</TableCell>
                <TableCell>{teacher.subject}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.phone}</TableCell>
                <TableCell>{teacher.availability}</TableCell>
                <TableCell>{teacher.hireDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {onViewSchedule && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Voir l'emploi du temps"
                        onClick={() => onViewSchedule(teacher.id)}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Modifier"
                      onClick={() => onEdit(teacher)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Supprimer"
                      onClick={() => onDelete(teacher.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
