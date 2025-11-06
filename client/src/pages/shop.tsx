import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { ShoppingBag, Star, Palette, Sparkles, Crown, Zap, Check, Lock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Navigation } from '@/components/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  category: 'avatar' | 'badge' | 'title' | 'emote' | 'effect';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  price: number;
  isPremiumOnly: boolean;
  imageUrl?: string;
}

interface UserInventory {
  items: string[];
  equipped: {
    avatar?: string;
    badge?: string;
    title?: string;
    effect?: string;
  };
}

export default function ShopPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<CosmeticItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch shop items
  const { data: shopItems = [] } = useQuery<CosmeticItem[]>({
    queryKey: ['/api/shop/items'],
  });

  // Fetch user inventory
  const { data: inventory } = useQuery<UserInventory>({
    queryKey: ['/api/shop/inventory'],
  });

  // Purchase item
  const purchaseItem = useMutation({
    mutationFn: async (itemId: string) => {
      return apiRequest('POST', '/api/shop/purchase', { itemId });
    },
    onSuccess: () => {
      toast({
        title: "Purchase Successful!",
        description: "Item has been added to your inventory.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/shop/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setShowPreview(false);
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Insufficient funds or item unavailable.",
        variant: "destructive",
      });
    },
  });

  // Equip item
  const equipItem = useMutation({
    mutationFn: async ({ itemId, category }: { itemId: string; category: string }) => {
      return apiRequest('POST', '/api/shop/equip', { itemId, category });
    },
    onSuccess: () => {
      toast({
        title: "Item Equipped!",
        description: "Your new item is now active.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/shop/inventory'] });
      setShowPreview(false);
    },
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-neon-magenta via-purple-500 to-prism-cyan';
      case 'epic': return 'from-purple-500 to-neon-magenta';
      case 'rare': return 'from-blue-500 to-prism-cyan';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'neon-border-magenta neon-border-cyan';
      case 'epic': return 'neon-border-magenta';
      case 'rare': return 'neon-border-cyan';
      default: return 'border-2 border-gray-700';
    }
  };

  const getRarityTextClass = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-neon-magenta';
      case 'epic': return 'text-neon-magenta';
      case 'rare': return 'text-prism-cyan';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'avatar': return <Palette size={20} />;
      case 'badge': return <Star size={20} />;
      case 'title': return <Crown size={20} />;
      case 'emote': return <Sparkles size={20} />;
      case 'effect': return <Zap size={20} />;
      default: return <ShoppingBag size={20} />;
    }
  };

  const filteredItems = shopItems.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const isOwned = (itemId: string) => inventory?.items.includes(itemId) || false;
  const isEquipped = (itemId: string) => Object.values(inventory?.equipped || {}).includes(itemId);

  const userBalance = (user as any)?.storeCredit || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white p-4">
      <Navigation />
      
      <div className="max-w-7xl mx-auto pt-20">
        <motion.div 
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-5xl font-orbitron font-bold mb-2 bg-gradient-to-r from-neon-magenta via-purple-400 to-prism-cyan bg-clip-text text-transparent">
              NEON SHOP
            </h1>
            <p className="text-gray-400 font-mono">Premium cosmetics for elite rappers</p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-card neon-border-cyan glow-pulse-cyan p-6"
          >
            <div className="flex items-center gap-3">
              <Star className="text-prism-cyan" size={32} />
              <div>
                <div className="stat-badge text-neon-magenta font-orbitron text-2xl">
                  ${userBalance.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400 font-mono mt-1">STORE CREDITS</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <TabsList className="glass-panel border border-purple-500/30 flex-wrap h-auto gap-2 p-2">
              <TabsTrigger 
                value="all" 
                className={`gap-2 hover-lift transition-all duration-300 ${selectedCategory === 'all' ? 'neon-border-magenta gradient-primary-bg' : ''}`}
              >
                <ShoppingBag size={16} />
                All Items
              </TabsTrigger>
              <TabsTrigger 
                value="avatar" 
                className={`gap-2 hover-lift transition-all duration-300 ${selectedCategory === 'avatar' ? 'neon-border-magenta gradient-primary-bg' : ''}`}
              >
                <Palette size={16} />
                Avatars
              </TabsTrigger>
              <TabsTrigger 
                value="badge" 
                className={`gap-2 hover-lift transition-all duration-300 ${selectedCategory === 'badge' ? 'neon-border-magenta gradient-primary-bg' : ''}`}
              >
                <Star size={16} />
                Badges
              </TabsTrigger>
              <TabsTrigger 
                value="title" 
                className={`gap-2 hover-lift transition-all duration-300 ${selectedCategory === 'title' ? 'neon-border-magenta gradient-primary-bg' : ''}`}
              >
                <Crown size={16} />
                Titles
              </TabsTrigger>
              <TabsTrigger 
                value="emote" 
                className={`gap-2 hover-lift transition-all duration-300 ${selectedCategory === 'emote' ? 'neon-border-magenta gradient-primary-bg' : ''}`}
              >
                <Sparkles size={16} />
                Emotes
              </TabsTrigger>
              <TabsTrigger 
                value="effect" 
                className={`gap-2 hover-lift transition-all duration-300 ${selectedCategory === 'effect' ? 'neon-border-magenta gradient-primary-bg' : ''}`}
              >
                <Zap size={16} />
                Effects
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  className={`glass-card ${getRarityBorder(item.rarity)} ${isEquipped(item.id) ? 'glow-pulse-cyan' : ''} hover-lift cursor-pointer transition-all duration-300 ${item.rarity === 'legendary' ? 'gradient-card-bg' : ''}`}
                  onClick={() => {
                    setSelectedItem(item);
                    setShowPreview(true);
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className={`text-lg flex items-center gap-2 font-orbitron ${getRarityTextClass(item.rarity)}`}>
                          {getCategoryIcon(item.category)}
                          {item.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1 font-mono">
                          {item.description}
                        </CardDescription>
                      </div>
                      {isEquipped(item.id) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <Badge className="neon-border-cyan glow-pulse-cyan text-prism-cyan border-0 stat-badge">
                            <Check size={12} className="mr-1" />
                            EQUIPPED
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className={`w-full h-40 rounded-lg bg-gradient-to-br ${getRarityColor(item.rarity)} flex items-center justify-center mb-4 relative overflow-hidden`}
                      whileHover={{ rotate: item.rarity === 'legendary' ? [0, -2, 2, -2, 0] : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {item.rarity === 'legendary' && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-neon-magenta/20 to-prism-cyan/20"
                          animate={{ 
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full object-contain relative z-10" />
                      ) : (
                        <div className="text-6xl opacity-50 relative z-10">
                          {getCategoryIcon(item.category)}
                        </div>
                      )}
                    </motion.div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Badge className={`bg-gradient-to-r ${getRarityColor(item.rarity)} text-white border-0 capitalize font-orbitron`}>
                          {item.rarity}
                        </Badge>
                      </div>
                      <div className="text-right">
                        {isOwned(item.id) ? (
                          <div className="text-prism-cyan font-semibold flex items-center gap-1 font-mono">
                            <Check size={16} />
                            OWNED
                          </div>
                        ) : item.isPremiumOnly ? (
                          <div className="text-yellow-400 text-sm flex items-center gap-1 font-mono">
                            <Crown size={14} />
                            PREMIUM
                          </div>
                        ) : (
                          <div className="stat-badge text-neon-magenta font-orbitron">
                            <Star className="text-prism-cyan inline mr-1" size={16} />
                            ${item.price}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-card border-gray-700"
              >
                <CardContent className="text-center py-12">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ShoppingBag className="mx-auto mb-4 text-gray-500" size={48} />
                  </motion.div>
                  <p className="text-gray-400 font-mono">No items in this category yet</p>
                  <p className="text-sm text-gray-500 mt-2 font-mono">Check back soon for new cosmetics!</p>
                </CardContent>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

        {/* Item Preview Dialog */}
        <AnimatePresence>
          {showPreview && selectedItem && (
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogContent className="glass-card neon-border-magenta max-w-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <DialogHeader>
                    <DialogTitle className={`flex items-center gap-2 font-orbitron ${getRarityTextClass(selectedItem.rarity)}`}>
                      {getCategoryIcon(selectedItem.category)}
                      {selectedItem.name}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 font-mono">
                      {selectedItem.description}
                    </DialogDescription>
                  </DialogHeader>

                  <motion.div 
                    className={`w-full h-64 rounded-lg bg-gradient-to-br ${getRarityColor(selectedItem.rarity)} flex items-center justify-center relative overflow-hidden`}
                    animate={selectedItem.rarity === 'legendary' ? { 
                      boxShadow: [
                        '0 0 20px rgba(255, 0, 255, 0.3)',
                        '0 0 40px rgba(0, 255, 255, 0.5)',
                        '0 0 20px rgba(255, 0, 255, 0.3)'
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {selectedItem.rarity === 'legendary' && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-neon-magenta/30 to-prism-cyan/30"
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                    )}
                    {selectedItem.imageUrl ? (
                      <motion.img 
                        src={selectedItem.imageUrl} 
                        alt={selectedItem.name} 
                        className="max-h-full max-w-full object-contain relative z-10"
                        animate={selectedItem.rarity === 'legendary' ? { 
                          y: [0, -10, 0] 
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    ) : (
                      <motion.div 
                        className="text-8xl opacity-50 relative z-10"
                        animate={{ rotate: selectedItem.rarity === 'legendary' ? [0, 5, -5, 0] : 0 }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {getCategoryIcon(selectedItem.category)}
                      </motion.div>
                    )}
                  </motion.div>

                  <div className="space-y-3 my-4">
                    <div className="flex items-center justify-between glass-panel p-3 rounded-lg">
                      <span className="text-gray-400 font-mono">RARITY:</span>
                      <Badge className={`bg-gradient-to-r ${getRarityColor(selectedItem.rarity)} text-white border-0 capitalize font-orbitron`}>
                        {selectedItem.rarity}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between glass-panel p-3 rounded-lg">
                      <span className="text-gray-400 font-mono">CATEGORY:</span>
                      <span className="text-white capitalize flex items-center gap-2 font-mono">
                        {getCategoryIcon(selectedItem.category)}
                        {selectedItem.category}
                      </span>
                    </div>
                    {!isOwned(selectedItem.id) && (
                      <div className="flex items-center justify-between glass-panel p-3 rounded-lg">
                        <span className="text-gray-400 font-mono">PRICE:</span>
                        <span className="stat-badge text-neon-magenta font-orbitron">
                          <Star className="text-prism-cyan inline mr-1" size={16} />
                          ${selectedItem.price}
                        </span>
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    {isOwned(selectedItem.id) ? (
                      <motion.div
                        className="w-full"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => equipItem.mutate({ itemId: selectedItem.id, category: selectedItem.category })}
                          disabled={isEquipped(selectedItem.id)}
                          className={`w-full font-orbitron ${isEquipped(selectedItem.id) ? 'neon-border-cyan glow-pulse-cyan' : 'gradient-primary-bg'} hover-lift`}
                        >
                          {isEquipped(selectedItem.id) ? (
                            <>
                              <Check className="mr-2" size={16} />
                              CURRENTLY EQUIPPED
                            </>
                          ) : (
                            <>
                              <Check className="mr-2" size={16} />
                              EQUIP ITEM
                            </>
                          )}
                        </Button>
                      </motion.div>
                    ) : selectedItem.isPremiumOnly ? (
                      <Button
                        disabled
                        className="w-full bg-gray-700 cursor-not-allowed font-orbitron"
                      >
                        <Crown className="mr-2" size={16} />
                        PREMIUM ONLY
                      </Button>
                    ) : (
                      <motion.div
                        className="w-full"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => purchaseItem.mutate(selectedItem.id)}
                          disabled={userBalance < selectedItem.price}
                          className="w-full gradient-primary-bg hover-lift font-orbitron neon-border-magenta"
                        >
                          <ShoppingBag className="mr-2" size={16} />
                          PURCHASE FOR ${selectedItem.price}
                        </Button>
                      </motion.div>
                    )}
                  </DialogFooter>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
