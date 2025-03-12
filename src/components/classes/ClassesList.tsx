
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Users } from "lucide-react";
import { ClassData, StudyLevel } from "@/types/classes";
import { Badge } from "@/components/ui/badge";

interface ClassesListProps {
  classes: ClassData[];
  onEdit: (classData: ClassData) => void;
  onDelete: (classId: string) => void;
  onManageStudents?: (classData: ClassData) => void;
}

// Couleur pour chaque niveau d'étude
const levelColors: Record<StudyLevel, string> = {
  'Collège': 'bg-blue-100 text-blue-800',
  'Lycée': 'bg-green-100 text-green-800',
  'Professionnel': 'bg-yellow-100 text-yellow-800',
  'Technique': 'bg-purple-100 text-purple-800',
  'Supérieur': 'bg-red-100 text-red-800',
};

export const ClassesList = ({ classes, onEdit, onDelete, onManageStudents }: ClassesListProps) => {
  // Organiser les classes par niveau d'étude
  const classesByLevel = classes.reduce((acc, classItem) => {
    acc[classItem.level] = acc[classItem.level] || [];
    acc[classItem.level].push(classItem);
    return acc;
  }, {} as Record<StudyLevel, ClassData[]>);

  // Ordre d'affichage des niveaux
  const orderedLevels: StudyLevel[] = ['Collège', 'Lycée', 'Professionnel', 'Technique', 'Supérieur'];

  return (
    <div className="space-y-8">
      {classes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucune classe trouvée
        </div>
      ) : (
        orderedLevels.map(level => {
          const levelClasses = classesByLevel[level] || [];
          if (levelClasses.length === 0) return null;
          
          return (
            <div key={level} className="space-y-4">
              <h3 className="text-lg font-semibold">
                <Badge className={levelColors[level]}>{level}</Badge>
              </h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Nombre d'élèves</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {levelClasses.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell className="font-medium">{classItem.name}</TableCell>
                      <TableCell>{classItem.description || "-"}</TableCell>
                      <TableCell>{classItem.students.length}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {onManageStudents && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              title="Gérer les élèves"
                              onClick={() => onManageStudents(classItem)}
                            >
                              <Users className="h-4 w-4 mr-1" />
                              Élèves
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Modifier"
                            onClick={() => onEdit(classItem)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Supprimer"
                            onClick={() => onDelete(classItem.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          );
        })
      )}
    </div>
  );
};
