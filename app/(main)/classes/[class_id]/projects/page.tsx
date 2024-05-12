import { ProjectsInbox } from "./_components/projects-inbox";

const assignments = [
  {
    id: "ass_1",
    name: "Assignment 1",
    variant: "individual",
    weighting: 10,
    deadline: "2024-05-01T23:59:00",
    description: "Description 1",
    labels: ["Label 1", "Label 2"],
    archived: false,
  },
  {
    id: "ass_2",
    name: "Assignment 2",
    variant: "group",
    weighting: 10,
    deadline: "2024-05-08T23:59:00",
    description: "Description 2",
    labels: ["Label 3", "Label 4"],
    archived: false,
  },
  {
    id: "ass_3",
    name: "Assignment 3",
    variant: "individual",
    weighting: 10,
    deadline: "2024-05-15T23:59:00",
    description: "Description 3",
    labels: ["Label 5", "Label 6"],
    archived: false,
  },
  {
    id: "ass_4",
    name: "Assignment 4",
    variant: "group",
    weighting: 10,
    deadline: "2024-05-22T23:59:00",
    description: "Description 4",
    labels: ["Label 7", "Label 8"],
    archived: false,
  },
  {
    id: "ass_5",
    name: "Assignment 5",
    variant: "individual",
    weighting: 10,
    deadline: "2024-05-29T23:59:00",
    description: "Description 5",
    labels: ["Label 9", "Label 10"],
    archived: false,
  },
  {
    id: "ass_6",
    name: "Assignment 6",
    variant: "group",
    weighting: 10,
    deadline: "2024-06-05T23:59:00",
    description: "Description 6",
    labels: ["Label 11", "Label 12"],
    archived: false,
  },
  {
    id: "ass_7",
    name: "Assignment 7",
    variant: "individual",
    weighting: 10,
    deadline: "2024-06-12T23:59:00",
    description: "Description 7",
    labels: ["Label 13", "Label 14"],
    archived: false,
  },
  {
    id: "ass_8",
    name: "Assignment 8",
    variant: "group",
    weighting: 10,
    deadline: "2024-06-19T23:59:00",
    description: "Description 8",
    labels: ["Label 15", "Label 16"],
    archived: false,
  },
  {
    id: "ass_9",
    name: "Assignment 9",
    variant: "individual",
    weighting: 10,
    deadline: "2024-06-26T23:59:00",
    description: "Description 9",
    labels: ["Label 17", "Label 18"],
    archived: false,
  },
  {
    id: "ass_10",
    name: "Assignment 10",
    variant: "group",
    weighting: 10,
    deadline: "2024-07-03T23:59:00",
    description: "Description 10",
    labels: ["Label 19", "Label 20"],
    archived: false,
  },
];

export default async function ClassesHomePage() {
  return (
    <main className="grid flex-1 flex-grow gap-4 bg-muted/40 p-4 pb-0 sm:px-6 md:gap-8">
      <ProjectsInbox items={assignments} />
    </main>
  );
}
