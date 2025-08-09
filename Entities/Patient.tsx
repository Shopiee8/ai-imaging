{
  "name": "Patient",
  "type": "object",
  "properties": {
    "full_name": {
      "type": "string",
      "description": "Patient's full name"
    },
    "date_of_birth": {
      "type": "string",
      "format": "date",
      "description": "Patient's date of birth"
    },
    "gender": {
      "type": "string",
      "enum": [
        "male",
        "female",
        "other"
      ],
      "description": "Patient gender"
    },
    "medical_record_number": {
      "type": "string",
      "description": "Unique medical record identifier"
    },
    "height_cm": {
      "type": "number",
      "description": "Patient height in centimeters"
    },
    "weight_kg": {
      "type": "number",
      "description": "Patient weight in kilograms"
    },
    "medical_history": {
      "type": "string",
      "description": "Relevant medical history and conditions"
    },
    "referring_physician": {
      "type": "string",
      "description": "Name of referring physician"
    },
    "contact_email": {
      "type": "string",
      "format": "email",
      "description": "Patient contact email"
    },
    "contact_phone": {
      "type": "string",
      "description": "Patient contact phone number"
    }
  },
  "required": [
    "full_name",
    "date_of_birth",
    "gender"
  ]
}