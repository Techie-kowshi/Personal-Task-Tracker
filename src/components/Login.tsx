
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    setError('');
    onLogin(username.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-md shadow-ai border-0 glass animate-scale-in">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center shadow-glow animate-float">
            <UserCheck className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              TaskTracker AI
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-3 text-base">
              Enter your username to start your productivity journey
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-14 text-lg border-border/50 focus:border-primary transition-all duration-300 bg-background/50"
                autoFocus
              />
              {error && <p className="text-destructive text-sm mt-2 animate-fade-in">{error}</p>}
            </div>
            <Button 
              type="submit" 
              className="w-full h-14 text-lg gradient-primary hover:shadow-glow transition-all duration-300 animate-pulse-glow"
            >
              Get Started
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
