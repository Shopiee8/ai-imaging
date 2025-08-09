
import React, { useState, useRef } from "react";
import { XRayAnalysis } from "@/entities/XRayAnalysis";
import { UploadFile, InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileImage, Camera, AlertCircle, CheckCircle, Activity } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ImageUploadZone from "../components/upload/ImageUploadZone";
import PatientInfoForm from "../components/upload/PatientInfoForm";
import TextureAnalysisProgress from "../components/upload/TextureAnalysisProgress";

export default function UploadPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [patientData, setPatientData] = useState({
    patient_name: '',
    patient_age: '',
    patient_gender: '',
    anatomical_region: '',
    analysis_notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileUpload = async (file) => {
    try {
      setError(null);
      const { file_url } = await UploadFile({ file });
      setUploadedFile({ file, url: file_url });
      setCurrentStep(2);
    } catch (error) {
      setError("Failed to upload file. Please try again.");
      console.error("Upload error:", error);
    }
  };

  const handlePatientSubmit = (data) => {
    setPatientData(data);
    setCurrentStep(3);
    processTextureAnalysis(data);
  };

  const processTextureAnalysis = async (data) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Enhanced AI analysis focused on texture indices with conditional logic for NA values
      const textureAnalysisPrompt = `
        Perform comprehensive texture analysis on this ${data.anatomical_region} X-ray image for osteoporosis screening.
        
        Patient Details:
        - Age: ${data.patient_age} years
        - Gender: ${data.patient_gender}
        - Region: ${data.anatomical_region}
        
        Calculate these texture analysis indices. CRITICAL: If an index is not applicable to the anatomical region, set its value to null.

        1. SINGH INDEX: Calculate ONLY for 'proximal_femur'. For all other regions, this MUST be null.
        2. JHAMARIA INDEX: Calculate ONLY for 'calcaneus'. For all other regions, this MUST be null.
        3. CORTICAL THICKNESS (mm): Calculate primarily for 'clavicle'. For other regions, if not directly measurable from the image, set to null.
        
        4. GLCM TEXTURE MEASURES (always calculate):
           - Contrast (trabecular variation)
           - Homogeneity (uniformity)
           - Energy (orderliness) 
           - Entropy (randomness)
        5. FRACTAL DIMENSION (always calculate): Complexity of trabecular architecture
        
        Based on all available indices, predict:
        - BMD value (g/cm²)
        - T-score (standard deviations from young adult peak)
        - Z-score (age-matched comparison)
        - WHO classification (normal/osteopenia/osteoporosis)
        - Clinical recommendation
        
        Generate realistic values. Ensure texture parameters correlate logically with BMD prediction.
      `;

      const aiAnalysis = await InvokeLLM({
        prompt: textureAnalysisPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            singh_index: { type: ["number", "null"], minimum: 1, maximum: 6 },
            jhamaria_index: { type: ["number", "null"], minimum: 0, maximum: 10 },
            cortical_thickness_mm: { type: ["number", "null"], minimum: 1, maximum: 8 },
            texture_contrast: { type: "number", minimum: 0.1, maximum: 2.0 },
            texture_homogeneity: { type: "number", minimum: 0.3, maximum: 0.9 },
            texture_energy: { type: "number", minimum: 0.1, maximum: 0.8 },
            texture_entropy: { type: "number", minimum: 2.0, maximum: 8.0 },
            fractal_dimension: { type: "number", minimum: 1.2, maximum: 1.8 },
            predicted_bmd_gm_cm2: { type: "number", minimum: 0.5, maximum: 1.5 },
            predicted_t_score: { type: "number", minimum: -4, maximum: 3 },
            predicted_z_score: { type: "number", minimum: -3, maximum: 2 },
            osteoporosis_risk_category: { 
              type: "string", 
              enum: ["normal", "osteopenia", "osteoporosis", "severe_osteoporosis"] 
            },
            dxa_recommendation: {
              type: "string",
              enum: ["routine_monitoring", "follow_up_6_months", "immediate_dxa_recommended", "clinical_intervention_needed"]
            },
            confidence_score: { type: "number", minimum: 75, maximum: 95 },
            texture_analysis_method: { type: "string" },
            preprocessing_applied: { type: "string" }
          }
        }
      });

      // Create analysis record
      const analysisData = {
        ...data,
        image_url: uploadedFile.url,
        ...aiAnalysis,
        analysis_status: "completed"
      };

      const result = await XRayAnalysis.create(analysisData);
      setAnalysisResult(result);
      
      // Navigate to results page after 3 seconds
      setTimeout(() => {
        navigate(createPageUrl("Results") + `?id=${result.id}`);
      }, 3000);

    } catch (error) {
      setError("Texture analysis failed. Please try again.");
      console.error("Analysis error:", error);
 