
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSchoolInfoStore, SchoolInfo } from "@/stores/schoolInfoStore";

const SchoolInfoSettings = () => {
  const { schoolInfo, updateSchoolInfo } = useSchoolInfoStore();
  
  // Valeurs par défaut pour le formulaire
  const defaultSchoolInfo: SchoolInfo = {
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    principalName: ""
  };
  
  const [formData, setFormData] = useState<SchoolInfo>(schoolInfo || defaultSchoolInfo);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (schoolInfo) {
      setFormData(schoolInfo);
    }
  }, [schoolInfo]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier que tous les champs requis sont remplis
    if (!formData.name || !formData.address || !formData.city || 
        !formData.postalCode || !formData.phone || !formData.email || 
        !formData.principalName) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    updateSchoolInfo(formData);
    setIsEditing(false);
    toast.success("Informations mises à jour avec succès");
  };
  
  const handleReset = () => {
    setFormData(schoolInfo || defaultSchoolInfo);
    setIsEditing(false);
  };
  
  return (
    <div className="space-y-6">
      {!isEditing && schoolInfo ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Nom de l'établissement</h3>
              <p className="font-medium">{schoolInfo.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Directeur/Principal</h3>
              <p>{schoolInfo.principalName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Adresse</h3>
              <p>{schoolInfo.address}, {schoolInfo.postalCode} {schoolInfo.city}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact</h3>
              <p>{schoolInfo.phone}, {schoolInfo.email}</p>
            </div>
            {schoolInfo.website && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Site web</h3>
                <p>{schoolInfo.website}</p>
              </div>
            )}
          </div>
          
          {schoolInfo.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
              <p className="text-sm">{schoolInfo.description}</p>
            </div>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(true)}
            className="mt-4"
          >
            Modifier les informations
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'établissement *</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Lycée XYZ"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="principalName">Directeur/Principal *</Label>
              <Input 
                id="principalName"
                name="principalName"
                value={formData.principalName}
                onChange={handleChange}
                placeholder="Jean Dupont"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse *</Label>
              <Input 
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 rue de l'École"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal *</Label>
                <Input 
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="75001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville *</Label>
                <Input 
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Paris"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input 
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+33 1 23 45 67 89"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@lycee.fr"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input 
                id="website"
                name="website"
                value={formData.website || ""}
                onChange={handleChange}
                placeholder="https://www.lycee.fr"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Description de l'établissement..."
              rows={4}
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit">Enregistrer</Button>
            {schoolInfo && (
              <Button type="button" variant="outline" onClick={handleReset}>
                Annuler
              </Button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default SchoolInfoSettings;
