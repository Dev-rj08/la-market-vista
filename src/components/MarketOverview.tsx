
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MarketData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

interface MarketOverviewProps {
  currency: string;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ currency }) => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = () => {
      setLoading(true);
      
      setTimeout(() => {
        const indices = [
          { name: 'S&P 500', baseValue: 4500 },
          { name: 'NASDAQ', baseValue: 14000 },
          { name: 'DOW JONES', baseValue: 35000 },
          { name: 'RUSSELL 2000', baseValue: 2000 }
        ];

        const data = indices.map(index => {
          const change = (Math.random() - 0.5) * 200;
          const changePercent = (change / index.baseValue) * 100;
          
          return {
            name: index.name,
            value: index.baseValue + change,
            change,
            changePercent
          };
        });

        setMarketData(data);
        setLoading(false);
      }, 800);
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [currency]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="market-card animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-6 bg-muted rounded w-16"></div>
                <div className="h-3 bg-muted rounded w-14"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {marketData.map((market, index) => {
        const isPositive = market.change >= 0;
        
        return (
          <Card key={index} className="market-card">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">{market.name}</h3>
                <div className="text-xl font-bold">{market.value.toFixed(2)}</div>
                <div className={`text-sm ${isPositive ? 'gain' : 'loss'}`}>
                  {isPositive ? '+' : ''}{market.change.toFixed(2)} ({isPositive ? '+' : ''}{market.changePercent.toFixed(2)}%)
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MarketOverview;
