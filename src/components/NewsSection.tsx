
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
  const [usingFallback, setUsingFallback] = useState(false);

  const NEWS_API_KEY = '3ed47be691e6438b83d440d111cb538f';

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        console.log('Attempting to fetch financial news...');
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=stock+market+finance+trading&sortBy=publishedAt&pageSize=6&apiKey=${NEWS_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('News API Response:', data);
        
        if (data.articles && data.articles.length > 0) {
          setNews(data.articles);
          setUsingFallback(false);
        } else {
          console.warn('No articles found in response, using fallback');
          setNews(getEnhancedMockNews());
          setUsingFallback(true);
        }
      } catch (error) {
        console.error('NewsAPI Error:', error);
        console.log('Using enhanced fallback news due to API limitations');
        setNews(getEnhancedMockNews());
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    const getEnhancedMockNews = (): NewsItem[] => [
      {
        title: "S&P 500 Reaches New Heights Amid Strong Corporate Earnings",
        description: "The S&P 500 index climbed to 4567.83, gaining 67.83 points (+1.51%) as major corporations report stronger-than-expected quarterly earnings. Technology and healthcare sectors led the gains.",
        source: { name: "MarketWatch" },
        publishedAt: new Date().toISOString(),
        url: "#"
      },
      {
        title: "NASDAQ Composite Shows Steady Growth at 14,042 Points",
        description: "The NASDAQ Composite index rose 42.19 points (+0.30%) to close at 14,042.19, driven by strong performance in tech stocks and growing investor confidence in AI and cloud computing sectors.",
        source: { name: "Financial Times" },
        publishedAt: new Date(Date.now() - 1800000).toISOString(),
        url: "#"
      },
      {
        title: "Federal Reserve Maintains Current Interest Rate Policy",
        description: "The Federal Reserve announced it will maintain current interest rates while closely monitoring inflation indicators and employment data for future policy decisions.",
        source: { name: "Reuters" },
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        url: "#"
      },
      {
        title: "Tech Giants Lead Market Rally with AI Innovation Focus",
        description: "Major technology companies including Apple (AAPL), Microsoft (MSFT), and Google (GOOGL) show strong performance as artificial intelligence investments drive growth expectations.",
        source: { name: "Bloomberg" },
        publishedAt: new Date(Date.now() - 5400000).toISOString(),
        url: "#"
      },
      {
        title: "Energy Sector Volatility Amid Global Supply Chain Concerns",
        description: "Oil and gas stocks experience mixed performance as investors weigh global supply chain disruptions against increasing energy demand in emerging markets.",
        source: { name: "CNBC" },
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        url: "#"
      },
      {
        title: "Cryptocurrency Markets Show Renewed Institutional Interest",
        description: "Bitcoin and major altcoins gain momentum as institutional investors increase cryptocurrency allocations, with several major banks announcing digital asset services.",
        source: { name: "CoinDesk" },
        publishedAt: new Date(Date.now() - 9000000).toISOString(),
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
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {usingFallback ? 'Curated financial news' : 'Latest news from NewsAPI'}
          </p>
          {usingFallback && (
            <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
              DEMO MODE
            </Badge>
          )}
        </div>
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
                  {usingFallback ? 'DEMO' : 'LIVE'}
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
        
        {usingFallback && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-xs text-yellow-400">
              <strong>Note:</strong> NewsAPI requires localhost for free tier. 
              Real news will be available when deployed or with a paid NewsAPI plan.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsSection;
