{
  "name": "XRayAnalysis",
  "type": "object",
  "properties": {
    "patient_name": {
      "type": "string",
      "description": "Name of the patient"
    },
    "patient_age": {
      "type": "number",
      "description": "Age of the patient in years"
    },
    "patient_gender": {
      "type": "string",
      "enum": [
        "male",
        "female",
        "other"
      ],
      "description": "Patient gender"
    },
    "image_url": {
      "type": "string",
      "description": "URL of the uploaded X-ray image"
    },
    "anatomical_region": {
      "type": "string",
      "enum": [
        "proximal_femur",
        "calcaneus",
        "clavicle",
        "lumbar_spine"
      ],
      "description": "Anatomical region analyzed"
    },
    "singh_index": {
      "type": [
        "number",
        "null"
      ],
      "description": "Singh Index score (1-6) for femur trabecular pattern assessment. NA for other regions."
    },
    "jhamaria_index": {
      "type": [
        "number",
        "null"
      ],
      "description": "Jhamaria Index for calcaneus trabecular quality. NA for other regions."
    },
    "cortical_thickness_mm": {
      "type": [
        "number",
        "null"
      ],
      "description": "Measured cortical thickness in millimeters. Primarily for clavicle."
    },
    "texture_contrast": {
      "type": "number",
      "description": "GLCM contrast measure for trabecular texture"
    },
    "texture_homogeneity": {
      "type": "number",
      "description": "GLCM homogeneity measure for trabecular uniformity"
    },
    "texture_energy": {
      "type": "number",
      "description": "GLCM energy measure for trabecular orderliness"
    },
    "texture_entropy": {
      "type": "number",
      "description": "GLCM entropy measure for trabecular randomness"
    },
    "fractal_dimension": {
      "type": "number",
      "description": "Fractal dimension of trabecular architecture"
    },
    "predicted_bmd_gm_cm2": {
      "type": "number",
      "description": "Predicted Bone Mineral Density in g/cm²"
    },
    "predicted_t_score": {
      "type": "number",
      "description": "Predicted T-score relative to young adult peak BMD"
    },
    "predicted_z_score": {
      "type": "number",
      "description": "Predicted Z-score relative to age-matched controls"
    },
    "osteoporosis_risk_category": {
      "type": "string",
      "enum": [
        "normal",
        "osteopenia",
        "osteoporosis",
        "severe_osteoporosis"
      ],
      "description": "WHO classification based on predicted T-score"
    },
    "dxa_recommendation": {
      "type": "string",
      "enum": [
        "routine_monitoring",
        "follow_up_6_months",
        "immediate_dxa_recommended",
        "clinical_intervention_needed"
      ],
      "description": "Clinical recommendation based on screening results"
    },
    "confidence_score": {
      "type": "number",
      "description": "Analysis confidence percentage (0-100)"
    },
    "texture_analysis_method": {
      "type": "string",
      "description": "Method used for texture analysis (GLCM, LBP, Fractal, etc.)"
    },
    "preprocessing_applied": {
      "type": "string",
      "description": "Image preprocessing steps applied"
    },
    "analysis_notes": {
      "type": "string",
      "description": "Clinical notes and observations"
    },
    "analysis_status": {
      "type": "string",
      "enum": [
        "processing",
        "completed",
        "failed",
        "requires_review"
      ],
      "default": "processing",
      "description": "Status of the texture analysis"
    }
  },
  "required": [
    "patient_name",
    "patient_age",
    "patient_gender",
    "image_url",
    "anatomical_region"
  ]
}