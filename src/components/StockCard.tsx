
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
}

interface StockCardProps {
  symbol: string;
  currency: string;
}

const StockCard: React.FC<StockCardProps> = ({ symbol, currency }) => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if stock is in favorites
    const favorites = JSON.parse(localStorage.getItem('favoriteStocks') || '[]');
    setIsFavorite(favorites.includes(symbol));

    // Simulate API call with mock data
    const fetchStockData = () => {
      setLoading(true);
      
      // Mock data generation
      setTimeout(() => {
        const basePrice = Math.random() * 500 + 50;
        const change = (Math.random() - 0.5) * 20;
        const changePercent = (change / basePrice) * 100;
        
        // Currency conversion simulation
        let convertedPrice = basePrice;
        switch (currency) {
          case 'EUR':
            convertedPrice = basePrice * 0.85;
            break;
          case 'GBP':
            convertedPrice = basePrice * 0.73;
            break;
          case 'JPY':
            convertedPrice = basePrice * 110;
            break;
          case 'CAD':
            convertedPrice = basePrice * 1.25;
            break;
          case 'INR':
            convertedPrice = basePrice * 83;
            break;
        }

        setStockData({
          symbol,
          price: convertedPrice,
          change: change * (currency === 'JPY' ? 110 : currency === 'CAD' ? 1.25 : currency === 'EUR' ? 0.85 : currency === 'GBP' ? 0.73 : currency === 'INR' ? 83 : 1),
          changePercent,
          volume: Math.floor(Math.random() * 10000000) + 1000000,
          marketCap: `${(Math.random() * 2000 + 100).toFixed(1)}B`
        });
        setLoading(false);
      }, Math.random() * 1000 + 500);
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [symbol, currency]);

  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'CAD': return 'C$';
      case 'INR': return '₹';
      default: return '$';
    }
  };

  const formatPrice = (price: number) => {
    return currency === 'JPY' || currency === 'INR'
      ? price.toFixed(0)
      : price.toFixed(2);
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteStocks') || '[]');
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favorites.filter((fav: string) => fav !== symbol);
    } else {
      updatedFavorites = [...favorites, symbol];
    }
    
    localStorage.setItem('favoriteStocks', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  if (loading || !stockData) {
    return (
      <Card className="market-card animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-4 bg-muted rounded w-16"></div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-8 bg-muted rounded w-24"></div>
          <div className="h-4 bg-muted rounded w-20"></div>
          <div className="h-3 bg-muted rounded w-16"></div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = stockData.change >= 0;

  return (
    <Card className={`market-card transition-all duration-300 ${
      isPositive ? 'hover:shadow-green-500/20' : 'hover:shadow-red-500/20'
    } hover:shadow-lg`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{stockData.symbol}</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleFavorite}
            className={`p-1 ${isFavorite ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-2xl font-bold">
          {getCurrencySymbol(currency)}{formatPrice(stockData.price)}
        </div>
        
        <div className={`flex items-center space-x-2 ${isPositive ? 'gain' : 'loss'}`}>
          <span className="text-sm font-medium">
            {isPositive ? '+' : ''}{getCurrencySymbol(currency)}{Math.abs(stockData.change).toFixed(2)}
          </span>
          <span className="text-sm">
            ({isPositive ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
          </span>
        </div>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Vol: {stockData.volume.toLocaleString()}</div>
          <div>Cap: {getCurrencySymbol(currency)}{stockData.marketCap}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockCard;
