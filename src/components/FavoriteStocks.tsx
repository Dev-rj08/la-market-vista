
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, X } from 'lucide-react';

interface FavoriteStock {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const FavoriteStocks: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteData, setFavoriteData] = useState<FavoriteStock[]>([]);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteStocks');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    // Simulate fetching data for favorite stocks
    if (favorites.length > 0) {
      const data =favorites.map(symbol => {
        const basePrice = Math.random() * 500 + 50;
        const change = (Math.random() - 0.5) * 20;
        const changePercent = (change / basePrice) * 100;
        
        return {
          symbol,
          price: basePrice,
          change,
          changePercent
        };
      });
      setFavoriteData(data);
    }
  }, [favorites]);

  const removeFavorite = (symbol: string) => {
    const updatedFavorites = favorites.filter(fav => fav !== symbol);
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteStocks', JSON.stringify(updatedFavorites));
  };

  if (favorites.length === 0) {
    return (
      <Card className="market-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-400" />
            Favorite Stocks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No favorite stocks added yet. Click the star icon on any stock to add it to your favorites.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="market-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-400" />
          Favorite Stocks ({favorites.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {favoriteData.map((stock) => {
            const isPositive = stock.change >= 0;
            
            return (
              <div key={stock.symbol} className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-card/20">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-medium">{stock.symbol}</h3>
                    <div className="text-lg font-bold">${stock.price.toFixed(2)}</div>
                  </div>
                  <div className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}${stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFavorite(stock.symbol)}
                  className="text-muted-foreground hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoriteStocks;
