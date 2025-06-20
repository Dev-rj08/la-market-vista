
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, User, Settings } from 'lucide-react';
import StockCard from '@/components/StockCard';
import NewsSection from '@/components/NewsSection';
import MarketOverview from '@/components/MarketOverview';

const Dashboard = () => {
  const [currency, setCurrency] = useState('USD');
  const [user] = useState({ name: 'John Doe', email: 'john@example.com' });
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'JPY', label: 'JPY (¥)' },
    { value: 'CAD', label: 'CAD (C$)' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">FinancePortal</h1>
              <div className="hidden md:block text-sm text-muted-foreground">
                Los Angeles Financial Markets
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="hidden md:inline text-sm">{user.name}</span>
              </div>
              
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}!</h2>
          <p className="text-muted-foreground">Here's what's happening in the markets today.</p>
        </div>

        {/* Market Overview */}
        <MarketOverview currency={currency} />

        {/* Stock Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StockCard symbol="AAPL" currency={currency} />
          <StockCard symbol="GOOGL" currency={currency} />
          <StockCard symbol="MSFT" currency={currency} />
          <StockCard symbol="AMZN" currency={currency} />
          <StockCard symbol="TSLA" currency={currency} />
          <StockCard symbol="NVDA" currency={currency} />
          <StockCard symbol="META" currency={currency} />
          <StockCard symbol="NFLX" currency={currency} />
        </div>

        {/* News Section */}
        <NewsSection />
      </main>
    </div>
  );
};

export default Dashboard;
