
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
}

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = () => {
      setLoading(true);
      
      // Mock news data
      setTimeout(() => {
        const mockNews: NewsItem[] = [
          {
            id: 1,
            title: "Federal Reserve Signals Potential Rate Changes",
            summary: "The Federal Reserve indicated possible adjustments to interest rates following recent economic indicators showing mixed signals in the LA market.",
            source: "Financial Times",
            timestamp: "2 hours ago",
            category: "Monetary Policy",
            impact: "high"
          },
          {
            id: 2,
            title: "Tech Stocks Rally on AI Developments",
            summary: "Major technology companies see significant gains as artificial intelligence innovations continue to drive investor confidence in the sector.",
            source: "MarketWatch",
            timestamp: "4 hours ago",
            category: "Technology",
            impact: "medium"
          },
          {
            id: 3,
            title: "Energy Sector Shows Resilience",
            summary: "Oil and gas companies in the LA region demonstrate strong quarterly performance despite global economic uncertainties.",
            source: "Reuters",
            timestamp: "6 hours ago",
            category: "Energy",
            impact: "medium"
          },
          {
            id: 4,
            title: "Healthcare Stocks Gain Momentum",
            summary: "Pharmaceutical companies report positive clinical trial results, boosting investor sentiment across the healthcare sector.",
            source: "Bloomberg",
            timestamp: "8 hours ago",
            category: "Healthcare",
            impact: "low"
          },
          {
            id: 5,
            title: "Real Estate Market Shows Signs of Recovery",
            summary: "Los Angeles commercial real estate sector demonstrates improving fundamentals with increased transaction volumes.",
            source: "Wall Street Journal",
            timestamp: "10 hours ago",
            category: "Real Estate",
            impact: "medium"
          },
          {
            id: 6,
            title: "Cryptocurrency Markets Experience Volatility",
            summary: "Digital assets see mixed performance as regulatory clarity continues to evolve in the financial landscape.",
            source: "CoinDesk",
            timestamp: "12 hours ago",
            category: "Cryptocurrency",
            impact: "low"
          }
        ];

        setNews(mockNews);
        setLoading(false);
      }, 1000);
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <Card className="market-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Market News & Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="market-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Market News & Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">Latest financial news from trusted sources</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {news.map((item) => (
            <div key={item.id} className="border-b border-border/50 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-medium hover:text-primary cursor-pointer transition-colors">
                  {item.title}
                </h3>
                <Badge className={`ml-2 ${getImpactColor(item.impact)} text-xs`}>
                  {item.impact.toUpperCase()}
                </Badge>
              </div>
              
              <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                {item.summary}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{item.source}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                <span>{item.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsSection;
