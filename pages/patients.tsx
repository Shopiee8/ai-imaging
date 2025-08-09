
import React, { useState, useEffect } from "react";
import { Patient, XRayAnalysis } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Plus, Search, User, Calendar, FileText, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, differenceInYears } from 'date-fns';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Form to add a new patient
const AddPatientForm = ({ onPatientAdded }) => {
  const [newPatient, setNewPatient] = useState({
    full_name: '',
    date_of_birth: '',
    gender: 'female',
    medical_record_number: ''
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async () => {
    try {
      await Patient.create(newPatient);
      setNewPatient({ full_name: '', date_of_birth: '', gender: 'female', medical_record_number: '' });
      onPatientAdded();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to add patient:", error);
      alert("Error: Could not add patient.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" value={newPatient.full_name} onChange={(e) => setNewPatient({...newPatient, full_name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" value={newPatient.date_of_birth} onChange={(e) => setNewPatient({...newPatient, date_of_birth: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mrn">Medical Record Number</Label>
            <Input id="mrn" value={newPatient.medical_record_number} onChange={(e) => setNewPatient({...newPatient, medical_record_number: e.target.value})} />
          </div>
          <Button onClick={handleSave} className="w-full">Save Patient</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const patientList = await Patient.list('-created_date');
      setPatients(patientList);
    } catch (error) {
      console.error("Failed to load patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.medical_record_number && p.medical_record_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const getAge = (dob) => {
    if (!dob) return 'N/A';
    return differenceInYears(new Date(), new Date(dob));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Patient Records</h1>
            <p className="text-slate-600">Manage patient information and view analysis history.</p>
          </div>
          <AddPatientForm onPatientAdded={loadPatients} />
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2 mt-4">
              <Search className="w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Search patients by name or medical record number..." 
                className="flex-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
              </div>
            ) : filteredPatients.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map(patient => (
                  <Card key={patient.id} className="hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <User className="w-6 h-6 text-blue-600" />
                        {patient.full_name}
                      </CardTitle>
                      <CardDescription>MRN: {patient.medical_record_number || 'N/A'}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                       <p><strong>Age:</strong> {getAge(patient.date_of_birth)} years</p>
                       <p><strong>Gender:</strong> <span className="capitalize">{patient.gender}</span></p>
                       <p><strong>Date of Birth:</strong> {format(new Date(patient.date_of_birth), 'MMMM d, yyyy')}</p>
                       <Button variant="outline" className="w-full mt-2">
                         View Analyses <ArrowRight className="w-4 h-4 ml-2" />
                       </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium mb-2">No Patient Records Found</p>
                <p>Click "Add Patient" to create the first patient record.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
