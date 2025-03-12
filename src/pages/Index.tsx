
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { studentService, teacherService, courseService } from "@/services/database";

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      title: "Étudiants Total",
      value: "0",
      icon: Users,
      description: "Chargement...",
      url: "/students"
    },
    {
      title: "Enseignants",
      value: "0",
      icon: GraduationCap,
      description: "Chargement...",
      url: "/teachers"
    },
    {
      title: "Cours Actifs",
      value: "0",
      icon: BookOpen,
      description: "Chargement...",
      url: "/courses"
    },
    {
      title: "Classes",
      value: "0",
      icon: CreditCard,
      description: "Par niveaux",
      url: "/classes"
    },
  ]);

  // Initialize database
  const { isLoading: isLoadingStudents } = useQuery({
    queryKey: ["studentsInit"],
    queryFn: async () => {
      await studentService.initDatabase();
      return true;
    },
    staleTime: Infinity
  });

  const { isLoading: isLoadingTeachers } = useQuery({
    queryKey: ["teachersInit"],
    queryFn: async () => {
      await teacherService.initDatabase();
      return true;
    },
    staleTime: Infinity
  });

  const { isLoading: isLoadingCourses } = useQuery({
    queryKey: ["coursesInit"],
    queryFn: async () => await courseService.initDatabase(),
    staleTime: Infinity
  });

  // Fetch counts
  const { data: studentsCount = 0 } = useQuery({
    queryKey: ["studentsCount"],
    queryFn: async () => {
      const students = await studentService.getAllStudents();
      return students.length;
    },
    enabled: !isLoadingStudents
  });

  const { data: teachersCount = 0 } = useQuery({
    queryKey: ["teachersCount"],
    queryFn: async () => {
      const teachers = await teacherService.getAllTeachers();
      return teachers.length;
    },
    enabled: !isLoadingTeachers
  });

  const { data: coursesCount = 0 } = useQuery({
    queryKey: ["coursesCount"],
    queryFn: async () => {
      const courses = await courseService.getAllCourses();
      return courses.length;
    },
    enabled: !isLoadingCourses
  });

  const { data: classesData } = useQuery({
    queryKey: ["classesByLevel"],
    queryFn: async () => {
      const { classService } = await import('@/services/database');
      const classes = await classService.getAllClasses();
      
      // Count classes by level
      const countByLevel = classes.reduce((acc, cls) => {
        acc[cls.level] = (acc[cls.level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return {
        total: classes.length,
        byLevel: countByLevel
      };
    }
  });

  // Update stats when data is loaded
  useEffect(() => {
    if (studentsCount !== undefined) {
      setStats(prev => 
        prev.map(stat => 
          stat.title === "Étudiants Total" 
            ? { 
                ...stat, 
                value: studentsCount.toString(),
                description: `${studentsCount} élèves enregistrés`
              } 
            : stat
        )
      );
    }
  }, [studentsCount]);

  useEffect(() => {
    if (teachersCount !== undefined) {
      setStats(prev => 
        prev.map(stat => 
          stat.title === "Enseignants" 
            ? { 
                ...stat, 
                value: teachersCount.toString(),
                description: `${teachersCount} professeurs actifs`
              } 
            : stat
        )
      );
    }
  }, [teachersCount]);

  useEffect(() => {
    if (coursesCount !== undefined) {
      setStats(prev => 
        prev.map(stat => 
          stat.title === "Cours Actifs" 
            ? { 
                ...stat, 
                value: coursesCount.toString(),
                description: `${coursesCount} cours programmés`
              } 
            : stat
        )
      );
    }
  }, [coursesCount]);

  useEffect(() => {
    if (classesData) {
      const { total, byLevel } = classesData;
      const levelDescription = Object.entries(byLevel)
        .map(([level, count]) => `${count} ${level}`)
        .join(', ');
      
      setStats(prev => 
        prev.map(stat => 
          stat.title === "Classes" 
            ? { 
                ...stat, 
                value: total.toString(),
                description: levelDescription || "Par niveaux"
              } 
            : stat
        )
      );
    }
  }, [classesData]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <SidebarTrigger />
          <div className="space-y-8 animate-in">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
              <p className="text-muted-foreground">Bienvenue sur ScholarKeeper</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Link key={stat.title} to={stat.url}>
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>Dernières actions effectuées</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">En construction...</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cours du jour</CardTitle>
                  <CardDescription>Planning des cours d'aujourd'hui</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">En construction...</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Messages importants</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">En construction...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
