import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email dan password harus diisi.");
      return;
    }
    // Demo login — will be replaced with real auth
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="items-center pb-2 pt-8">
          {/* Gold circular logo with N */}
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg mb-3">
            <span className="text-white font-bold text-4xl">N</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">Masjid Nuruzzaman</h1>
          <p className="text-sm text-muted-foreground">Masuk ke panel administrasi</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@masjid.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full gap-2">
              <LogIn className="h-4 w-4" />
              Masuk
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
