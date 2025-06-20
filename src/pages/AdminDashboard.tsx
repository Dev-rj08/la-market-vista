
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { LogOut, Users, UserPlus, Trash2, Shield, Eye, EyeOff } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated');
    if (!isAdminAuthenticated) {
      navigate('/admin-login');
    }

    // Mock users data
    setUsers([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        status: 'active',
        joinDate: '2024-01-15'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        status: 'active',
        joinDate: '2024-02-20'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'premium',
        status: 'inactive',
        joinDate: '2024-03-10'
      }
    ]);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', password: '', role: 'user' });
    setShowAddForm(false);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/9c2f154b-9310-4158-b375-1ee6e2fa6df5.png" 
                alt="Market95 Logo" 
                className="w-8 h-8"
              />
              <h1 className="text-2xl font-bold text-primary">Market95</h1>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
                <Shield className="w-3 h-3 mr-1" />
                Admin Panel
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Administrator</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="market-card">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
                <div className="text-2xl font-bold">{users.length}</div>
                <div className="text-xs text-green-400">+12% from last month</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="market-card">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
                <div className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</div>
                <div className="text-xs text-green-400">+5% from last week</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="market-card">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Premium Users</h3>
                <div className="text-2xl font-bold">{users.filter(u => u.role === 'premium').length}</div>
                <div className="text-xs text-yellow-400">2 upgrades this week</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="market-card">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">New This Month</h3>
                <div className="text-2xl font-bold">
                  {users.filter(u => new Date(u.joinDate) > new Date(Date.now() - 30*24*60*60*1000)).length}
                </div>
                <div className="text-xs text-blue-400">Growing steadily</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card className="market-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2" />
                User Management
              </CardTitle>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-primary hover:bg-primary/90"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showAddForm && (
              <Card className="mb-6 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">Add New User</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          required
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          required
                          className="bg-background/50"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={newUser.password}
                            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                            required
                            className="bg-background/50 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <select
                          id="role"
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                          className="w-full px-3 py-2 bg-background/50 border border-border rounded-md text-sm"
                        >
                          <option value="user">User</option>
                          <option value="premium">Premium</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Add User
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Users Table */}
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-card/20">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'premium' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Joined: {user.joinDate}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
