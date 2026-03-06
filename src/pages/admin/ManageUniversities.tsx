import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building2,
  Plus,
  ArrowLeft,
  Search,
  Settings,
  Trash2,
  Users,
  Car,
  Leaf,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export default function ManageUniversities() {
  const { toast } = useToast();
  const [universities, setUniversities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [selectedUni, setSelectedUni] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newUniversity, setNewUniversity] = useState({
    name: "",
    shortName: "",
    emailDomain: "",
  });

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchUniversities = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/universities`, { headers });
      const data = await res.json();
      setUniversities(data.data.universities || []);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch universities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const handleAddUniversity = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/universities`, {
        method: "POST",
        headers,
        body: JSON.stringify(newUniversity),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast({
        title: "University Added!",
        description: `${newUniversity.name} has been added.`,
      });
      setIsAddDialogOpen(false);
      setNewUniversity({ name: "", shortName: "", emailDomain: "" });
      fetchUniversities();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateUniversity = async () => {
    try {
      const res = await fetch(
        `${API_URL}/admin/universities/${selectedUni.id}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(selectedUni),
        },
      );
      if (!res.ok) throw new Error("Failed to update");
      toast({ title: "Updated!", description: "University settings saved." });
      setIsSettingsDialogOpen(false);
      fetchUniversities();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUniversity = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await fetch(`${API_URL}/admin/universities/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: "Deleted", description: `${name} has been removed.` });
      fetchUniversities();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const filteredUniversities = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.shortName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Link
              to="/super-admin"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Manage Universities</h1>
            <p className="text-muted-foreground">
              Add, edit, and manage universities on the platform
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add University
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New University</DialogTitle>
                <DialogDescription>
                  Add a new university to RouteMate
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>University Name</Label>
                  <Input
                    placeholder="e.g., National University of Technology"
                    value={newUniversity.name}
                    onChange={(e) =>
                      setNewUniversity({
                        ...newUniversity,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Short Name</Label>
                  <Input
                    placeholder="e.g., NUTECH"
                    value={newUniversity.shortName}
                    onChange={(e) =>
                      setNewUniversity({
                        ...newUniversity,
                        shortName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Domain</Label>
                  <Input
                    placeholder="e.g., nutech.edu.pk"
                    value={newUniversity.emailDomain}
                    onChange={(e) =>
                      setNewUniversity({
                        ...newUniversity,
                        emailDomain: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddUniversity}>Add University</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search universities..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-12">Loading universities...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUniversities.map((uni) => (
              <Card key={uni.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {uni.shortName}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {uni.name}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={uni.isActive ? "default" : "secondary"}>
                      {uni.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    @{uni.emailDomain}
                  </code>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-muted/50 rounded">
                      <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        {uni.userCount || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Users</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <Car className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        {uni.rideCount || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Rides</p>
                    </div>
                    <div className="p-2 bg-primary/5 rounded">
                      <Leaf className="h-4 w-4 mx-auto mb-1 text-primary" />
                      <p className="text-sm font-medium text-primary">0</p>
                      <p className="text-xs text-muted-foreground">kg CO₂</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedUni({ ...uni });
                        setIsSettingsDialogOpen(true);
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDeleteUniversity(uni.id, uni.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Settings Dialog */}
        {selectedUni && (
          <Dialog
            open={isSettingsDialogOpen}
            onOpenChange={setIsSettingsDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit {selectedUni.shortName}</DialogTitle>
                <DialogDescription>
                  Update university settings
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>University Name</Label>
                  <Input
                    value={selectedUni.name}
                    onChange={(e) =>
                      setSelectedUni({ ...selectedUni, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Short Name</Label>
                  <Input
                    value={selectedUni.shortName}
                    onChange={(e) =>
                      setSelectedUni({
                        ...selectedUni,
                        shortName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Domain</Label>
                  <Input
                    value={selectedUni.emailDomain}
                    onChange={(e) =>
                      setSelectedUni({
                        ...selectedUni,
                        emailDomain: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Active Status</Label>
                  <Switch
                    checked={selectedUni.isActive}
                    onCheckedChange={(v) =>
                      setSelectedUni({ ...selectedUni, isActive: v })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsSettingsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateUniversity}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}
