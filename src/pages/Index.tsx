import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import mosqueLogo from "@/assets/mosque-logo.png";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="text-center">
        <img src={mosqueLogo} alt="Logo Masjid" className="h-20 w-20 mx-auto mb-4" />
        <h1 className="mb-2 text-2xl font-bold text-foreground">Sistem Informasi DKM</h1>
        <p className="text-muted-foreground mb-6">Panel administrasi internal masjid</p>
        <Button onClick={() => navigate("/")}>Masuk</Button>
      </div>
    </div>
  );
};

export default Index;
