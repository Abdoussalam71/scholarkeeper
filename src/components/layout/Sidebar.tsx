
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  CreditCard, 
  School,
  Settings,
  LayoutDashboard, 
  HelpCircle,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigationItems = [
  {
    title: "Tableau de bord",
    icon: LayoutDashboard,
    url: "/",
  },
  {
    title: "Étudiants",
    icon: Users,
    url: "/students",
  },
  {
    title: "Enseignants",
    icon: GraduationCap,
    url: "/teachers",
  },
  {
    title: "Cours",
    icon: BookOpen,
    url: "/courses",
  },
  {
    title: "Classes",
    icon: School,
    url: "/classes",
  },
  {
    title: "Emploi du temps",
    icon: Calendar,
    url: "/schedule",
  },
  {
    title: "Paiements",
    icon: CreditCard,
    url: "/payments",
  },
];

const utilityItems = [
  {
    title: "Paramètres",
    icon: Settings,
    url: "/settings",
  },
  {
    title: "Aide",
    icon: HelpCircle,
    url: "/help",
  },
];

export default function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center p-4">
        <div className="flex items-center gap-2">
          <School className="h-6 w-6 text-primary" />
          <div className="text-lg font-bold">ScholarKeeper</div>
        </div>
        <SidebarTrigger className="absolute right-2 top-4 md:hidden" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={location.pathname === item.url ? "bg-accent text-accent-foreground" : ""}
                    tooltip={item.title}
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>Paramètres</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={location.pathname === item.url ? "bg-accent text-accent-foreground" : ""}
                    tooltip={item.title}
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="mt-auto p-4">
        <SidebarMenuButton 
          className="w-full justify-start text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
          tooltip="Se déconnecter"
        >
          <div className="flex items-center gap-3 px-3 py-2">
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </div>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
