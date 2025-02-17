
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Users, GraduationCap, Calendar, BookOpen, CreditCard } from "lucide-react";

const items = [
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

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
