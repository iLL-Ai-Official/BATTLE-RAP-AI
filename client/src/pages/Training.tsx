import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Lock, CheckCircle2, Trophy, Star, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface TrainingLesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  order: number;
  content: string;
  practicePrompt: string;
  xpReward: number;
  currencyReward: number;
  unlockLevel: number;
  isPremium: boolean;
  isLocked: boolean;
  progress: {
    isCompleted: boolean;
    practiceScore: number | null;
    attempts: number;
  } | null;
}

interface TrainingProgress {
  completedLessons: number;
  totalLessons: number;
  completionPercentage: number;
  progressByCategory: Array<{
    category: string;
    completed: number;
    total: number;
  }>;
}

const categoryInfo: Record<string, { title: string; description: string; icon: string }> = {
  basics: {
    title: "Basics",
    description: "Foundation of rap - flow, rhythm, and basic rhyming",
    icon: "🎤",
  },
  rhyme_schemes: {
    title: "Rhyme Schemes",
    description: "Master perfect, slant, internal, and multi-syllabic rhymes",
    icon: "🎵",
  },
  flow: {
    title: "Flow",
    description: "Cadence, breath control, and switching patterns",
    icon: "🌊",
  },
  wordplay: {
    title: "Wordplay",
    description: "Metaphors, double entendres, and clever linguistics",
    icon: "🎭",
  },
  battle_tactics: {
    title: "Battle Tactics",
    description: "Attacks, rebuttals, crowd control, and strategy",
    icon: "⚔️",
  },
  advanced: {
    title: "Advanced",
    description: "Literary devices, concepts, and professional techniques",
    icon: "🏆",
  },
};

export default function Training() {
  const [selectedCategory, setSelectedCategory] = useState<string>("basics");
  const [selectedLesson, setSelectedLesson] = useState<TrainingLesson | null>(null);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery<TrainingLesson[]>({
    queryKey: [`/api/training/lessons?category=${selectedCategory}`],
  });

  const { data: progress } = useQuery<TrainingProgress>({
    queryKey: ['/api/training/progress'],
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-orange-500";
      case "expert":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleLessonClick = (lesson: TrainingLesson) => {
    if (lesson.isLocked) {
      toast({
        title: "Lesson Locked",
        description: `Reach level ${lesson.unlockLevel} to unlock this lesson`,
        variant: "destructive",
      });
      return;
    }

    setSelectedLesson(lesson);
    setShowLessonDialog(true);
  };

  const handleStartPractice = () => {
    if (!selectedLesson) return;

    setShowLessonDialog(false);
    
    setLocation(`/battle-arena?practicePrompt=${encodeURIComponent(selectedLesson.practicePrompt)}&lessonId=${selectedLesson.id}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <BookOpen className="h-10 w-10" />
          Rap Training Program
        </h1>
        <p className="text-muted-foreground text-lg">
          Master the art of rap with structured lessons from basics to expert level
        </p>
      </div>

      {progress && (
        <Card className="mb-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">
                    {progress.completedLessons} / {progress.totalLessons} Lessons Completed
                  </span>
                  <span className="text-muted-foreground">
                    {Math.round(progress.completionPercentage)}%
                  </span>
                </div>
                <Progress value={progress.completionPercentage} className="h-3" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {progress.progressByCategory.map((cat) => (
                  <div key={cat.category} className="p-3 bg-background/50 rounded-lg">
                    <div className="text-sm font-medium">
                      {categoryInfo[cat.category]?.icon} {categoryInfo[cat.category]?.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {cat.completed}/{cat.total} complete
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full h-auto">
          {Object.entries(categoryInfo).map(([key, info]) => (
            <TabsTrigger key={key} value={key} className="flex flex-col items-center py-3">
              <span className="text-2xl mb-1">{info.icon}</span>
              <span className="text-xs">{info.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(categoryInfo).map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">
                {categoryInfo[category].icon} {categoryInfo[category].title}
              </h2>
              <p className="text-muted-foreground">{categoryInfo[category].description}</p>
            </div>

            {lessonsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lessons.map((lesson) => (
                  <Card
                    key={lesson.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      lesson.isLocked ? "opacity-60" : ""
                    } ${lesson.progress?.isCompleted ? "border-green-500 border-2" : ""}`}
                    onClick={() => handleLessonClick(lesson)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {lesson.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                            {lesson.progress?.isCompleted && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                            {lesson.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {lesson.description}
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline" className={getDifficultyColor(lesson.difficulty) + " text-white"}>
                          {lesson.difficulty}
                        </Badge>
                        {lesson.isPremium && (
                          <Badge variant="secondary" className="bg-yellow-500 text-black">
                            <Star className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        {lesson.isLocked && (
                          <Badge variant="outline">
                            Lv {lesson.unlockLevel}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span>{lesson.xpReward} XP</span>
                          <span className="text-muted-foreground">•</span>
                          <span>{lesson.currencyReward} Currency</span>
                        </div>

                        {lesson.progress && (
                          <div className="text-sm text-muted-foreground">
                            {lesson.progress.isCompleted ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Completed ({lesson.progress.practiceScore}%)</span>
                              </div>
                            ) : lesson.progress.attempts > 0 ? (
                              <span>Attempted {lesson.progress.attempts} time(s)</span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedLesson && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  {selectedLesson.progress?.isCompleted && (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  )}
                  {selectedLesson.title}
                </DialogTitle>
                <DialogDescription className="flex gap-2 mt-2">
                  <Badge className={getDifficultyColor(selectedLesson.difficulty) + " text-white"}>
                    {selectedLesson.difficulty}
                  </Badge>
                  {selectedLesson.isPremium && (
                    <Badge className="bg-yellow-500 text-black">
                      <Star className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  <Badge variant="outline">
                    <Trophy className="h-3 w-3 mr-1 text-yellow-500" />
                    {selectedLesson.xpReward} XP + {selectedLesson.currencyReward} Currency
                  </Badge>
                </DialogDescription>
              </DialogHeader>

              <div className="prose prose-sm dark:prose-invert max-w-none mt-4 whitespace-pre-wrap">
                {selectedLesson.content}
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <Target className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Practice Challenge</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedLesson.practicePrompt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={handleStartPractice} className="flex-1" size="lg">
                  <Target className="h-4 w-4 mr-2" />
                  Start Practice Battle
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowLessonDialog(false)}
                  size="lg"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
