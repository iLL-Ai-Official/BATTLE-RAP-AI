import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { Mic, ArrowLeft, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Login() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Email and password are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isRegisterMode ? '/api/register' : '/api/login';
      const body = isRegisterMode 
        ? { email: email.trim(), password, firstName: firstName.trim(), lastName: lastName.trim() }
        : { email: email.trim(), password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: isRegisterMode ? "Account created!" : "Welcome back!",
          description: isRegisterMode ? "Your account has been created successfully" : "You've been logged in successfully",
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        toast({
          title: "Error",
          description: data.message || (isRegisterMode ? "Registration failed" : "Login failed"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: isRegisterMode ? "Registration failed. Please try again." : "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Neon Apex Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf640_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf640_1px,transparent_1px)] bg-[size:64px_64px] animate-slow-pulse"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-prism-cyan rounded-full blur-3xl opacity-10 animate-slow-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-magenta rounded-full blur-3xl opacity-10 animate-slow-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="glass-card neon-border-magenta glow-pulse-magenta">
          <CardHeader className="text-center pb-8">
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            >
              <div className="w-20 h-20 bg-gradient-primary-bg rounded-full flex items-center justify-center neon-border-magenta glow-pulse-magenta">
                <Mic className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CardTitle className="text-3xl font-orbitron font-bold text-white mb-2">
                {isRegisterMode ? "JOIN RAPBOTS" : "SIGN IN"}
              </CardTitle>
              <CardDescription className="text-gray-300 text-base">
                {isRegisterMode ? "Create your account to start battling" : "Login to continue your rap battles"}
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent>
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {isRegisterMode && (
                <motion.div 
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-200 font-medium">First Name</Label>
                    <div className="relative glass-panel rounded-lg border border-transparent focus-within:border-neon-magenta focus-within:shadow-glow-magenta transition-all duration-300">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-transparent border-none text-white placeholder-gray-400 pl-10 focus:ring-0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-200 font-medium">Last Name</Label>
                    <div className="relative glass-panel rounded-lg border border-transparent focus-within:border-neon-magenta focus-within:shadow-glow-magenta transition-all duration-300">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-transparent border-none text-white placeholder-gray-400 pl-10 focus:ring-0"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200 font-medium">Email</Label>
                <div className="relative glass-panel rounded-lg border border-transparent focus-within:border-prism-cyan focus-within:shadow-glow-cyan transition-all duration-300">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-none text-white placeholder-gray-400 pl-10 focus:ring-0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200 font-medium">Password</Label>
                <div className="relative glass-panel rounded-lg border border-transparent focus-within:border-prism-cyan focus-within:shadow-glow-cyan transition-all duration-300">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={isRegisterMode ? "Create a password (min. 6 characters)" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent border-none text-white placeholder-gray-400 pl-10 focus:ring-0"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full gradient-primary-bg neon-border-cyan hover-lift text-white font-bold text-lg py-6 rounded-lg"
                  disabled={isLoading || !email.trim() || !password.trim()}
                >
                  {isLoading 
                    ? (isRegisterMode ? "Creating account..." : "Logging in...") 
                    : (isRegisterMode ? "Create Account" : "Sign In")}
                </Button>
              </motion.div>
            </motion.form>

            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setEmail("");
                  setPassword("");
                  setFirstName("");
                  setLastName("");
                }}
                className="text-sm text-gray-300 hover:text-neon-magenta transition-colors duration-300"
              >
                {isRegisterMode ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </motion.div>

            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                className="text-gray-300 hover:text-white hover-lift"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
