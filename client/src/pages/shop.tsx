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
      case 'legendary': return 'from-yellow-500 to-orange-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-500 shadow-yellow-500/50';
      case 'epic': return 'border-purple-500 shadow-purple-500/50';
      case 'rare': return 'border-blue-500 shadow-blue-500/50';
      default: return 'border-gray-600';
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Cosmetic Shop
            </h1>
            <p className="text-gray-400">Customize your rapper profile with exclusive items</p>
          </div>
          
          <Card className="bg-gray-900/80 border-purple-500/30 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400" size={24} />
                <div>
                  <div className="text-2xl font-bold text-white">${userBalance.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">Store Credits</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="bg-gray-900 border border-purple-500/30 flex-wrap h-auto">
            <TabsTrigger value="all" className="gap-2">
              <ShoppingBag size={16} />
              All Items
            </TabsTrigger>
            <TabsTrigger value="avatar" className="gap-2">
              <Palette size={16} />
              Avatars
            </TabsTrigger>
            <TabsTrigger value="badge" className="gap-2">
              <Star size={16} />
              Badges
            </TabsTrigger>
            <TabsTrigger value="title" className="gap-2">
              <Crown size={16} />
              Titles
            </TabsTrigger>
            <TabsTrigger value="emote" className="gap-2">
              <Sparkles size={16} />
              Emotes
            </TabsTrigger>
            <TabsTrigger value="effect" className="gap-2">
              <Zap size={16} />
              Effects
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card 
                  key={item.id}
                  className={`bg-gray-900/80 border-2 backdrop-blur transition-all hover:shadow-lg cursor-pointer ${getRarityBorder(item.rarity)}`}
                  onClick={() => {
                    setSelectedItem(item);
                    setShowPreview(true);
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                          {getCategoryIcon(item.category)}
                          {item.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {item.description}
                        </CardDescription>
                      </div>
                      {isEquipped(item.id) && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500">
                          <Check size={12} className="mr-1" />
                          Equipped
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`w-full h-40 rounded-lg bg-gradient-to-br ${getRarityColor(item.rarity)} flex items-center justify-center mb-4`}>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <div className="text-6xl opacity-50">
                          {getCategoryIcon(item.category)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Badge className={`bg-gradient-to-r ${getRarityColor(item.rarity)} text-white border-0 capitalize`}>
                          {item.rarity}
                        </Badge>
                      </div>
                      <div className="text-right">
                        {isOwned(item.id) ? (
                          <div className="text-green-400 font-semibold flex items-center gap-1">
                            <Check size={16} />
                            Owned
                          </div>
                        ) : item.isPremiumOnly ? (
                          <div className="text-yellow-400 text-sm flex items-center gap-1">
                            <Crown size={14} />
                            Premium
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-white font-bold">
                            <Star className="text-yellow-400" size={16} />
                            ${item.price}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <Card className="bg-gray-900/80 border-gray-700 backdrop-blur">
                <CardContent className="text-center py-12">
                  <ShoppingBag className="mx-auto mb-4 text-gray-500" size={48} />
                  <p className="text-gray-400">No items in this category yet</p>
                  <p className="text-sm text-gray-500 mt-2">Check back soon for new cosmetics!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Item Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          {selectedItem && (
            <DialogContent className="bg-gray-900 border-purple-500/50 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  {getCategoryIcon(selectedItem.category)}
                  {selectedItem.name}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  {selectedItem.description}
                </DialogDescription>
              </DialogHeader>

              <div className={`w-full h-64 rounded-lg bg-gradient-to-br ${getRarityColor(selectedItem.rarity)} flex items-center justify-center`}>
                {selectedItem.imageUrl ? (
                  <img src={selectedItem.imageUrl} alt={selectedItem.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="text-8xl opacity-50">
                    {getCategoryIcon(selectedItem.category)}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Rarity:</span>
                  <Badge className={`bg-gradient-to-r ${getRarityColor(selectedItem.rarity)} text-white border-0 capitalize`}>
                    {selectedItem.rarity}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white capitalize flex items-center gap-2">
                    {getCategoryIcon(selectedItem.category)}
                    {selectedItem.category}
                  </span>
                </div>
                {!isOwned(selectedItem.id) && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-white font-bold flex items-center gap-1">
                      <Star className="text-yellow-400" size={16} />
                      ${selectedItem.price}
                    </span>
                  </div>
                )}
              </div>

              <DialogFooter>
                {isOwned(selectedItem.id) ? (
                  <Button
                    onClick={() => equipItem.mutate({ itemId: selectedItem.id, category: selectedItem.category })}
                    disabled={isEquipped(selectedItem.id)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {isEquipped(selectedItem.id) ? (
                      <>
                        <Check className="mr-2" size={16} />
                        Currently Equipped
                      </>
                    ) : (
                      <>
                        <Check className="mr-2" size={16} />
                        Equip Item
                      </>
                    )}
                  </Button>
                ) : selectedItem.isPremiumOnly ? (
                  <Button
                    disabled
                    className="w-full bg-gray-700 cursor-not-allowed"
                  >
                    <Crown className="mr-2" size={16} />
                    Premium Only
                  </Button>
                ) : (
                  <Button
                    onClick={() => purchaseItem.mutate(selectedItem.id)}
                    disabled={userBalance < selectedItem.price}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <ShoppingBag className="mr-2" size={16} />
                    Purchase for ${selectedItem.price}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  );
}
