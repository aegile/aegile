import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TimelineExcerpt from './class-timeline-excerpt';

const dayMapping = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

export default function UpcomingClasses({
  tutorials,
}: {
  tutorials: Tutorial[];
}) {
  tutorials.sort((a, b) => {
    const dayDiff = dayMapping[a.day] - dayMapping[b.day];
    if (dayDiff !== 0) return dayDiff;

    return a.times.localeCompare(b.times);
  });

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Upcoming Classes</CardTitle>
        <CardDescription>Your upcoming classes and tutorials.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        {tutorials.map((tutorial) => (
          <TimelineExcerpt
            key={tutorial.id}
            classCode={tutorial.name}
            times={tutorial.times}
            day={tutorial.day}
            location={tutorial.location}
          />
        ))}
      </CardContent>
    </Card>
  );
}
