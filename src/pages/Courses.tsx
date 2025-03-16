
import AppLayout from "@/components/layout/AppLayout";
import { CoursesList } from "@/components/courses/CoursesList";

const CoursesPage = () => {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold font-playfair">Gestion des Cours</h1>
        </div>
        
        <CoursesList />
      </div>
    </AppLayout>
  );
};

export default CoursesPage;
