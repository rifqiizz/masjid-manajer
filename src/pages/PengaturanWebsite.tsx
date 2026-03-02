import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, GripVertical, Globe, Eye, EyeOff } from "lucide-react";

interface WebSection {
  id: string;
  section_key: string;
  title: string;
  is_visible: boolean;
  sort_order: number;
}

const initialSections: WebSection[] = [
  { id: "1", section_key: "hero", title: "Hero — Jadwal Sholat & CTA", is_visible: true, sort_order: 1 },
  { id: "2", section_key: "momentum", title: "Momentum — Menyambut Ramadhan", is_visible: true, sort_order: 2 },
  { id: "3", section_key: "berita", title: "Berita — Bento Grid", is_visible: true, sort_order: 3 },
  { id: "4", section_key: "kajian", title: "Kajian — Jadwal Kajian", is_visible: true, sort_order: 4 },
  { id: "5", section_key: "activities", title: "Activities — Kegiatan Masjid", is_visible: true, sort_order: 5 },
  { id: "6", section_key: "articles", title: "Articles — Artikel & Nasihat", is_visible: true, sort_order: 6 },
  { id: "7", section_key: "facilities", title: "Facilities — Fasilitas Masjid", is_visible: true, sort_order: 7 },
  { id: "8", section_key: "room_rental", title: "Room Rental — Pemanfaatan Ruang", is_visible: false, sort_order: 8 },
  { id: "9", section_key: "finance", title: "Finance — Transparansi Keuangan", is_visible: true, sort_order: 9 },
  { id: "10", section_key: "instagram_feed", title: "Instagram Feed — Embed Instagram", is_visible: false, sort_order: 10 },
];

const PengaturanWebsite = () => {
  const [sections, setSections] = useState<WebSection[]>(initialSections);

  const toggleVisibility = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_visible: !s.is_visible } : s))
    );
  };

  const activeCount = sections.filter((s) => s.is_visible).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-muted-foreground" />
          Pengaturan Website
        </h1>
        <p className="text-muted-foreground">Kelola visibilitas section website publik masjid</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Section Website Publik
              </CardTitle>
              <CardDescription>
                Aktifkan atau nonaktifkan section yang tampil di website publik
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {activeCount}/{sections.length} aktif
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sections
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((section) => (
                <div
                  key={section.id}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                    section.is_visible
                      ? "bg-card border-border"
                      : "bg-muted/30 border-border/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground/40 cursor-grab" />
                    <div className="flex items-center gap-2">
                      {section.is_visible ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground/40" />
                      )}
                      <div>
                        <p className={`text-sm font-medium ${section.is_visible ? "text-foreground" : "text-muted-foreground"}`}>
                          {section.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {section.section_key}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={section.is_visible}
                    onCheckedChange={() => toggleVisibility(section.id)}
                  />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PengaturanWebsite;
