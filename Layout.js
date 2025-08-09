import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Activity, 
  Upload, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  Stethoscope,
  Shield,
  Menu,
  X
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Activity,
    description: "Overview & Analytics"
  },
  {
    title: "New Analysis",
    url: createPageUrl("Upload"),
    icon: Upload,
    description: "Upload X-ray Images"
  },
  {
    title: "Analysis Results",
    url: createPageUrl("Results"),
    icon: BarChart3,
    description: "View Analysis Results"
  },
  {
    title: "Reports",
    url: createPageUrl("Reports"),
    icon: FileText,
    description: "Generate Medical Reports"
  },
  {
    title: "Patient Records",
    url: createPageUrl("Patients"),
    icon: Users,
    description: "Manage Patient Data"
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SidebarProvider>
        <div className="flex w-full">
          <Sidebar className="border-r border-slate-200 bg-white/80 backdrop-blur-sm">
            <SidebarHeader className="border-b border-slate-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">OsteoScope</h2>
                  <p className="text-xs text-slate-500 font-medium">Medical Imaging Analysis</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-3">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                  Medical Tools
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`group relative hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg p-3 ${
                            location.pathname === item.url 
                              ? 'bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600' 
                              : 'text-slate-600'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3">
                            <item.icon className={`w-5 h-5 transition-colors ${
                              location.pathname === item.url ? 'text-blue-600' : 'text-slate-500'
                            }`} />
                            <div className="flex-1">
                              <span className="font-medium text-sm">{item.title}</span>
                              <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup className="mt-8">
                <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                  System Status
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-3 py-3 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
 