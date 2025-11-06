import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Eye, EyeOff, Key, CheckCircle, AlertCircle, Zap, Settings2, TestTube } from 'lucide-react';

interface APIKeyStatus {
  hasValidOpenAI: boolean;
  hasValidGroq: boolean;
  hasValidElevenLabs: boolean;
  preferredTtsService: string;
}

export function APIKeyManager() {
  const [openaiKey, setOpenaiKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [elevenlabsKey, setElevenlabsKey] = useState('');
  const [preferredService, setPreferredService] = useState('elevenlabs');
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [showElevenlabsKey, setShowElevenlabsKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: keyStatus, isLoading } = useQuery<APIKeyStatus>({
    queryKey: ['/api/user/api-keys'],
    retry: 1,
  });

  const updateKeysMutation = useMutation({
    mutationFn: async (data: { 
      openaiApiKey?: string; 
      groqApiKey?: string; 
      elevenlabsApiKey?: string;
      preferredTtsService?: string;
    }) => {
      const response = await apiRequest('PUT', '/api/user/api-keys', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/api-keys'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      toast({
        title: "API Keys Updated",
        description: "Your API keys have been saved successfully.",
      });
      setOpenaiKey('');
      setGroqKey('');
      setElevenlabsKey('');
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update API keys",
        variant: "destructive",
      });
    },
  });

  const testKeyMutation = useMutation({
    mutationFn: async (service: 'openai' | 'groq' | 'elevenlabs') => {
      const response = await apiRequest('POST', '/api/user/test-api-key', { service });
      return response.json();
    },
    onSuccess: (data, service) => {
      toast({
        title: `${service.toUpperCase()} API Key Test`,
        description: data.valid ? "API key is valid and working!" : "API key test failed",
        variant: data.valid ? "default" : "destructive",
      });
    },
    onError: (error: any, service) => {
      toast({
        title: `${service.toUpperCase()} Test Failed`,
        description: error.message || "Failed to test API key",
        variant: "destructive",
      });
    },
  });

  const handleSaveKeys = () => {
    const updates: any = {};
    
    if (openaiKey.trim()) {
      updates.openaiApiKey = openaiKey.trim();
    }
    
    if (groqKey.trim()) {
      updates.groqApiKey = groqKey.trim();
    }
    
    if (elevenlabsKey.trim()) {
      updates.elevenlabsApiKey = elevenlabsKey.trim();
    }
    
    if (preferredService !== keyStatus?.preferredTtsService) {
      updates.preferredTtsService = preferredService;
    }
    
    if (Object.keys(updates).length > 0) {
      updateKeysMutation.mutate(updates);
    } else {
      toast({
        title: "No Changes",
        description: "No new API keys or preference changes to save.",
      });
    }
  };

  const handleTestKey = (service: 'openai' | 'groq' | 'elevenlabs') => {
    testKeyMutation.mutate(service);
  };

  React.useEffect(() => {
    if (keyStatus) {
      setPreferredService(keyStatus.preferredTtsService || 'elevenlabs');
    }
  }, [keyStatus]);

  const hasChanges = openaiKey.trim() || groqKey.trim() || elevenlabsKey.trim() || 
                     (preferredService !== keyStatus?.preferredTtsService);

  if (isLoading) {
    return (
      <div className="glass-panel p-8 rounded-xl">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-neon-magenta border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400 font-code">Loading API key status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-8 rounded-xl">
      <div className="neon-border-cyan rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Key className="w-5 h-5 text-prism-cyan" />
          <h3 className="text-xl font-orbitron font-bold text-white">API Key Management</h3>
        </div>
        <p className="text-gray-300 text-sm">
          Add your own API keys for enhanced TTS services and better voice quality
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-3 rounded-lg"
          >
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-400 font-code">OpenAI:</span>
              {keyStatus?.hasValidOpenAI ? (
                <span className="stat-badge text-matrix-green border-matrix-green flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </span>
              ) : (
                <span className="stat-badge text-gray-400 border-gray-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Not Set
                </span>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="glass-panel p-3 rounded-lg"
          >
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-400 font-code">Groq:</span>
              {keyStatus?.hasValidGroq ? (
                <span className="stat-badge text-matrix-green border-matrix-green flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </span>
              ) : (
                <span className="stat-badge text-gray-400 border-gray-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Not Set
                </span>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="glass-panel p-3 rounded-lg"
          >
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-400 font-code">ElevenLabs:</span>
              {keyStatus?.hasValidElevenLabs ? (
                <span className="stat-badge text-matrix-green border-matrix-green flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </span>
              ) : (
                <span className="stat-badge text-gray-400 border-gray-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Not Set
                </span>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="glass-panel p-3 rounded-lg neon-border-magenta"
          >
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-400 font-code">Preferred:</span>
              <span className="stat-badge gradient-primary-bg text-white flex items-center gap-1">
                <Settings2 className="w-3 h-3" />
                {keyStatus?.preferredTtsService || 'elevenlabs'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* API Key Input Tabs */}
        <Tabs defaultValue="openai" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-panel p-2 gap-2">
            <TabsTrigger 
              value="openai" 
              className="data-[state=active]:gradient-primary-bg data-[state=active]:neon-border-cyan transition-all duration-300 font-code"
            >
              OpenAI
            </TabsTrigger>
            <TabsTrigger 
              value="groq" 
              className="data-[state=active]:gradient-primary-bg data-[state=active]:neon-border-cyan transition-all duration-300 font-code"
            >
              Groq
            </TabsTrigger>
            <TabsTrigger 
              value="elevenlabs" 
              className="data-[state=active]:gradient-primary-bg data-[state=active]:neon-border-cyan transition-all duration-300 font-code"
            >
              ElevenLabs
            </TabsTrigger>
          </TabsList>
          
          {/* OpenAI API Key */}
          <TabsContent value="openai" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="openai-key" className="text-white font-orbitron">
                OpenAI API Key
              </Label>
              <div className="relative">
                <Input
                  id="openai-key"
                  type={showOpenaiKey ? "text" : "password"}
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                  className="glass-panel border-gray-600 text-white pr-20 focus:ring-2 focus:ring-neon-magenta transition-all duration-300"
                  data-testid="input-openai-key"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                      className="h-6 w-6 p-0 hover:bg-neon-magenta/20"
                    >
                      {showOpenaiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </motion.div>
                  {keyStatus?.hasValidOpenAI && (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestKey('openai')}
                        disabled={testKeyMutation.isPending}
                        className="h-6 w-6 p-0 hover:bg-prism-cyan/20"
                        data-testid="button-test-openai"
                      >
                        <TestTube className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Get your API key from{' '}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-prism-cyan hover:underline"
                >
                  OpenAI Platform
                </a>
              </p>
            </motion.div>
          </TabsContent>
          
          {/* Groq API Key */}
          <TabsContent value="groq" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="groq-key" className="text-white font-orbitron">
                Groq API Key
              </Label>
              <div className="relative">
                <Input
                  id="groq-key"
                  type={showGroqKey ? "text" : "password"}
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_..."
                  className="glass-panel border-gray-600 text-white pr-20 focus:ring-2 focus:ring-neon-magenta transition-all duration-300"
                  data-testid="input-groq-key"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowGroqKey(!showGroqKey)}
                      className="h-6 w-6 p-0 hover:bg-neon-magenta/20"
                    >
                      {showGroqKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </motion.div>
                  {keyStatus?.hasValidGroq && (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestKey('groq')}
                        disabled={testKeyMutation.isPending}
                        className="h-6 w-6 p-0 hover:bg-prism-cyan/20"
                        data-testid="button-test-groq"
                      >
                        <TestTube className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Get your API key from{' '}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-prism-cyan hover:underline"
                >
                  Groq Console
                </a>
              </p>
            </motion.div>
          </TabsContent>
          
          {/* ElevenLabs API Key */}
          <TabsContent value="elevenlabs" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <Label htmlFor="elevenlabs-key" className="text-white font-orbitron">
                ElevenLabs API Key
              </Label>
              <div className="relative">
                <Input
                  id="elevenlabs-key"
                  type={showElevenlabsKey ? "text" : "password"}
                  value={elevenlabsKey}
                  onChange={(e) => setElevenlabsKey(e.target.value)}
                  placeholder="sk_..."
                  className="glass-panel border-gray-600 text-white pr-20 focus:ring-2 focus:ring-neon-magenta transition-all duration-300"
                  data-testid="input-elevenlabs-key"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowElevenlabsKey(!showElevenlabsKey)}
                      className="h-6 w-6 p-0 hover:bg-neon-magenta/20"
                    >
                      {showElevenlabsKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </motion.div>
                  {keyStatus?.hasValidElevenLabs && (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestKey('elevenlabs')}
                        disabled={testKeyMutation.isPending}
                        className="h-6 w-6 p-0 hover:bg-prism-cyan/20"
                        data-testid="button-test-elevenlabs"
                      >
                        <TestTube className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Get your API key from{' '}
                <a
                  href="https://elevenlabs.io/subscription"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-prism-cyan hover:underline"
                >
                  ElevenLabs Dashboard
                </a>
              </p>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* TTS Service Preference */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-2"
        >
          <Label htmlFor="preferred-service" className="text-white font-orbitron">
            Preferred TTS Service
          </Label>
          <Select value={preferredService} onValueChange={setPreferredService}>
            <SelectTrigger 
              className="glass-panel border-gray-600 text-white focus:ring-2 focus:ring-neon-magenta transition-all duration-300" 
              data-testid="select-preferred-tts"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-panel border-gray-600">
              <SelectItem value="system" className="text-white hover:bg-neon-magenta/20">
                System (Bark + Typecast)
              </SelectItem>
              <SelectItem value="openai" className="text-white hover:bg-neon-magenta/20">
                OpenAI (gpt-4o-mini-tts with steerability)
              </SelectItem>
              <SelectItem value="groq" className="text-white hover:bg-neon-magenta/20">
                Groq (PlayAI - 10x faster)
              </SelectItem>
              <SelectItem value="elevenlabs" className="text-white hover:bg-neon-magenta/20">
                ElevenLabs (Premium voices with character mapping)
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-400">
            System services are always available as fallback
          </p>
        </motion.div>

        {/* Save Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleSaveKeys}
            disabled={updateKeysMutation.isPending}
            className={`w-full gradient-primary-bg neon-border-cyan hover-lift font-orbitron ${
              hasChanges ? 'glow-pulse-magenta' : ''
            }`}
            data-testid="button-save-api-keys"
          >
            <AnimatePresence mode="wait">
              {updateKeysMutation.isPending ? (
                <motion.div
                  key="saving"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Saving...
                </motion.div>
              ) : saveSuccess ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Saved Successfully!
                </motion.div>
              ) : (
                <motion.div
                  key="save"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Save API Keys & Preferences
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
