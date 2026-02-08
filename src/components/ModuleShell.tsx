import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface ModuleShellProps {
  title: string;
  description: string;
}

const ModuleShell = ({ title, description }: ModuleShellProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Construction className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <CardTitle className="text-lg text-muted-foreground/60">Modul Dalam Pengembangan</CardTitle>
          <p className="text-sm text-muted-foreground/50 mt-2">Fitur ini akan segera tersedia.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleShell;
