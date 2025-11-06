import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, ArrowRightLeft, AlertTriangle, TrendingUp, DollarSign, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface PlatformWallet {
  id: string;
  walletType: string;
  walletAddress: string;
  balance: string;
  minBalance: string | null;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WalletTransaction {
  id: string;
  walletId: string;
  txType: string;
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  txHash: string | null;
  userId: string | null;
  description: string;
  metadata: any;
  createdAt: string;
}

interface WalletStats {
  wallets: PlatformWallet[];
  totalBalance: string;
  alerts: string[];
  walletsCount: number;
}

export default function AdminWallet() {
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [transferData, setTransferData] = useState({
    fromWalletType: "",
    toWalletType: "",
    amount: "",
    description: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: walletStats, isLoading: statsLoading } = useQuery<WalletStats>({
    queryKey: ['/api/admin/wallets'],
    refetchInterval: 30000,
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<WalletTransaction[]>({
    queryKey: ['/api/admin/wallets/transactions'],
  });

  const initializeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/wallets/initialize', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to initialize wallets');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Platform wallets initialized successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/wallets'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize wallets",
        variant: "destructive",
      });
    },
  });

  const transferMutation = useMutation({
    mutationFn: async (data: typeof transferData) => {
      const response = await fetch('/api/admin/wallets/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Transfer failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Transfer Successful",
        description: data.message,
      });
      setShowTransferDialog(false);
      setTransferData({ fromWalletType: "", toWalletType: "", amount: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/wallets/transactions'] });
    },
    onError: (error: any) => {
      toast({
        title: "Transfer Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const checkBalancesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/wallets/check-balances', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to check balances');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.alerts.length > 0) {
        toast({
          title: "Balance Alerts",
          description: `${data.alerts.length} wallet(s) below minimum balance`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "All Clear",
          description: "All wallets have sufficient balance",
        });
      }
    },
  });

  const handleTransfer = () => {
    if (!transferData.fromWalletType || !transferData.toWalletType || !transferData.amount || !transferData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    transferMutation.mutate(transferData);
  };

  const getWalletDisplayName = (walletType: string) => {
    return walletType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getTxTypeColor = (txType: string) => {
    switch (txType) {
      case 'deposit':
        return 'bg-green-500';
      case 'withdrawal':
        return 'bg-red-500';
      case 'reward_payout':
        return 'bg-blue-500';
      case 'profit_transfer':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (statsLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Wallet className="h-10 w-10" />
              Platform Wallet Management
            </h1>
            <p className="text-muted-foreground text-lg">
              Monitor and manage platform wallets and transactions
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => checkBalancesMutation.mutate()}
              disabled={checkBalancesMutation.isPending}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Check Balances
            </Button>
            <Button
              variant="outline"
              onClick={() => initializeMutation.mutate()}
              disabled={initializeMutation.isPending}
            >
              Initialize Wallets
            </Button>
          </div>
        </div>
      </div>

      {walletStats && walletStats.alerts.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Balance Alerts</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside">
              {walletStats.alerts.map((alert, i) => (
                <li key={i}>{alert}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${walletStats?.totalBalance || '0.00'}</div>
            <p className="text-sm text-muted-foreground mt-1">Across all wallets</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-500" />
              Active Wallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{walletStats?.walletsCount || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">Platform wallets</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-purple-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{transactions.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Transactions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {walletStats?.wallets.map((wallet) => (
          <Card key={wallet.id}>
            <CardHeader>
              <CardTitle className="text-lg">{getWalletDisplayName(wallet.walletType)}</CardTitle>
              <CardDescription className="text-xs">{wallet.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold">${wallet.balance}</div>
                  {wallet.minBalance && (
                    <div className="text-xs text-muted-foreground">
                      Min: ${wallet.minBalance}
                    </div>
                  )}
                </div>
                {wallet.minBalance && parseFloat(wallet.balance) < parseFloat(wallet.minBalance) && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Below Minimum
                  </Badge>
                )}
                <div className="text-xs text-muted-foreground break-all">
                  {wallet.walletAddress}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 mb-6">
        <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
          <DialogTrigger asChild>
            <Button className="flex-1">
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Transfer Funds
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transfer Between Wallets</DialogTitle>
              <DialogDescription>
                Manually transfer funds from one platform wallet to another
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label>From Wallet</Label>
                <Select
                  value={transferData.fromWalletType}
                  onValueChange={(value) =>
                    setTransferData({ ...transferData, fromWalletType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    {walletStats?.wallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.walletType}>
                        {getWalletDisplayName(wallet.walletType)} (${wallet.balance})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>To Wallet</Label>
                <Select
                  value={transferData.toWalletType}
                  onValueChange={(value) =>
                    setTransferData({ ...transferData, toWalletType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    {walletStats?.wallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.walletType}>
                        {getWalletDisplayName(wallet.walletType)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Amount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={transferData.amount}
                  onChange={(e) =>
                    setTransferData({ ...transferData, amount: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  placeholder="Reason for transfer"
                  value={transferData.description}
                  onChange={(e) =>
                    setTransferData({ ...transferData, description: e.target.value })
                  }
                />
              </div>

              <Button
                onClick={handleTransfer}
                className="w-full"
                disabled={transferMutation.isPending}
              >
                {transferMutation.isPending ? "Processing..." : "Transfer Funds"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription>Recent wallet transactions and transfers</CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Balance After</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 50).map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <Badge className={getTxTypeColor(tx.txType) + " text-white"}>
                        {tx.txType.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          parseFloat(tx.amount) > 0
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {parseFloat(tx.amount) > 0 ? "+" : ""}${tx.amount}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{tx.description}</TableCell>
                    <TableCell>${tx.balanceAfter}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
