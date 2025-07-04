
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import Dashboard from "./pages/Dashboard";
import Extensions from "./pages/Extensions";
import RingGroups from "./pages/RingGroups";
import Inbound from "./pages/Inbound";
import Outbound from "./pages/Outbound";
import Trunks from "./pages/Trunks";
import URABuilder from "./pages/URABuilder";
import Plans from "./pages/Plans";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated] = useState(true); // Simulando autenticação

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {!isAuthenticated ? (
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            ) : (
              <SidebarProvider>
                <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <Header />
                    <main className="flex-1 p-6 overflow-auto">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/extensions" element={<Extensions />} />
                        <Route path="/ring-groups" element={<RingGroups />} />
                        <Route path="/inbound" element={<Inbound />} />
                        <Route path="/outbound" element={<Outbound />} />
                        <Route path="/trunks" element={<Trunks />} />
                        <Route path="/ura-builder" element={<URABuilder />} />
                        <Route path="/plans" element={<Plans />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            )}
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
