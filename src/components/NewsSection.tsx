
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NewsItem {
  title: string;
  description: string;
  source: {
    name: string;
  };
  publishedAt: string;
  url: string;
  urlToImage?: string;
}

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = '3ed47be691e6438b83d440d111cb538f';

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        console.log('Fetching financial news...');
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=stock+market+finance+trading&sortBy=publishedAt&pageSize=6&apiKey=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('News API Response:', data);
        
        if (data.articles) {
          setNews(data.articles);
        } else {
          console.error('No articles found in response');
          // Fallback to mock data if API fails
          setNews(getMockNews());
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        // Fallback to mock data if API fails
        setNews(getMockNews());
      } finally {
        setLoading(false);
      }
    };

    const getMockNews = () => [
      {
        title: "Federal Reserve Signals Potential Rate Changes",
        description: "The Federal Reserve indicated possible adjustments to interest rates following recent economic indicators.",
        source: { name: "Financial Times" },
        publishedAt: new Date().toISOString(),
        url: "#"
      },
      {
        title: "Tech Stocks Rally on AI Developments",
        description: "Major technology companies see significant gains as artificial intelligence innovations continue.",
        source: { name: "MarketWatch" },
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        url: "#"
      },
      {
        title: "Energy Sector Shows Resilience",
        description: "Oil and gas companies demonstrate strong quarterly performance despite global uncertainties.",
        source: { name: "Reuters" },
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        url: "#"
      }
    ];

    fetchNews();
    const interval = setInterval(fetchNews, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishedAt = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - publishedAt.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
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
        <p className="text-sm text-muted-foreground">Latest financial news from NewsAPI</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {news.map((article, index) => (
            <div key={index} className="border-b border-border/50 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-medium hover:text-primary cursor-pointer transition-colors">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </h3>
                <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-blue-500/50 text-xs">
                  LIVE
                </Badge>
              </div>
              
              <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                {article.description || 'No description available'}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{article.source.name}</span>
                  <Badge variant="outline" className="text-xs">
                    Finance
                  </Badge>
                </div>
                <span>{formatTimeAgo(article.publishedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsSection;
