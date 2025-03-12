
export type StudyLevel = 'Collège' | 'Lycée' | 'Professionnel' | 'Technique' | 'Supérieur';

export interface ClassData {
  id: string;
  name: string;
  level: StudyLevel;
  description?: string;
  students: string[]; // IDs des étudiants dans la classe
}
