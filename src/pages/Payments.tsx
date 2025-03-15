
import { useState } from "react";
import { 
  Calendar, 
  CreditCard, 
  Download, 
  Filter, 
  Plus, 
  Search, 
  Receipt,
  PiggyBank,
  School
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
import { PaymentDialog } from "@/components/payments/PaymentDialog";
import { ClassFeesDialog } from "@/components/fees/ClassFeesDialog";
import { PaymentReceipt } from "@/components/payments/PaymentReceipt";
import { useFeesData } from "@/hooks/useFeesData";
import { useStudentsData } from "@/hooks/useStudentsData";

const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState("all");
  const [currentView, setCurrentView] = useState<"receipts" | "fees">("receipts");
  
  // États pour les dialogues
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addFeesDialogOpen, setAddFeesDialogOpen] = useState(false);
  const [editFeesDialogOpen, setEditFeesDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  
  // État pour l'élément sélectionné
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [selectedFees, setSelectedFees] = useState<any | null>(null);
  
  // Hooks pour les données
  const { classFees, allReceipts, addClassFees, updateClassFees, deleteClassFees, addReceipt } = useFeesData();
  const { students } = useStudentsData();
  
  // Filtrer les paiements en fonction du terme de recherche et de l'onglet actif
  const filteredReceipts = allReceipts.filter(receipt => {
    const matchesSearch = receipt.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          receipt.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tab === "all") return matchesSearch;
    if (tab === "pending") return matchesSearch && receipt.status === "en attente";
    if (tab === "paid") return matchesSearch && receipt.status === "payé";
    if (tab === "late") return matchesSearch && receipt.status === "retard";
    
    return matchesSearch;
  });

  // Filtrer les frais de scolarité
  const filteredFees = classFees.filter(fee => 
    fee.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.academicYear.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtenir les statistiques des paiements
  const totalReceived = allReceipts
    .filter(p => p.status === "payé")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalPending = allReceipts
    .filter(p => p.status === "en attente")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalLate = allReceipts
    .filter(p => p.status === "retard")
    .reduce((sum, p) => sum + p.amount, 0);

  // Formater les montants en FCFA XOF
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' FCFA';
  };

  // Helper pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "payé": return "text-green-600 bg-green-100";
      case "en attente": return "text-amber-600 bg-amber-100";
      case "retard": return "text-red-600 bg-red-100";
      default: return "";
    }
  };

  // Gestionnaires d'événements pour les paiements
  const handleAddPayment = (payment: any) => {
    addReceipt(payment);
  };

  const handleEditPayment = (payment: any) => {
    setSelectedPayment(payment);
    setEditDialogOpen(true);
  };

  const handleUpdatePayment = (updatedPayment: any) => {
    // Cette fonctionnalité serait implémentée si nous avions un service pour mettre à jour les reçus
    console.log("Updated payment:", updatedPayment);
  };

  const handleDeletePayment = () => {
    // Cette fonctionnalité serait implémentée si nous avions un service pour supprimer les reçus
    console.log("Deleted payment:", selectedPayment);
  };

  // Gestionnaires d'événements pour les frais de scolarité
  const handleAddClassFees = (fees: any) => {
    addClassFees(fees);
  };

  const handleEditClassFees = (fees: any) => {
    setSelectedFees(fees);
    setEditFeesDialogOpen(true);
  };

  const handleUpdateClassFees = (updatedFees: any) => {
    if (selectedFees) {
      updateClassFees(selectedFees.id, updatedFees);
    }
  };

  const handleDeleteClassFees = () => {
    if (selectedFees) {
      deleteClassFees(selectedFees.id);
    }
  };

  const handleViewReceipt = (receipt: any) => {
    setSelectedPayment(receipt);
    setReceiptDialogOpen(true);
  };

  const handleDeleteClick = (payment: any) => {
    setSelectedPayment(payment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteFeesClick = (fees: any) => {
    setSelectedFees(fees);
    setDeleteDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold font-playfair">Gestion des Paiements</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setCurrentView("receipts")} 
              className={currentView === "receipts" ? "bg-primary text-primary-foreground" : ""}>
              <Receipt className="mr-2 h-4 w-4" />
              Paiements
            </Button>
            <Button variant="outline" onClick={() => setCurrentView("fees")}
              className={currentView === "fees" ? "bg-primary text-primary-foreground" : ""}>
              <School className="mr-2 h-4 w-4" />
              Frais scolaires
            </Button>
            <Button onClick={currentView === "receipts" ? () => setAddDialogOpen(true) : () => setAddFeesDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {currentView === "receipts" ? "Nouveau Paiement" : "Nouveaux Frais"}
            </Button>
          </div>
        </div>

        {/* Cartes récapitulatives - visibles uniquement dans la vue des paiements */}
        {currentView === "receipts" && (
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
        )}

        {/* Contenu principal - conditionné par la vue actuelle */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="font-playfair">
                {currentView === "receipts" ? "Historique des Paiements" : "Frais Scolaires par Classe"}
              </CardTitle>
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
            {currentView === "receipts" ? (
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
                          <TableHead>N° Reçu</TableHead>
                          <TableHead>Étudiant</TableHead>
                          <TableHead>Classe</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Méthode</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReceipts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              Aucun paiement trouvé
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredReceipts.map((receipt) => (
                            <TableRow key={receipt.id}>
                              <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                              <TableCell>{receipt.studentName}</TableCell>
                              <TableCell>{receipt.className}</TableCell>
                              <TableCell>{formatCurrency(receipt.amount)}</TableCell>
                              <TableCell>{new Date(receipt.paymentDate).toLocaleDateString('fr-FR')}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                                  <span className="capitalize">{receipt.paymentMethod}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(receipt.status)}`}>
                                  {receipt.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm" onClick={() => handleViewReceipt(receipt)}>
                                    Voir reçu
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
                
                {/* Les autres onglets ont le même contenu mais sont filtrés automatiquement */}
                <TabsContent value="paid" className="mt-0">
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>N° Reçu</TableHead>
                          <TableHead>Étudiant</TableHead>
                          <TableHead>Classe</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Méthode</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReceipts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              Aucun paiement trouvé
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredReceipts.map((receipt) => (
                            <TableRow key={receipt.id}>
                              <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                              <TableCell>{receipt.studentName}</TableCell>
                              <TableCell>{receipt.className}</TableCell>
                              <TableCell>{formatCurrency(receipt.amount)}</TableCell>
                              <TableCell>{new Date(receipt.paymentDate).toLocaleDateString('fr-FR')}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                                  <span className="capitalize">{receipt.paymentMethod}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(receipt.status)}`}>
                                  {receipt.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm" onClick={() => handleViewReceipt(receipt)}>
                                    Voir reçu
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
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>N° Reçu</TableHead>
                          <TableHead>Étudiant</TableHead>
                          <TableHead>Classe</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Méthode</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReceipts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              Aucun paiement trouvé
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredReceipts.map((receipt) => (
                            <TableRow key={receipt.id}>
                              <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                              <TableCell>{receipt.studentName}</TableCell>
                              <TableCell>{receipt.className}</TableCell>
                              <TableCell>{formatCurrency(receipt.amount)}</TableCell>
                              <TableCell>{new Date(receipt.paymentDate).toLocaleDateString('fr-FR')}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                                  <span className="capitalize">{receipt.paymentMethod}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(receipt.status)}`}>
                                  {receipt.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm" onClick={() => handleViewReceipt(receipt)}>
                                    Voir reçu
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
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>N° Reçu</TableHead>
                          <TableHead>Étudiant</TableHead>
                          <TableHead>Classe</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Méthode</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReceipts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              Aucun paiement trouvé
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredReceipts.map((receipt) => (
                            <TableRow key={receipt.id}>
                              <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                              <TableCell>{receipt.studentName}</TableCell>
                              <TableCell>{receipt.className}</TableCell>
                              <TableCell>{formatCurrency(receipt.amount)}</TableCell>
                              <TableCell>{new Date(receipt.paymentDate).toLocaleDateString('fr-FR')}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                                  <span className="capitalize">{receipt.paymentMethod}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(receipt.status)}`}>
                                  {receipt.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm" onClick={() => handleViewReceipt(receipt)}>
                                    Voir reçu
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
            ) : (
              // Vue des frais scolaires
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Classe</TableHead>
                      <TableHead>Frais annuels</TableHead>
                      <TableHead>Frais d'inscription</TableHead>
                      <TableHead>Par trimestre</TableHead>
                      <TableHead>Année académique</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Aucun frais scolaire trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFees.map((fee) => (
                        <TableRow key={fee.id}>
                          <TableCell className="font-medium">{fee.className}</TableCell>
                          <TableCell>{formatCurrency(fee.yearlyAmount)}</TableCell>
                          <TableCell>{formatCurrency(fee.registrationFee)}</TableCell>
                          <TableCell>{formatCurrency(fee.termAmount)}</TableCell>
                          <TableCell>{fee.academicYear}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditClassFees(fee)}>
                                Modifier
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteFeesClick(fee)}>
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
            )}
          </CardContent>
        </Card>
        
        {/* Dialogs pour les paiements */}
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
            
            <PaymentReceipt
              open={receiptDialogOpen}
              onOpenChange={setReceiptDialogOpen}
              receipt={selectedPayment}
            />
            
            <ConfirmDialog
              open={deleteDialogOpen && currentView === "receipts"}
              onOpenChange={setDeleteDialogOpen}
              onConfirm={handleDeletePayment}
              title="Supprimer le paiement"
              description={`Êtes-vous sûr de vouloir supprimer le paiement "${selectedPayment.receiptNumber}" pour l'étudiant "${selectedPayment.studentName}" ? Cette action est irréversible.`}
              confirmLabel="Supprimer"
            />
          </>
        )}
        
        {/* Dialogs pour les frais scolaires */}
        <ClassFeesDialog
          open={addFeesDialogOpen}
          onOpenChange={setAddFeesDialogOpen}
          onSave={handleAddClassFees}
          title="Ajouter des frais scolaires"
        />
        
        {selectedFees && (
          <>
            <ClassFeesDialog
              open={editFeesDialogOpen}
              onOpenChange={setEditFeesDialogOpen}
              classFees={selectedFees}
              onSave={handleUpdateClassFees}
              title="Modifier les frais scolaires"
            />
            
            <ConfirmDialog
              open={deleteDialogOpen && currentView === "fees"}
              onOpenChange={setDeleteDialogOpen}
              onConfirm={handleDeleteClassFees}
              title="Supprimer les frais scolaires"
              description={`Êtes-vous sûr de vouloir supprimer les frais scolaires pour la classe "${selectedFees.className}" ? Cette action est irréversible.`}
              confirmLabel="Supprimer"
            />
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default PaymentsPage;
