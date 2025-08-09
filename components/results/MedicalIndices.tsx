import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Bone, Target, Microscope, Calculator, Brain, AlertCircle } from "lucide-react";

export default function MedicalIndices({ analysis }) {
  const clinicalIndices = [
    {
      name: "Singh Index",
      value: analysis.singh_index,
      maxValue: 6,
      description: "Femur trabecular pattern assessment",
      icon: Bone,
      unit: "/6",
      interpretation: analysis.singh_index >= 4 ? "Good" : analysis.singh_index >= 2 ? "Moderate" : "Poor",
      applicableTo: ['proximal_femur']
    },
    {
      name: "Jhamaria Index",
      value: analysis.jhamaria_index,
      maxValue: 10,
      description: "Calcaneus bone quality evaluation",
      icon: Target,
      unit: "/10",
      interpretation: analysis.jhamaria_index >= 7 ? "Good" : analysis.jhamaria_index >= 4 ? "Moderate" : "Poor",
      applicableTo: ['calcaneus']
    },
    {
      name: "Cortical Thickness",
      value: analysis.cortical_thickness_mm,
      maxValue: 8,
      description: "Cortical bone measurement",
      icon: Calculator,
      unit: "mm",
      interpretation: analysis.cortical_thickness_mm >= 4 ? "Normal" : analysis.cortical_thickness_mm >= 2.5 ? "Reduced" : "Severely Reduced",
      applicableTo: ['clavicle', 'proximal_femur']
    }
  ];

  const textureIndices = [
    {
      name: "GLCM Contrast",
      value: analysis.texture_contrast,
      maxValue: 2.0,
      description: "Trabecular pattern variation",
      icon: Microscope,
      unit: "",
      interpretation: analysis.texture_contrast > 1.2 ? "High Variation" : analysis.texture_contrast > 0.6 ? "Moderate" : "Low Variation",
      category: "texture"
    },
    {
      name: "GLCM Homogeneity", 
      value: analysis.texture_homogeneity,
      maxValue: 1.0,
      description: "Trabecular uniformity",
      icon: Target,
      unit: "",
      interpretation: analysis.texture_homogeneity > 0.7 ? "Uniform" : analysis.texture_homogeneity > 0.4 ? "Moderate" : "Non-uniform",
      category: "texture"
    },
    {
      name: "Texture Energy",
      value: analysis.texture_energy,
      maxValue: 1.0,
      description: "Trabecular orderliness",
      icon: Activity,
      unit: "",
      interpretation: analysis.texture_energy > 0.6 ? "Ordered" : analysis.texture_energy > 0.3 ? "Moderate" : "Disordered",
      category: "texture"
    },
    {
      name: "Fractal Dimension",
      value: analysis.fractal_dimension,
      maxValue: 1.8,
      description: "Complexity of trabecular architecture",
      icon: Brain,
      unit: "",
      interpretation: analysis.fractal_dimension > 1.5 ? "Complex" : analysis.fractal_dimension > 1.3 ? "Moderate" : "Simple",
      category: "texture"
    }
  ];

  const getInterpretationColor = (interpretation) => {
    switch (interpretation) {
      case 'Good':
      case 'Normal':
      case 'Uniform':
      case 'Ordered':
      case 'Complex':
        return 'text-green-600 bg-green-50';
      case 'Moderate':
      case 'Reduced':
        return 'text-yellow-600 bg-yellow-50';
      case 'Poor':
      case 'Severely Reduced':
      case 'Non-uniform':
      case 'Disordered':
      case 'Simple':
        return 'text-red-600 bg-red-50';
      case 'High Variation':
        return 'text-orange-600 bg-orange-50';
      case 'Low Variation':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const renderClinicalIndexCard = (indexData, key) => {
    const isApplicable = indexData.value !== null && indexData.value !== undefined;

    return (
      <div 
        key={key} 
        className={`p-4 rounded-lg border transition-all duration-300 ${isApplicable ? 'border-slate-100 bg-slate-50/50' : 'border-slate-100 bg-slate-100'}`}
      >
        <div className="flex items-center gap-2 mb-3">
          <indexData.icon className={`w-4 h-4 ${isApplicable ? 'text-green-600' : 'text-slate-400'}`} />
          <h4 className={`font-semibold text-sm ${isApplicable ? 'text-slate-900' : 'text-slate-500'}`}>{indexData.name}</h4>
        </div>
        {isApplicable ? (
          <>
            <div className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-bold text-slate-900">{indexData.value}</span>
                <span className="text-sm text-slate-500">{indexData.unit}</span>
              </div>
              <Progress 
                value={(indexData.value / indexData.maxValue) * 100} 
                className="h-1 mt-1"
              />
            </div>
            <p className="text-xs text-slate-600 mb-2">{indexData.description}</p>
            <span className={`text-xs font-medium px-2 py-1 rounded ${getInterpretationColor(indexData.interpretation)}`}>
              {indexData.interpretation}
            </span>
          </>
        ) : (
          <div className="text-center py-4">
            <AlertCircle className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">Not Applicable</p>
            <p className="text-xs text-slate-500">For {analysis.anatomical_region.replace(/_/g, ' ')}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900">Texture Analysis Indices</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* GLCM Texture Parameters */}
        <div>
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Microscope className="w-5 h-5 text-blue-600" />
            GLCM & Fractal Texture Parameters
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {textureIndices.map((index, i) => (
              <div key={i} className="p-4 rounded-lg border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <index.icon className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-slate-900 text-sm">{index.name}</h4>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-bold text-slate-900">{index.value?.toFixed(3)}</span>
                    <span className="text-sm text-slate-500">{index.unit}</span>
                  </div>
                  <Progress 
                    value={(index.value / index.maxValue) * 100} 
                    className="h-1 mt-1"
                  />
                </div>
                <p className="text-xs text-slate-600 mb-2">{index.description}</p>
                <span className={`text-xs font-medium px-2 py-1 rounded ${getInterpretationColor(index.interpretation)}`}>
                  {index.interpretation}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Indices */}
        <div>
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-600" />
            Clinical Assessment Indices
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {clinicalIndices.map((index, i) => renderClinicalIndexCard(index, i))}
          </div>
        </div>
        
        {/* Analysis Method Info */}
        <div className="p-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h4 className="font-semibold text-slate-900 mb-2">Analysis Methodology</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600 font-medium">Method:</span>
              <span className="ml-1 text-slate-900">{analysis.texture_analysis_method || "GLCM + Fractal Analysis"}</span>
            </div>
            <div>
              <span className="text-slate-600 font-medium">Preprocessing:</span>
              <span className="ml-1 text-slate-900">{analysis.preprocessing_applied || "Contrast enhancement, noise reduction"}</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3">
            These texture indices are computed from the X-ray image and used to predict BMD values, 
            providing a screening alternative to DXA scanning for osteoporosis assessment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}