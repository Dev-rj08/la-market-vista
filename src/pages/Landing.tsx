
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Shield } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const staticNews = [
    {
      id: 1,
      title: "Federal Reserve Maintains Interest Rates Amid Economic Uncertainty",
      summary: "The Federal Reserve has decided to keep interest rates unchanged at 5.25%-5.50% range, citing mixed economic signals and ongoing inflation concerns.",
      source: "Financial Times",
      timestamp: "2 hours ago",
      category: "Monetary Policy",
      impact: "high"
    },
    {
      id: 2,
      title: "Tech Giants Report Strong Q4 Earnings Despite Market Volatility",
      summary: "Major technology companies including Apple, Microsoft, and Google parent Alphabet exceeded earnings expectations for the fourth quarter.",
      source: "Reuters",
      timestamp: "4 hours ago",
      category: "Earnings",
      impact: "medium"
    },
    {
      id: 3,
      title: "Emerging Markets See Capital Inflows as Dollar Weakens",
      summary: "Developing market currencies and stocks gained ground as the US dollar retreated from recent highs, attracting foreign investment.",
      source: "Bloomberg",
      timestamp: "6 hours ago",
      category: "Global Markets",
      impact: "medium"
    },
    {
      id: 4,
      title: "Oil Prices Surge on Middle East Supply Concerns",
      summary: "Crude oil futures jumped 3% after reports of potential supply disruptions in key oil-producing regions of the Middle East.",
      source: "Wall Street Journal",
      timestamp: "8 hours ago",
      category: "Commodities",
      impact: "high"
    }
  ];

  const marketData = [
    { name: 'S&P 500', value: 4567.89, change: 23.45, changePercent: 0.52 },
    { name: 'NASDAQ', value: 14234.56, change: -45.23, changePercent: -0.32 },
    { name: 'DOW JONES', value: 35123.78, change: 156.78, changePercent: 0.45 },
    { name: 'NIFTY 50', value: 19856.34, change: 78.23, changePercent: 0.40 }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-muted text-muted-foreground';
    }
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
                className="w-10 h-10"
              />
              <h1 className="text-2xl font-bold text-primary">Market95</h1>
              <div className="hidden md:block text-sm text-muted-foreground">
                Your Gateway to Financial Markets
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin-login')}
                className="text-muted-foreground hover:text-foreground"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
              <Button
                onClick={() => navigate('/login')}
                className="bg-primary hover:bg-primary/90"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Welcome to Market95
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your comprehensive financial portal for real-time market data, stocks, currencies, and news from trusted sources across the LA region and beyond.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="bg-primary hover:bg-primary/90"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <section className="py-12 px-4 bg-card/20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Live Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketData.map((market, index) => {
              const isPositive = market.change >= 0;
              
              return (
                <Card key={index} className="market-card">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">{market.name}</h3>
                      <div className="text-2xl font-bold">{market.value.toFixed(2)}</div>
                      <div className={`flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {isPositive ? '+' : ''}{market.change.toFixed(2)} ({isPositive ? '+' : ''}{market.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Market95?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="market-card text-center">
              <CardHeader>
                <TrendingUp className="w-12 h-12 mx-auto text-primary mb-4" />
                <CardTitle>Real-Time Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get live market data, stock prices, and currency rates from multiple trusted sources in real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="market-card text-center">
              <CardHeader>
                <Users className="w-12 h-12 mx-auto text-primary mb-4" />
                <CardTitle>Comprehensive Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access market information from LA region and global markets with detailed analysis and insights.
                </p>
              </CardContent>
            </Card>

            <Card className="market-card text-center">
              <CardHeader>
                <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
                <CardTitle>Trusted Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Data sourced from reliable financial institutions and news providers for accurate information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 px-4 bg-card/20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Latest Market News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staticNews.map((news) => (
              <Card key={news.id} className="market-card">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg font-semibold hover:text-primary cursor-pointer transition-colors">
                      {news.title}
                    </CardTitle>
                    <Badge className={`ml-2 ${getImpactColor(news.impact)} text-xs`}>
                      {news.impact.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {news.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{news.source}</span>
                      <Badge variant="outline" className="text-xs">
                        {news.category}
                      </Badge>
                    </div>
                    <span>{news.timestamp}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img 
              src="/lovable-uploads/9c2f154b-9310-4158-b375-1ee6e2fa6df5.png" 
              alt="Market95 Logo" 
              className="w-6 h-6"
            />
            <span className="text-xl font-bold text-primary">Market95</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 Market95. All rights reserved. Leading financial institution from LA Region.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
