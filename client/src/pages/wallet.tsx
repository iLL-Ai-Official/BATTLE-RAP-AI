import { Navigation } from "@/components/navigation";
import { WalletDashboard } from "@/components/WalletDashboard";

export default function WalletPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-secondary-dark to-primary-dark">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-orbitron font-bold text-cyber-red glow-red mb-2" data-testid="heading-wallet">
              ⛓️ Arc USDC Wallet
            </h1>
            <p className="text-gray-400">
              Your Circle Arc L1 blockchain wallet for tournament prizes and competitive stake battles
            </p>
          </div>
          <WalletDashboard />
        </div>
      </div>
    </div>
  );
}
