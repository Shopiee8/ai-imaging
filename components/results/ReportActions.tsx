import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2, Printer, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default function ReportActions({ analysis }) {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false);
      // In a real app, this would generate and download a PDF
      alert('Medical report generated successfully!');
    }, 2000);
  };

  const handleViewImage = () => {
    if (analysis.image_url) {
      window.open(analysis.image_url, '_blank');
    }
  };

  return (
    <>
      {/* Image Preview */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Original X-ray</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-square bg-slate-100 rounded-lg mb-4 flex items-center justify-center border border-slate-200">
            {analysis.image_url ? (
              <img 
                src={analysis.image_url} 
                alt={`${analysis.patient_name} X-ray`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-slate-400 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">X-ray image</p>
              </div>
            )}
          </div>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleViewImage}
            disabled={!analysis.image_url}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Full Size
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Report Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
          >
            {isGeneratingReport ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate PDF Report
              </>
            )}
          </Button>
          
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          
          <Button variant="outline" className="w-full">
            <Share2 className="w-4 h-4 mr-2" />
            Share with Doctor
          </Button>
          
          <Button variant="outline" className="w-full">
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Details */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Analysis Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Analysis ID:</span>
            <span className="font-mono text-slate-900">{analysis.id.slice(0, 8)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Date:</span>
            <span className="text-slate-900">{format(new Date(analysis.created_date), "MMM d, yyyy")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Time:</span>
            <span className="text-slate-900">{format(new Date(analysis.created_date), "h:mm a")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Status:</span>
            <span className="text-green-600 font-medium capitalize">{analysis.analysis_status}</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}