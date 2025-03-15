
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SchoolInfoSettings from "@/components/settings/SchoolInfoSettings";
import { Separator } from "@/components/ui/separator";
import { Building2, Shield, Bell, Languages } from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("school-info");

  return (
    <AppLayout>
      <div className="container p-4 sm:p-6 space-y-6 animate-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez les paramètres et les préférences de votre établissement.
          </p>
        </div>
        
        <Separator />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full sm:w-auto mb-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <TabsTrigger value="school-info" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Informations de l'école</span>
              <span className="sm:hidden">École</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Sécurité & Accès</span>
              <span className="sm:hidden">Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Notifs</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">Langue & Région</span>
              <span className="sm:hidden">Langue</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="school-info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'établissement</CardTitle>
                <CardDescription>
                  Modifiez les informations générales de votre établissement scolaire.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SchoolInfoSettings />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité et Accès</CardTitle>
                <CardDescription>
                  Gérez les paramètres de sécurité et les droits d'accès.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Les options de sécurité et d'accès seront disponibles prochainement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configurez vos préférences de notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Les options de notifications seront disponibles prochainement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="language" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Langue et Région</CardTitle>
                <CardDescription>
                  Modifiez les paramètres de langue et régionaux.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Les options de langue et région seront disponibles prochainement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
