import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TimelineExcerpt from './class-timeline-excerpt';

function getRandomDate() {
  const start = new Date();
  const end = new Date(new Date().setMonth(start.getMonth() + 1));
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString();
}

export default function UpcomingClasses() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Upcoming Classes</CardTitle>
        <CardDescription>Your upcoming classes and tutorials.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <TimelineExcerpt
          classCode="H14A"
          times="11am-1pm"
          date={getRandomDate()}
          location="Roundhouse G107"
        />
        <TimelineExcerpt
          classCode="B22B"
          times="9am-11am"
          date={getRandomDate()}
          location="Library L204"
        />

        <TimelineExcerpt
          classCode="C33C"
          times="2pm-4pm"
          date={getRandomDate()}
          location="Engineering E305"
        />

        <TimelineExcerpt
          classCode="D44D"
          times="12pm-2pm"
          date={getRandomDate()}
          location="Science S101"
        />

        <TimelineExcerpt
          classCode="E55E"
          times="3pm-5pm"
          date={getRandomDate()}
          location="Arts A107"
        />

        <TimelineExcerpt
          classCode="F66F"
          times="10am-12pm"
          date={getRandomDate()}
          location="Business B203"
        />
      </CardContent>
    </Card>
  );
}
