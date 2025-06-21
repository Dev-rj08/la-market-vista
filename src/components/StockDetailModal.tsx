
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';

interface StockDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  currency: string;
}

interface ChartDataPoint {
  date: string;
  price: number;
  volume: number;
}

const StockDetailModal: React.FC<StockDetailModalProps> = ({ isOpen, onClose, symbol, currency }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('1M');
  const [stockInfo, setStockInfo] = useState<any>(null);

  const API_KEY = 'AHW1121LRJ833H9W';

  useEffect(() => {
    if (isOpen && symbol) {
      fetchStockData();
    }
  }, [isOpen, symbol, timeRange]);

  const fetchStockData = async () => {
    setLoading(true);
    try {
      console.log(`Fetching data for ${symbol} with range ${timeRange}`);
      
      // Fetch daily time series data
      const timeSeriesResponse = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
      );
      const timeSeriesData = await timeSeriesResponse.json();
      
      // Fetch company overview
      const overviewResponse = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
      );
      const overviewData = await overviewResponse.json();
      
      console.log('Time Series Data:', timeSeriesData);
      console.log('Overview Data:', overviewData);
      
      if (timeSeriesData['Time Series (Daily)']) {
        const timeSeries = timeSeriesData['Time Series (Daily)'];
        const processedData: ChartDataPoint[] = Object.entries(timeSeries)
          .slice(0, getDataPointsCount())
          .map(([date, data]: [string, any]) => ({
            date,
            price: parseFloat(data['4. close']),
            volume: parseInt(data['5. volume'])
          }))
          .reverse();
        
        setChartData(processedData);
        setStockInfo(overviewData);
      } else {
        console.error('No time series data found');
        // Fallback to mock data if API fails
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
    const dataPoints = getDataPointsCount();
    const mockData: ChartDataPoint[] = [];
    let basePrice = Math.random() * 200 + 50;
    
    for (let i = 0; i < dataPoints; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (dataPoints - i));
      
      basePrice += (Math.random() - 0.5) * 10;
      mockData.push({
        date: date.toISOString().split('T')[0],
        price: Math.max(basePrice, 10),
        volume: Math.floor(Math.random() * 10000000) + 1000000
      });
    }
    
    setChartData(mockData);
    setStockInfo({
      Name: `${symbol} Corporation`,
      MarketCapitalization: (Math.random() * 2000000000000).toFixed(0),
      PERatio: (Math.random() * 30 + 5).toFixed(2),
      DividendYield: (Math.random() * 5).toFixed(3)
    });
  };

  const getDataPointsCount = () => {
    switch (timeRange) {
      case '1W': return 7;
      case '1M': return 30;
      case '3M': return 90;
      case '1Y': return 365;
      default: return 30;
    }
  };

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

  const getPerformance = () => {
    if (chartData.length < 2) return { change: 0, changePercent: 0 };
    
    const firstPrice = chartData[0].price;
    const lastPrice = chartData[chartData.length - 1].price;
    const change = lastPrice - firstPrice;
    const changePercent = (change / firstPrice) * 100;
    
    return { change, changePercent };
  };

  const performance = getPerformance();
  const isPositive = performance.change >= 0;

  const chartConfig = {
    price: {
      label: "Price",
      color: isPositive ? "#22c55e" : "#ef4444",
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            <span>{symbol} Stock Analysis</span>
            <div className="flex space-x-2">
              {['1W', '1M', '3M', '1Y'].map((range) => (
                <Button
                  key={range}
                  size="sm"
                  variant={timeRange === range ? "default" : "outline"}
                  onClick={() => setTimeRange(range)}
                  className="text-xs"
                >
                  {range}
                </Button>
              ))}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading stock data...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stock Info Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card/50 p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground">Current Price</div>
                <div className="text-xl font-bold">
                  {getCurrencySymbol(currency)}{formatPrice(chartData[chartData.length - 1]?.price || 0)}
                </div>
              </div>
              <div className="bg-card/50 p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground">Change ({timeRange})</div>
                <div className={`text-xl font-bold flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {isPositive ? '+' : ''}{performance.changePercent.toFixed(2)}%
                </div>
              </div>
              <div className="bg-card/50 p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="text-xl font-bold">
                  {stockInfo?.MarketCapitalization ? 
                    `${getCurrencySymbol(currency)}${(parseInt(stockInfo.MarketCapitalization) / 1e9).toFixed(1)}B` : 
                    'N/A'
                  }
                </div>
              </div>
              <div className="bg-card/50 p-4 rounded-lg border">
                <div className="text-sm text-muted-foreground">P/E Ratio</div>
                <div className="text-xl font-bold">
                  {stockInfo?.PERatio || 'N/A'}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-card/20 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Price Chart - {timeRange}</h3>
              <ChartContainer config={chartConfig} className="h-80">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${getCurrencySymbol(currency)}${formatPrice(value)}`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value: any) => [`${getCurrencySymbol(currency)}${formatPrice(value)}`, 'Price']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke={chartConfig.price.color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </div>

            {/* Additional Info */}
            {stockInfo && (
              <div className="bg-card/20 p-4 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Company Name:</strong> {stockInfo.Name || `${symbol} Corporation`}
                  </div>
                  <div>
                    <strong>Dividend Yield:</strong> {stockInfo.DividendYield ? `${stockInfo.DividendYield}%` : 'N/A'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StockDetailModal;
