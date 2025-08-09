import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, Calendar, FileImage, Activity } from "lucide-react";

export default function PatientInfoForm({ onSubmit, uploadedFile }) {
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_age: '',
    patient_gender: '',
    anatomical_region: '',
    analysis_notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.patient_name && formData.patient_age && formData.patient_gender && formData.anatomical_region;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <User className="w-5 h-5 text-blue-600" />
          Patient Information & Analysis Setup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Uploaded File Preview */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <FileImage className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-slate-900">Uploaded: {uploadedFile.file.name}</p>
              <p className="text-sm text-slate-600">
                {(uploadedFile.file.size / (1024 * 1024)).toFixed(2)} MB • Ready for texture analysis
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="patient_name">Patient Name *</Label>
              <Input
                id="patient_name"
                value={formData.patient_name}
                onChange={(e) => handleInputChange('patient_name', e.target.value)}
                placeholder="Enter patient's full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient_age">Age *</Label>
              <Input
                id="patient_age"
                type="number"
                min="1"
                max="120"
                value={formData.patient_age}
                onChange={(e) => handleInputChange('patient_age', parseInt(e.target.value))}
                placeholder="Patient age"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient_gender">Gender *</Label>
              <Select value={formData.patient_gender} onValueChange={(value) => handleInputChange('patient_gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="anatomical_region">Anatomical Region *</Label>
              <Select value={formData.anatomical_region} onValueChange={(value) => handleInputChange('anatomical_region', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region for analysis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proximal_femur">Proximal Femur (Singh Index)</SelectItem>
                  <SelectItem value="calcaneus">Calcaneus (Jhamaria Index)</SelectItem>
                  <SelectItem value="clavicle">Clavicle (Cortical Analysis)</SelectItem>
                  <SelectItem value="lumbar_spine">Lumbar Spine (Trabecular Pattern)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="analysis_notes">Clinical Notes (Optional)</Label>
            <Textarea
              id="analysis_notes"
              value={formData.analysis_notes}
              onChange={(e) => handleInputChange('analysis_notes', e.target.value)}
              placeholder="Additional clinical information, symptoms, risk factors, or relevant medical history that may influence texture analysis..."
              className="h-24"
            />
          </div>

          {/* Info Box */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Texture Analysis Process</h4>
                <p className="text-sm text-slate-700">
                  The system will calculate multiple texture indices including Singh Index, GLCM parameters, 
                  and fractal dimensions to predict BMD and assess osteoporosis risk without requiring a DXA scan.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3"
          >
            Start Texture Analysis
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}