import React, { useState, useEffect } from "react";
import { XRayAnalysis, Patient } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Activity, 
  Upload, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";

import StatsOverview from "../components/dashboard/StatsOverview";
import RecentAnalyses from "../components/dashboard/RecentAnalyses";
import OsteoporosisDistribution from "../components/dashboard/OsteoporosisDistribution";

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [analysesData, patientsData] = await Promise.all([
        XRayAnalysis.list('-created_date', 50),
        Patient.list('-created_date', 20)
      ]);
      
      setAnalyses(analysesData);
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getClassificationStats = () => {
    const completedAnalyses = analyses.filter(a => a.analysis_status === 'completed');
    const total = completedAnalyses.length;
    
    if (total === 0) return { normal: 0, osteopenia: 0, osteoporosis: 0 };
    
    const counts = completedAnalyses.reduce((acc, analysis) => {
      acc[analysis.osteoporosis_classification] = (acc[analysis.osteoporosis_classification] || 0) + 1;
      return acc;
    }, {});
    
    return {
      normal: Math.round((counts.normal || 0) / total * 100),
      osteopenia: Math.round((counts.osteopenia || 0) / total * 100),
      osteoporosis: Math.round((counts.osteoporosis || 0) / total * 100)
    };
  };

  const stats = getClassificationStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Medical Imaging Dashboard</h1>
            <p className="text-slate-600">Monitor osteoporosis analysis and patient outcomes</p>
          </div>
          <Link to={createPageUrl("Upload")}>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-6 py-2 rounded-lg shadow-lg transition-all duration-200">
              <Upload className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <StatsOverview 
          totalAnalyses={analyses.length}
          totalPatients={patients.length}
          processingCount={analyses.filter(a => a.analysis_status === 'processing').length}
          stats={stats}
          isLoading={isLoading}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Analyses - Takes up 2/3 of the width */}
          <div className="lg:col-span-2">
            <RecentAnalyses 
              analyses={analyses.slice(0, 10)} 
              isLoading={isLoading}
            />
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <OsteoporosisDistribution stats={stats} isLoading={isLoading} />
            
            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to={createPageUrl("Upload")} className="block">
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New X-ray
                  </Button>
                </Link>
                <Link to={createPageUrl("Patients")} className="block">
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Patients
                  </Button>
                </Link>
                <Link to={createPageUrl("Reports")} className="block">
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 transition-colors">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate Reports
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}