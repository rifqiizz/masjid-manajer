import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ProfilMasjid from "./pages/ProfilMasjid";
import Artikel from "./pages/Artikel";
import Postingan from "./pages/Postingan";
import Kegiatan from "./pages/Kegiatan";
import Ruangan from "./pages/Ruangan";
import Sewa from "./pages/Sewa";
import Fasilitas from "./pages/Fasilitas";
import Keuangan from "./pages/Keuangan";
import Laporan from "./pages/Laporan";
import AuditTrail from "./pages/AuditTrail";
import Jamaah from "./pages/Jamaah";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profil-masjid" element={<ProfilMasjid />} />
            <Route path="/artikel" element={<Artikel />} />
            <Route path="/postingan" element={<Postingan />} />
            <Route path="/kegiatan" element={<Kegiatan />} />
            <Route path="/ruangan" element={<Ruangan />} />
            <Route path="/sewa" element={<Sewa />} />
            <Route path="/fasilitas" element={<Fasilitas />} />
            <Route path="/keuangan" element={<Keuangan />} />
            <Route path="/laporan" element={<Laporan />} />
            <Route path="/audit-trail" element={<AuditTrail />} />
            <Route path="/jamaah" element={<Jamaah />} />
            <Route path="/users" element={<Users />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
