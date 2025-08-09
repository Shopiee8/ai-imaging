
import React, { useState, useEffect } from "react";
import { XRayAnalysis } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Calendar, Users, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const classificationColors = {
  normal: "bg-green-100 text-green-800",
  osteopenia: "bg-yellow-100 text-yellow-800",
  osteoporosis: "bg-red-100 text-red-800",
  severe_osteoporosis: "bg-purple-100 text-purple-800",
};

export default function ReportsPage() {
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    setIsLoading(true);
    try {
      const analysisList = await XRayAnalysis.filter({ analysis_status: "completed" }, "-created_date");
      setAnalyses(analysisList);
    } catch (error) {
      console.error("Failed to load analyses:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredAnalyses = analyses.filter(a => 
    filter === 'all' || a.osteoporosis_risk_category === filter
  );

  const handleGeneratePdf = (analysisId) => {
    alert(`Generating PDF for analysis ID: ${analysisId}. \n\n(This is a placeholder for the report generation feature.)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Analysis Reports</h1>
          <p className="text-slate-600">Review and export all completed analysis reports.</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Completed Analyses</CardTitle>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by classification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classifications</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="osteopenia">Osteopenia</SelectItem>
                    <SelectItem value="osteoporosis">Osteoporosis</SelectItem>
                    <SelectItem value="severe_osteoporosis">Severe Osteoporosis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Analysis Date</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Risk Category</TableHead>
                  <TableHead>T-Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredAnalyses.length > 0 ? (
                  filteredAnalyses.map(analysis => (
                    <TableRow key={analysis.id}>
                      <TableCell className="font-medium">{analysis.patient_name}</TableCell>
                      <TableCell>{format(new Date(analysis.created_date), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="capitalize">{analysis.anatomical_region?.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <Badge className={classificationColors[analysis.osteoporosis_risk_category]}>
                          {analysis.osteoporosis_risk_category?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
