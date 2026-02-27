import { useState } from "react";
import { Plus, GripVertical, MoreHorizontal, Clock, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Priority = "low" | "medium" | "high";
type ColumnId = "backlog" | "todo" | "in_progress" | "done";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  assignee?: string;
  labels: string[];
  columnId: ColumnId;
  createdAt: string;
}

interface Column {
  id: ColumnId;
  title: string;
  color: string;
  dotColor: string;
}

const columns: Column[] = [
  { id: "backlog", title: "Backlog", color: "bg-muted", dotColor: "bg-muted-foreground/50" },
  { id: "todo", title: "To Do", color: "bg-blue-50", dotColor: "bg-blue-500" },
  { id: "in_progress", title: "Sedang Dikerjakan", color: "bg-amber-50", dotColor: "bg-amber-500" },
  { id: "done", title: "Selesai", color: "bg-green-50", dotColor: "bg-green-500" },
];

const priorityConfig: Record<Priority, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  low: { label: "Rendah", variant: "secondary" },
  medium: { label: "Sedang", variant: "default" },
  high: { label: "Tinggi", variant: "destructive" },
};

const initialTasks: Task[] = [
  { id: "1", title: "Persiapan Maulid Nabi", description: "Koordinasi panitia dan dekorasi", priority: "high", assignee: "Ahmad", labels: ["Acara"], columnId: "in_progress", createdAt: "2026-02-25" },
  { id: "2", title: "Perbaikan sound system", description: "Ganti speaker utama yang rusak", priority: "medium", assignee: "Budi", labels: ["Fasilitas"], columnId: "todo", createdAt: "2026-02-24" },
  { id: "3", title: "Update website masjid", description: "Tambahkan jadwal sholat otomatis", priority: "low", labels: ["IT"], columnId: "backlog", createdAt: "2026-02-23" },
  { id: "4", title: "Rekap keuangan Februari", description: "Laporan bulanan pemasukan & pengeluaran", priority: "high", assignee: "Siti", labels: ["Keuangan"], columnId: "todo", createdAt: "2026-02-20" },
  { id: "5", title: "Pengajian rutin mingguan", description: "Koordinasi dengan ustadz", priority: "medium", assignee: "Hasan", labels: ["Acara"], columnId: "done", createdAt: "2026-02-18" },
  { id: "6", title: "Bersih-bersih masjid", description: "Jadwal kerja bakti bulanan", priority: "low", labels: ["Operasional"], columnId: "backlog", createdAt: "2026-02-22" },
];

const Tugas = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ColumnId | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" as Priority, assignee: "", label: "" });

  const getTasksByColumn = (columnId: ColumnId) => tasks.filter((t) => t.columnId === columnId);

  const handleDragStart = (task: Task) => setDraggedTask(task);
  const handleDragOver = (e: React.DragEvent, columnId: ColumnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };
  const handleDragLeave = () => setDragOverColumn(null);
  const handleDrop = (columnId: ColumnId) => {
    if (draggedTask) {
      setTasks((prev) => prev.map((t) => (t.id === draggedTask.id ? { ...t, columnId } : t)));
    }
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || undefined,
      priority: newTask.priority,
      assignee: newTask.assignee || undefined,
      labels: newTask.label ? [newTask.label] : [],
      columnId: "backlog",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setTasks((prev) => [...prev, task]);
    setNewTask({ title: "", description: "", priority: "medium", assignee: "", label: "" });
    setAddDialogOpen(false);
  };

  const handleDeleteTask = (taskId: string) => setTasks((prev) => prev.filter((t) => t.id !== taskId));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tugas</h1>
          <p className="text-sm text-muted-foreground">Kelola tugas dengan papan Kanban</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Tambah Tugas</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Tugas Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Judul</Label>
                <Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Nama tugas..." />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Detail tugas..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prioritas</Label>
                  <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v as Priority })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Rendah</SelectItem>
                      <SelectItem value="medium">Sedang</SelectItem>
                      <SelectItem value="high">Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Penanggung Jawab</Label>
                  <Input value={newTask.assignee} onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })} placeholder="Nama..." />
                </div>
              </div>
              <div>
                <Label>Label</Label>
                <Input value={newTask.label} onChange={(e) => setNewTask({ ...newTask, label: e.target.value })} placeholder="Contoh: Acara, Fasilitas..." />
              </div>
              <Button onClick={handleAddTask} className="w-full">Simpan Tugas</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4 min-h-[calc(100vh-220px)]">
        {columns.map((col) => {
          const colTasks = getTasksByColumn(col.id);
          const isDragOver = dragOverColumn === col.id;
          return (
            <div
              key={col.id}
              className={`flex flex-col rounded-xl border transition-colors ${isDragOver ? "border-primary/50 bg-primary/5" : "border-border bg-card/50"}`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(col.id)}
            >
              {/* Column Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <span className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`} />
                <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
                <Badge variant="outline" className="ml-auto text-xs">{colTasks.length}</Badge>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {colTasks.map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className={`cursor-grab active:cursor-grabbing p-3 transition-shadow hover:shadow-md ${draggedTask?.id === task.id ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug">{task.title}</p>
                        {task.description && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteTask(task.id)}>Hapus</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <Badge variant={priorityConfig[task.priority].variant} className="text-[10px] px-1.5 py-0">
                        {priorityConfig[task.priority].label}
                      </Badge>
                      {task.labels.map((label) => (
                        <Badge key={label} variant="outline" className="text-[10px] px-1.5 py-0">
                          <Tag className="mr-0.5 h-2.5 w-2.5" />{label}
                        </Badge>
                      ))}
                    </div>

                    {(task.assignee || task.createdAt) && (
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                        {task.assignee && (
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{task.assignee}</span>
                        )}
                        <span className="flex items-center gap-1 ml-auto"><Clock className="h-3 w-3" />{task.createdAt}</span>
                      </div>
                    )}
                  </Card>
                ))}

                {colTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
                    <p className="text-xs">Tidak ada tugas</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tugas;
