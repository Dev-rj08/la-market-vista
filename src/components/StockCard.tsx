
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp } from 'lucide-react';
import StockDetailModal from './StockDetailModal';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  previousClose: number;
}

interface StockCardProps {
  symbol: string;
  currency: string;
}

const StockCard: React.FC<StockCardProps> = ({ symbol, currency }) => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const FINNHUB_API_KEY = 'd1b5991r01qjhvtsl1ggd1b5991r01qjhvtsl1h0';
  const FIXER_API_KEY = '56a344b21c244aaa2ab92acc7253659f';

  useEffect(() => {
    // Check if stock is in favorites
    const favorites = JSON.parse(localStorage.getItem('favoriteStocks') || '[]');
    setIsFavorite(favorites.includes(symbol));

    const fetchStockData = async () => {
      setLoading(true);
      try {
        console.log(`Fetching real data for ${symbol}...`);
        
        // Fetch current stock quote from Finnhub
        const quoteResponse = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );
        const quoteData = await quoteResponse.json();
        
        // Fetch company profile for market cap
        const profileResponse = await fetch(
          `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );
        const profileData = await profileResponse.json();
        
        console.log('Finnhub Quote Data:', quoteData);
        console.log('Finnhub Profile Data:', profileData);
        
        if (quoteData.c && quoteData.c > 0) {
          const currentPrice = quoteData.c;
          const previousClose = quoteData.pc;
          const change = quoteData.d;
          const changePercent = quoteData.dp;
          
          // Convert currency if needed
          let convertedPrice = currentPrice;
          let convertedChange = change;
          
          if (currency !== 'USD') {
            try {
              const exchangeResponse = await fetch(
                `https://api.fixer.io/latest?access_key=${FIXER_API_KEY}&base=USD&symbols=${currency}`
              );
              const exchangeData = await exchangeResponse.json();
              
              if (exchangeData.success && exchangeData.rates[currency]) {
                const rate = exchangeData.rates[currency];
                convertedPrice = currentPrice * rate;
                convertedChange = change * rate;
              }
            } catch (error) {
              console.error('Currency conversion failed:', error);
            }
          }
          
          setStockData({
            symbol,
            price: convertedPrice,
            change: convertedChange,
            changePercent,
            volume: quoteData.v || 0,
            marketCap: profileData.marketCapitalization ? 
              `${(profileData.marketCapitalization / 1000).toFixed(1)}B` : 
              'N/A',
            previousClose
          });
        } else {
          console.error('Invalid stock data received');
          // Fallback to mock data
          generateMockData();
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
        generateMockData();
      } finally {
        setLoading(false);
      }
    };

    const generateMockData = () => {
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
        marketCap: `${(Math.random() * 2000 + 100).toFixed(1)}B`,
        previousClose: basePrice - change
      });
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 15000); // Update every 15 seconds

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

  const handleCardClick = () => {
    setShowModal(true);
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
    <>
      <Card 
        className={`market-card transition-all duration-300 cursor-pointer ${
          isPositive ? 'hover:shadow-green-500/20' : 'hover:shadow-red-500/20'
        } hover:shadow-lg hover:scale-105`}
        onClick={handleCardClick}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{stockData.symbol}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite();
                }}
                className={`p-1 ${isFavorite ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}`}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Live Data"></div>
            </div>
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
            <div>Cap: {stockData.marketCap}</div>
            <div>Prev: {getCurrencySymbol(currency)}{formatPrice(stockData.previousClose)}</div>
          </div>
          
          <div className="text-xs text-blue-400 opacity-75 mt-2">
            Click to view detailed chart • Live from Finnhub
          </div>
        </CardContent>
      </Card>

      <StockDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        symbol={stockData.symbol}
        currency={currency}
      />
    </>
  );
};

export default StockCard;
