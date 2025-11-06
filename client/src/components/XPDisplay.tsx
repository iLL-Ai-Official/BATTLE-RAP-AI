import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Zap, TrendingUp } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";

interface XPDisplayProps {
  userId: string;
  compact?: boolean;
  showLevelUpAnimation?: boolean;
}

interface ProgressInfo {
  level: number;
  totalXP: number;
  currentLevelXP: number;
  xpNeededForNextLevel: number;
  progressPercent: number;
  title: string | null;
  winStreak: number;
  bestWinStreak: number;
  totalBattlesPlayed: number;
  totalBattlesWon: number;
}

export function XPDisplay({ userId, compact = false, showLevelUpAnimation = true }: XPDisplayProps) {
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const { data: progressInfo, isLoading } = useQuery<ProgressInfo>({
    queryKey: [`/api/users/${userId}/progress`],
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (progressInfo && previousLevel !== null && progressInfo.level > previousLevel && showLevelUpAnimation) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
    if (progressInfo) {
      setPreviousLevel(progressInfo.level);
    }
  }, [progressInfo, previousLevel, showLevelUpAnimation]);

  if (isLoading || !progressInfo) {
    return (
      <Card className={compact ? "w-full" : "w-full max-w-md"}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-24" />
              <div className="h-2 bg-muted rounded animate-pulse w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { level, currentLevelXP, xpNeededForNextLevel, progressPercent, title } = progressInfo;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
          <Star className="h-3 w-3" />
          <span className="font-bold">Lv {level}</span>
        </Badge>
        <div className="flex-1 min-w-[100px]">
          <Progress value={progressPercent} className="h-2" />
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {currentLevelXP}/{xpNeededForNextLevel} XP
        </span>
      </div>
    );
  }

  return (
    <>
      <Card className="w-full max-w-md bg-gradient-to-br from-purple-500/10 via-background to-blue-500/10">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {level}
                  </motion.div>
                </motion.div>

                <div>
                  <h3 className="text-xl font-bold">Level {level}</h3>
                  {title && (
                    <Badge variant="outline" className="mt-1 flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {title}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-muted-foreground">XP Progress</div>
                <div className="text-lg font-bold">
                  {currentLevelXP}/{xpNeededForNextLevel}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Next Level</span>
                <span className="font-medium">{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Win Streak</div>
                <div className="text-lg font-bold flex items-center justify-center gap-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  {progressInfo.winStreak}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Battles</div>
                <div className="text-lg font-bold">{progressInfo.totalBattlesPlayed}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Wins</div>
                <div className="text-lg font-bold flex items-center justify-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  {progressInfo.totalBattlesWon}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4"
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                <Trophy className="h-24 w-24 mx-auto mb-4 text-yellow-300" />
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-2">Level Up!</h2>
              <p className="text-xl text-white/90 mb-4">
                You reached Level {level}!
              </p>
              
              {title && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge className="text-lg px-4 py-2 bg-yellow-500 text-black">
                    <Star className="h-4 w-4 mr-2" />
                    New Title: {title}
                  </Badge>
                </motion.div>
              )}
              
              <motion.div
                className="mt-6 flex gap-2 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-yellow-300"
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
