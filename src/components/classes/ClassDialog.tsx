
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClassData, StudyLevel } from "@/types/classes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const studyLevels: StudyLevel[] = ['Collège', 'Lycée', 'Professionnel', 'Technique', 'Supérieur'];

const classSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  level: z.enum(['Collège', 'Lycée', 'Professionnel', 'Technique', 'Supérieur'] as const),
  description: z.string().optional(),
  students: z.array(z.string()).default([])
});

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData?: ClassData;
  onSave: (classData: Omit<ClassData, "id">) => void;
  title: string;
}

export const ClassDialog = ({
  open,
  onOpenChange,
  classData,
  onSave,
  title
}: ClassDialogProps) => {
  const isEditing = !!classData;
  
  const form = useForm<z.infer<typeof classSchema>>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: classData?.name || "",
      level: classData?.level || "Lycée",
      description: classData?.description || "",
      students: classData?.students || []
    }
  });
  
  useEffect(() => {
    if (open && classData) {
      form.reset({
        name: classData.name,
        level: classData.level,
        description: classData.description || "",
        students: classData.students
      });
    } else if (open) {
      form.reset({
        name: "",
        level: "Lycée",
        description: "",
        students: []
      });
    }
  }, [open, classData, form]);
  
  const onSubmit = (data: z.infer<typeof classSchema>) => {
    // Make sure all required fields are present for Omit<ClassData, "id">
    const classToSave = {
      name: data.name,
      level: data.level,
      description: data.description,
      students: data.students || [] // Ensure students array is never undefined
    };
    
    onSave(classToSave);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la classe</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Seconde A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau d'étude</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un niveau" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {studyLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description de la classe..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">{isEditing ? "Mettre à jour" : "Ajouter"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
