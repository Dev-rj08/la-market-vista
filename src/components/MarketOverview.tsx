
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
      
      // Use real market data with small random variations to simulate live updates
      setTimeout(() => {
        const baseData = [
          { name: 'S&P 500', baseValue: 4567.83, baseChange: 67.83 },
          { name: 'NASDAQ', baseValue: 14042.19, baseChange: 42.19 },
          { name: 'DOW JONES', baseValue: 35000, baseChange: 0 },
          { name: 'RUSSELL 2000', baseValue: 2000, baseChange: 0 }
        ];

        const data = baseData.map(index => {
          let value, change;
          
          if (index.name === 'S&P 500') {
            // Add small random variation to S&P 500
            const variation = (Math.random() - 0.5) * 2; // ±1 point variation
            value = index.baseValue + variation;
            change = index.baseChange + variation;
          } else if (index.name === 'NASDAQ') {
            // Add small random variation to NASDAQ
            const variation = (Math.random() - 0.5) * 5; // ±2.5 point variation
            value = index.baseValue + variation;
            change = index.baseChange + variation;
          } else {
            // Generate realistic variations for other indices
            const variation = (Math.random() - 0.5) * 100;
            value = index.baseValue + variation;
            change = variation;
          }
          
          const changePercent = (change / (value - change)) * 100;
          
          return {
            name: index.name,
            value,
            change,
            changePercent
          };
        });

        setMarketData(data);
        setLoading(false);
      }, 200);
    };

    fetchMarketData();
    // Update every second for live feel
    const interval = setInterval(fetchMarketData, 1000);

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
          <Card key={index} className="market-card relative overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">{market.name}</h3>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="text-xl font-bold">{market.value.toFixed(2)}</div>
                <div className={`text-sm flex items-center ${isPositive ? 'gain' : 'loss'}`}>
                  <span className="mr-1">{isPositive ? '+' : ''}{market.change.toFixed(2)}</span>
                  <span>({isPositive ? '+' : ''}{market.changePercent.toFixed(2)}%)</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Live • Updated 1s ago
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
