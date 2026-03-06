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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  Plus,
  ArrowLeft,
  Search,
  Trash2,
  Globe,
  Building2,
  UserCog,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export default function ManageAdmins() {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    universityId: "",
    role: "UNIVERSITY_ADMIN",
  });

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/admins`, { headers });
      const data = await res.json();
      setAdmins(data.data.admins || []);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch admins",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/universities`, { headers });
      const data = await res.json();
      setUniversities(data.data.universities || []);
    } catch (err) {}
  };

  useEffect(() => {
    fetchAdmins();
    fetchUniversities();
  }, []);

  const handleAddAdmin = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/admins`, {
        method: "POST",
        headers,
        body: JSON.stringify(newAdmin),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add admin");
      toast({
        title: "Admin Added!",
        description: `${newAdmin.email} is now an admin.`,
      });
      setIsAddDialogOpen(false);
      setNewAdmin({ email: "", universityId: "", role: "UNIVERSITY_ADMIN" });
      fetchAdmins();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleRevokeAccess = async (userId: string, userName: string) => {
    if (!confirm(`Revoke admin access for ${userName}?`)) return;
    try {
      const res = await fetch(`${API_URL}/admin/admins/${userId}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Failed to revoke");
      toast({
        title: "Access Revoked",
        description: `${userName}'s admin access removed.`,
        variant: "destructive",
      });
      fetchAdmins();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.university?.shortName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const superAdmins = admins.filter((a) => a.role === "SUPER_ADMIN");
  const uniAdmins = admins.filter((a) => a.role === "UNIVERSITY_ADMIN");

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
            <h1 className="text-3xl font-bold">Manage Administrators</h1>
            <p className="text-muted-foreground">
              Grant and revoke admin access for universities
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Administrator</DialogTitle>
                <DialogDescription>
                  Promote an existing user to admin role
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>User Email</Label>
                  <Input
                    type="email"
                    placeholder="user@university.edu.pk"
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, email: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    User must already have an account
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={newAdmin.role}
                    onValueChange={(v) => setNewAdmin({ ...newAdmin, role: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="UNIVERSITY_ADMIN">
                        University Admin
                      </SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>University</Label>
                  <Select
                    value={newAdmin.universityId}
                    onValueChange={(v) =>
                      setNewAdmin({ ...newAdmin, universityId: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {universities.map((uni) => (
                        <SelectItem key={uni.id} value={uni.id}>
                          {uni.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddAdmin}>Add Admin</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Super Admins
              </CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{superAdmins.length}</div>
              <p className="text-xs text-muted-foreground">
                Platform-wide access
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                University Admins
              </CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniAdmins.length}</div>
              <p className="text-xs text-muted-foreground">
                University-specific access
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Universities Covered
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(uniAdmins.map((a) => a.universityId)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                With assigned admins
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search admins..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Administrators</CardTitle>
            <CardDescription>
              Manage platform and university administrators
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading admins...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Administrator</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Shield
                              className={`h-5 w-5 ${admin.role === "SUPER_ADMIN" ? "text-primary" : "text-muted-foreground"}`}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{admin.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {admin.role === "SUPER_ADMIN" ? (
                          <Badge variant="outline">
                            <Globe className="mr-1 h-3 w-3" />
                            All Universities
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {admin.university?.shortName || "N/A"}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            admin.role === "SUPER_ADMIN"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {admin.role === "SUPER_ADMIN"
                            ? "Super Admin"
                            : "University Admin"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {admin.role !== "SUPER_ADMIN" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() =>
                              handleRevokeAccess(admin.id, admin.name)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAdmins.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No admins found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
