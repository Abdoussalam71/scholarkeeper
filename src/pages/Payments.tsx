
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PaymentDialog, PaymentData } from "@/components/payments/PaymentDialog";

// Types de paiement pour démonstration
const initialPayments: PaymentData[] = [
  {
    id: "PAY-001",
    studentId: "1",
    studentName: "Sophie Martin",
    amount: 250000,
    discountPercentage: 0,
    finalAmount: 250000,
    status: "payé",
    date: "2023-09-15",
    method: "carte bancaire",
    category: "frais de scolarité"
  },
  {
    id: "PAY-002",
    studentId: "2",
    studentName: "Thomas Dubois",
    amount: 250000,
    discountPercentage: 0,
    finalAmount: 250000,
    status: "en attente",
    date: "2023-09-20",
    method: "virement",
    category: "frais de scolarité"
  },
  {
    id: "PAY-003",
    studentId: "3",
    studentName: "Emma Petit",
    amount: 45000,
    discountPercentage: 0,
    finalAmount: 45000,
    status: "retard",
    date: "2023-09-01",
    method: "chèque",
    category: "activité extrascolaire"
  },
  {
    id: "PAY-004",
    studentId: "4",
    studentName: "Lucas Bernard",
    amount: 75000,
    discountPercentage: 10,
    finalAmount: 67500,
    status: "payé",
    date: "2023-09-10",
    method: "carte bancaire",
    category: "cantine"
  },
  {
    id: "PAY-005",
    studentId: "5",
    studentName: "Chloé Richard",
    amount: 50000,
    discountPercentage: 5,
    finalAmount: 47500,
    status: "payé",
    date: "2023-09-05",
    method: "espèces",
    category: "transport"
  }
];

const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("all");
  const [payments, setPayments] = useState<PaymentData[]>(initialPayments);
  
  // État pour les dialogues
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
  
  // Filtrer les paiements en fonction du terme de recherche et de l'onglet actif
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tab === "all") return matchesSearch;
    if (tab === "pending") return matchesSearch && payment.status === "en attente";
    if (tab === "paid") return matchesSearch && payment.status === "payé";
    if (tab === "late") return matchesSearch && payment.status === "retard";
    
    return matchesSearch;
  });

  // Obtenir les statistiques des paiements
  const totalReceived = payments
    .filter(p => p.status === "payé")
    .reduce((sum, p) => sum + p.finalAmount, 0);
  
  const totalPending = payments
    .filter(p => p.status === "en attente")
    .reduce((sum, p) => sum + p.finalAmount, 0);
  
  const totalLate = payments
    .filter(p => p.status === "retard")
    .reduce((sum, p) => sum + p.finalAmount, 0);

  // Formater les montants en FCFA XOF
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' FCFA';
  };

  // Helper pour obtenir la couleur du statut
  const getStatusColor = (status: PaymentData["status"]) => {
    switch (status) {
      case "payé": return "text-green-600 bg-green-100";
      case "en attente": return "text-amber-600 bg-amber-100";
      case "retard": return "text-red-600 bg-red-100";
      default: return "";
    }
  };

  // Gestionnaires d'événements
  const handleAddPayment = (payment: Omit<PaymentData, "id">) => {
    const newPayment = {
      ...payment,
      id: `PAY-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    };
    setPayments([...payments, newPayment]);
  };

  const handleEditPayment = (payment: PaymentData) => {
    setSelectedPayment(payment);
    setEditDialogOpen(true);
  };

  const handleUpdatePayment = (updatedPayment: Omit<PaymentData, "id">) => {
    if (selectedPayment) {
      const updatedPayments = payments.map(p => 
        p.id === selectedPayment.id 
          ? { ...updatedPayment, id: selectedPayment.id } 
          : p
      );
      setPayments(updatedPayments);
    }
  };

  const handleDeletePayment = () => {
    if (selectedPayment) {
      setPayments(payments.filter(p => p.id !== selectedPayment.id));
    }
  };

  const handleDeleteClick = (payment: PaymentData) => {
    setSelectedPayment(payment);
    setDeleteDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold font-playfair">Gestion des Paiements</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Période
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button onClick={() => setAddDialogOpen(true)}>
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
              <div className="text-2xl font-bold">{formatCurrency(totalReceived)}</div>
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
              <div className="text-2xl font-bold">{formatCurrency(totalPending)}</div>
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
              <div className="text-2xl font-bold">{formatCurrency(totalLate)}</div>
              <p className="text-xs text-red-600 mt-1">Paiements en retard</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des paiements */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="font-playfair">Historique des Paiements</CardTitle>
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
                        <TableHead>Réduction</TableHead>
                        <TableHead>Final</TableHead>
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
                          <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                            Aucun paiement trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.id}</TableCell>
                            <TableCell>{payment.studentName}</TableCell>
                            <TableCell>{formatCurrency(payment.amount)}</TableCell>
                            <TableCell>{payment.discountPercentage}%</TableCell>
                            <TableCell>{formatCurrency(payment.finalAmount)}</TableCell>
                            <TableCell>{new Date(payment.date).toLocaleDateString('fr-FR')}</TableCell>
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
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditPayment(payment)}>
                                  Modifier
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(payment)}>
                                  Supprimer
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="paid" className="mt-0">
                {/* Même tableau que "all" avec les filtres appliqués automatiquement */}
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Étudiant</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Réduction</TableHead>
                        <TableHead>Final</TableHead>
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
                          <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                            Aucun paiement trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.id}</TableCell>
                            <TableCell>{payment.studentName}</TableCell>
                            <TableCell>{formatCurrency(payment.amount)}</TableCell>
                            <TableCell>{payment.discountPercentage}%</TableCell>
                            <TableCell>{formatCurrency(payment.finalAmount)}</TableCell>
                            <TableCell>{new Date(payment.date).toLocaleDateString('fr-FR')}</TableCell>
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
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditPayment(payment)}>
                                  Modifier
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(payment)}>
                                  Supprimer
                                </Button>
                              </div>
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
                        <TableHead>Réduction</TableHead>
                        <TableHead>Final</TableHead>
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
                          <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                            Aucun paiement trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.id}</TableCell>
                            <TableCell>{payment.studentName}</TableCell>
                            <TableCell>{formatCurrency(payment.amount)}</TableCell>
                            <TableCell>{payment.discountPercentage}%</TableCell>
                            <TableCell>{formatCurrency(payment.finalAmount)}</TableCell>
                            <TableCell>{new Date(payment.date).toLocaleDateString('fr-FR')}</TableCell>
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
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditPayment(payment)}>
                                  Modifier
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(payment)}>
                                  Supprimer
                                </Button>
                              </div>
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
                        <TableHead>Réduction</TableHead>
                        <TableHead>Final</TableHead>
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
                          <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                            Aucun paiement trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.id}</TableCell>
                            <TableCell>{payment.studentName}</TableCell>
                            <TableCell>{formatCurrency(payment.amount)}</TableCell>
                            <TableCell>{payment.discountPercentage}%</TableCell>
                            <TableCell>{formatCurrency(payment.finalAmount)}</TableCell>
                            <TableCell>{new Date(payment.date).toLocaleDateString('fr-FR')}</TableCell>
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
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditPayment(payment)}>
                                  Modifier
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(payment)}>
                                  Supprimer
                                </Button>
                              </div>
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
        
        {/* Dialogs */}
        <PaymentDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onSave={handleAddPayment}
          title="Ajouter un paiement"
        />
        
        {selectedPayment && (
          <>
            <PaymentDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              payment={selectedPayment}
              onSave={handleUpdatePayment}
              title="Modifier le paiement"
            />
            
            <ConfirmDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              onConfirm={handleDeletePayment}
              title="Supprimer le paiement"
              description={`Êtes-vous sûr de vouloir supprimer le paiement "${selectedPayment.id}" pour l'étudiant "${selectedPayment.studentName}" ? Cette action est irréversible.`}
              confirmLabel="Supprimer"
            />
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default PaymentsPage;
