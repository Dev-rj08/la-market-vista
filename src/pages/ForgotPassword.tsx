
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen financial-gradient flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-semibold">Check your email</CardTitle>
              <CardDescription>
                We've sent a password reset link to {email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Try again
                  </Button>
                  <Link to="/login">
                    <Button variant="ghost" className="w-full">
                      Back to sign in
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen financial-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">FinancePortal</h1>
          <p className="text-slate-400">Reset your password</p>
        </div>
        
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Forgot password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-primary hover:underline">
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
