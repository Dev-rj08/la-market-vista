
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface LiborRate {
  term: string;
  rate: number;
  change: number;
  changePercent: number;
}

const LiborRates: React.FC = () => {
  const [liborRates, setLiborRates] = useState<LiborRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiborRates = () => {
      setLoading(true);
      
      setTimeout(() => {
        const rates = [
          { term: '1 Month', rate: 5.25, change: 0.05, changePercent: 0.96 },
          { term: '3 Month', rate: 5.45, change: -0.02, changePercent: -0.37 },
          { term: '6 Month', rate: 5.62, change: 0.08, changePercent: 1.44 },
          { term: '12 Month', rate: 5.78, change: 0.03, changePercent: 0.52 }
        ];
        
        setLiborRates(rates);
        setLoading(false);
      }, 800);
    };

    fetchLiborRates();
    const interval = setInterval(fetchLiborRates, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="market-card animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-5 bg-muted rounded w-32"></div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-muted rounded w-16"></div>
              <div className="h-4 bg-muted rounded w-12"></div>
              <div className="h-4 bg-muted rounded w-16"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="market-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">LIBOR Rates</CardTitle>
        <p className="text-xs text-muted-foreground">London Interbank Offered Rate</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {liborRates.map((rate, index) => {
          const isPositive = rate.change >= 0;
          
          return (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium">{rate.term}</span>
              <div className="text-right">
                <div className="text-lg font-bold">{rate.rate.toFixed(2)}%</div>
                <div className={`flex items-center text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {isPositive ? '+' : ''}{rate.change.toFixed(2)}% ({isPositive ? '+' : ''}{rate.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default LiborRates;
