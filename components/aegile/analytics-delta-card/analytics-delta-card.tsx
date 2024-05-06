import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { capitalize } from '@/lib/utils';

export default function AnalyticsDeltaCard({
  description,
  value,
  unit,
  percentChange,
  timeUnit,
}: {
  description: string;
  value: number;
  unit: string;
  percentChange: number;
  timeUnit: string;
}) {
  let progress = percentChange >= 0 ? percentChange : 100 + percentChange;
  // Ensure progress is between 0 and 100
  progress = Math.max(0, Math.min(100, progress));

  return (
    <Card x-chunk={description}>
      <CardHeader className="pb-2">
        <CardDescription>This {capitalize(timeUnit)}</CardDescription>
        <CardTitle className="text-4xl">
          {value.toLocaleString()}
          <span className="text-2xl"> {unit}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {percentChange > 0 && '+'}
          {percentChange}% from last {timeUnit.toLowerCase()}
        </div>
      </CardContent>
      <CardFooter>
        <Progress
          value={progress}
          aria-label={progress + '% change'}
          className={
            percentChange < 0 ? 'bg-red-100 dark:bg-[#3b1919]' : ''
            //   : 'bg-green-100 dark:bg-[#1f3d1f]'
          }
        />
      </CardFooter>
    </Card>
  );
}
