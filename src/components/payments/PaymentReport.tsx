import { useState, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Printer, Search, X } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useStudentsData } from "@/hooks/useStudentsData";
import { useFeesData } from "@/hooks/useFeesData";

export const PaymentReport = () => {
  const { students } = useStudentsData();
  const { classFees, allReceipts } = useFeesData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | undefined>();
  const printRef = useRef<HTMLDivElement>(null);
  
  const studentsWithBalances = students
    .map(student => {
      const studentReceipts = allReceipts.filter(r => r.studentId === student.id);
      
      const totalPaid = studentReceipts.reduce((sum, receipt) => 
        sum + (receipt.status === "payé" ? receipt.amount : 0), 0);
      
      const classFee = classFees.find(fee => fee.className === student.class);
      const totalFees = classFee ? classFee.yearlyAmount : 0;
      
      const remainingBalance = totalFees - totalPaid;
      
      return {
        ...student,
        totalPaid,
        totalFees,
        remainingBalance,
        className: student.class || "Non assigné"
      };
    })
    .filter(student => student.remainingBalance > 0);
  
  const filteredStudents = studentsWithBalances.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.className.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass ? student.class === selectedClass : true;
    
    return matchesSearch && matchesClass;
  });
  
  const uniqueClasses = Array.from(
    new Set(studentsWithBalances.map(student => student.class))
  ).filter(Boolean);
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR') + ' FCFA';
  };
  
  const handlePrint = useReactToPrint({
    documentTitle: "Rapport des paiements impayés",
    onPrintError: (error) => console.error('Print failed', error),
    onAfterPrint: () => console.log('Print completed'),
    contentRef: printRef,
  });
  
  const handleDownloadCSV = () => {
    const headers = ['Nom', 'Classe', 'Frais totaux', 'Montant payé', 'Solde restant'];
    
    const rows = filteredStudents.map(student => [
      student.name,
      student.className,
      student.totalFees,
      student.totalPaid,
      student.remainingBalance
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'rapport_paiements_impayes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-playfair">Rapport des Paiements Impayés</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un étudiant..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="w-48">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  {uniqueClasses.map(classItem => {
                    const className = students.find(s => s.class === classItem)?.class || "Non assigné";
                    return (
                      <SelectItem key={classItem} value={classItem}>
                        {className}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => handlePrint()}
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          
          <Button variant="outline" onClick={handleDownloadCSV}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger CSV
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border" ref={printRef}>
          <div className="p-4 print:block hidden">
            <h1 className="text-2xl font-bold text-center">Rapport des Paiements Impayés</h1>
            <p className="text-center text-gray-500">Date d'impression: {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Frais totaux</TableHead>
                <TableHead>Montant payé</TableHead>
                <TableHead>Solde restant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Aucun étudiant avec des paiements impayés trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.className}</TableCell>
                    <TableCell>{formatCurrency(student.totalFees)}</TableCell>
                    <TableCell>{formatCurrency(student.totalPaid)}</TableCell>
                    <TableCell className="font-semibold text-red-600">
                      {formatCurrency(student.remainingBalance)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {filteredStudents.length > 0 && (
            <div className="p-4 flex justify-end">
              <div className="text-lg font-bold">
                Total des soldes impayés: {formatCurrency(
                  filteredStudents.reduce((sum, student) => sum + student.remainingBalance, 0)
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
