
import { useState } from "react";
import { 
  Calendar, 
  CreditCard, 
  Download, 
  Filter, 
  Plus, 
  Search, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import AppLayout from "@/components/layout/AppLayout";

// Types de paiement pour démonstration
interface Payment {
  id: string;
  studentName: string;
  amount: number;
  status: "payé" | "en attente" | "retard";
  date: string;
  method: "carte bancaire" | "espèces" | "virement" | "chèque";
  category: "frais de scolarité" | "activité extrascolaire" | "cantine" | "transport";
}

// Données démo
const demoPayments: Payment[] = [
  {
    id: "PAY-001",
    studentName: "Sophie Martin",
    amount: 450,
    status: "payé",
    date: "15/09/2023",
    method: "carte bancaire",
    category: "frais de scolarité"
  },
  {
    id: "PAY-002",
    studentName: "Thomas Dubois",
    amount: 450,
    status: "en attente",
    date: "20/09/2023",
    method: "virement",
    category: "frais de scolarité"
  },
  {
    id: "PAY-003",
    studentName: "Emma Petit",
    amount: 75,
    status: "retard",
    date: "01/09/2023",
    method: "chèque",
    category: "activité extrascolaire"
  },
  {
    id: "PAY-004",
    studentName: "Lucas Bernard",
    amount: 120,
    status: "payé",
    date: "10/09/2023",
    method: "carte bancaire",
    category: "cantine"
  },
  {
    id: "PAY-005",
    studentName: "Chloé Richard",
    amount: 85,
    status: "payé",
    date: "05/09/2023",
    method: "espèces",
    category: "transport"
  }
];

const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("all");
  
  // Filtrer les paiements en fonction du terme de recherche et de l'onglet actif
  const filteredPayments = demoPayments.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tab === "all") return matchesSearch;
    if (tab === "pending") return matchesSearch && payment.status === "en attente";
    if (tab === "paid") return matchesSearch && payment.status === "payé";
    if (tab === "late") return matchesSearch && payment.status === "retard";
    
    return matchesSearch;
  });

  // Obtenir les statistiques des paiements
  const totalReceived = demoPayments
    .filter(p => p.status === "payé")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalPending = demoPayments
    .filter(p => p.status === "en attente")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalLate = demoPayments
    .filter(p => p.status === "retard")
    .reduce((sum, p) => sum + p.amount, 0);

  // Helper pour obtenir la couleur du statut
  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "payé": return "text-green-600 bg-green-100";
      case "en attente": return "text-amber-600 bg-amber-100";
      case "retard": return "text-red-600 bg-red-100";
      default: return "";
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold">Gestion des Paiements</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Période
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Paiement
            </Button>
          </div>
        </div>

        {/* Cartes récapitulatives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Reçu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReceived.toLocaleString()} €</div>
              <p className="text-xs text-green-600 mt-1">Paiements complétés</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPending.toLocaleString()} €</div>
              <p className="text-xs text-amber-600 mt-1">Paiements à venir</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Retard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLate.toLocaleString()} €</div>
              <p className="text-xs text-red-600 mt-1">Paiements en retard</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des paiements */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Historique des Paiements</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="all" className="w-full" onValueChange={setTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="paid">Payés</TabsTrigger>
                <TabsTrigger value="pending">En attente</TabsTrigger>
                <TabsTrigger value="late">En retard</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Étudiant</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Méthode</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            Aucun paiement trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.id}</TableCell>
                            <TableCell>{payment.studentName}</TableCell>
                            <TableCell>{payment.amount} €</TableCell>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>
                              <span className="capitalize">{payment.category}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <span className="capitalize">{payment.method}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(payment.status)}`}>
                                {payment.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                Détails
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="paid" className="mt-0">
                {/* Même tableau que "all" mais avec les filtres appropriés */}
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Étudiant</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Méthode</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            Aucun paiement trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.id}</TableCell>
                            <TableCell>{payment.studentName}</TableCell>
                            <TableCell>{payment.amount} €</TableCell>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>
                              <span className="capitalize">{payment.category}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <span className="capitalize">{payment.method}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(payment.status)}`}>
                                {payment.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                Détails
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                {/* Même structure que les autres onglets */}
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Étudiant</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Méthode</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            Aucun paiement trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.id}</TableCell>
                            <TableCell>{payment.studentName}</TableCell>
                            <TableCell>{payment.amount} €</TableCell>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>
                              <span className="capitalize">{payment.category}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <span className="capitalize">{payment.method}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(payment.status)}`}>
                                {payment.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                Détails
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="late" className="mt-0">
                {/* Même structure que les autres onglets */}
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Étudiant</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Méthode</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            Aucun paiement trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.id}</TableCell>
                            <TableCell>{payment.studentName}</TableCell>
                            <TableCell>{payment.amount} €</TableCell>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>
                              <span className="capitalize">{payment.category}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <span className="capitalize">{payment.method}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(payment.status)}`}>
                                {payment.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                Détails
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PaymentsPage;
