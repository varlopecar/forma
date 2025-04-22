import { useEffect, useState } from "react";

export interface WorkoutSession {
  id: string;
  date: Date;
  type: "push" | "pull" | "legs" | "cardio" | "rest";
  intensity: "low" | "medium" | "high";
  duration: number; // in minutes
  effortPoints: number[]; // 5 data points for the mini chart
}

export interface WorkoutRecommendation {
  type: "push" | "pull" | "legs" | "cardio" | "rest";
  intensity: "low" | "medium" | "high";
}

export function useMockWorkoutData() {
  const [recentSessions, setRecentSessions] = useState<WorkoutSession[]>([]);
  const [recommendation, setRecommendation] = useState<WorkoutRecommendation>({
    type: "push",
    intensity: "high",
  });

  // Generate mock data on mount
  useEffect(() => {
    const mockSessions: WorkoutSession[] = [
      {
        id: "1",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        type: "pull",
        intensity: "medium",
        duration: 45,
        effortPoints: [65, 70, 85, 75, 60],
      },
      {
        id: "2",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        type: "legs",
        intensity: "high",
        duration: 60,
        effortPoints: [70, 85, 90, 95, 75],
      },
      {
        id: "3",
        date: new Date(), // today
        type: "rest",
        intensity: "low",
        duration: 0,
        effortPoints: [0, 0, 0, 0, 0],
      },
    ];

    setRecentSessions(mockSessions);
  }, []);

  // Change recommendation every 30 seconds for demo purposes
  useEffect(() => {
    const types: WorkoutRecommendation["type"][] = [
      "push",
      "pull",
      "legs",
      "cardio",
      "rest",
    ];
    const intensities: WorkoutRecommendation["intensity"][] = [
      "low",
      "medium",
      "high",
    ];

    const interval = setInterval(() => {
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomIntensity =
        intensities[Math.floor(Math.random() * intensities.length)];

      setRecommendation({
        type: randomType,
        intensity: randomIntensity,
      });
    }, 30000); // Change every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    recentSessions,
    recommendation,
  };
}
