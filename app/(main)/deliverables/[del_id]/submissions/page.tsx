"use client";

import * as React from "react";

import { FileIcon, UploadCloudIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/IjMiBFq3KSY
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ClientDateTime } from "@/components/custom/client-datetime";
import {
  Step,
  Stepper,
  useStepper,
  type StepItem,
  type StepperProps,
} from "@/components/stepper";

const steps = [
  { label: "Step 1" },
  { label: "Step 2" },
  { label: "Step 3" },
] satisfies StepItem[];

const stepContent = [
  SubmissionTable,
  UploadArea,
  () => {
    return (
      <>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
          omnis nostrum vel consequuntur quos incidunt porro aliquid iste enim?
          Velit, ea. Ea quisquam vel animi aspernatur eligendi voluptatum
          provident quas.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
          omnis nostrum vel consequuntur quos incidunt porro aliquid iste enim?
          Velit, ea. Ea quisquam vel animi aspernatur eligendi voluptatum
          provident quas.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
          omnis nostrum vel consequuntur quos incidunt porro aliquid iste enim?
          Velit, ea. Ea quisquam vel animi aspernatur eligendi voluptatum
          provident quas.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
          omnis nostrum vel consequuntur quos incidunt porro aliquid iste enim?
          Velit, ea. Ea quisquam vel animi aspernatur eligendi voluptatum
          provident quas.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
          omnis nostrum vel consequuntur quos incidunt porro aliquid iste enim?
          Velit, ea. Ea quisquam vel animi aspernatur eligendi voluptatum
          provident quas.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
          omnis nostrum vel consequuntur quos incidunt porro aliquid iste enim?
          Velit, ea. Ea quisquam vel animi aspernatur eligendi voluptatum
          provident quas.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
          omnis nostrum vel consequuntur quos incidunt porro aliquid iste enim?
          Velit, ea. Ea quisquam vel animi aspernatur eligendi voluptatum
          provident quas.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
          omnis nostrum vel consequuntur quos incidunt porro aliquid iste enim?
          Velit, ea. Ea quisquam vel animi aspernatur eligendi voluptatum
          provident quas.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
          omnis nostrum vel consequuntur quos incidunt porro aliquid iste enim?
          Velit, ea. Ea quisquam vel animi aspernatur eligendi voluptatum
          provident quas.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
          omnis nostrum vel consequuntur quos incidunt porro aliquid iste enim?
          Velit, ea. Ea quisquam vel animi aspernatur eligendi voluptatum
          provident quas.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
          omnis nostrum vel consequuntur quos incidunt porro aliquid iste enim?
          Velit, ea. Ea quisquam vel animi aspernatur eligendi voluptatum
          provident quas.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
          omnis nostrum vel consequuntur quos incidunt porro aliquid iste enim?
          Velit, ea. Ea quisquam vel animi aspernatur eligendi voluptatum
          provident quas.
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio
          omnis nostrum vel consequuntur quos incidunt porro aliquid iste enim?
          Velit, ea. Ea quisquam vel animi aspernatur eligendi voluptatum
          provident quas.
        </p>
      </>
    );
  },
];

export default function DeliverableSubmissionsPage({
  params,
}: {
  params: { del_id: string };
}) {
  const [orientation, setOrientation] =
    React.useState<StepperProps["orientation"]>("vertical");
  return (
    <div className="flex flex-grow flex-col px-4 py-6 md:px-10">
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight">Submissions</h2>
        <p className="text-sm text-muted-foreground">
          Submit the required files for this deliverable.
        </p>
      </div>
      <Separator className="my-6" />
      {/* <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <SubmissionTable />
        <UploadArea />
      </div> */}
      <div className="m-auto flex w-full max-w-3xl flex-grow flex-col gap-4">
        <Stepper initialStep={0} steps={steps} scrollTracking>
          {steps.map((stepProps, index) => {
            return (
              <Step key={stepProps.label} {...stepProps}>
                <div className="flex-grow px-2 pt-5 md:px-20">
                  {stepContent[index]()}
                </div>
                <Footer />
              </Step>
            );
          })}
        </Stepper>
      </div>
    </div>
  );
}

const Footer = () => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
    isDisabledStep,
  } = useStepper();
  return (
    <>
      {hasCompletedAllSteps && (
        <div className="my-2 flex h-40 items-center justify-center rounded-md border bg-secondary text-primary">
          <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
        </div>
      )}
      <div className="flex w-full justify-end gap-2 pt-3">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={resetSteps}>
            Reset
          </Button>
        ) : (
          <>
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              size="sm"
              variant="secondary"
            >
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            </Button>
          </>
        )}
      </div>
    </>
  );
};
function SubmissionTable() {
  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold">
        {/* [Deliverable name goes here] */}
        COMP1531 Project - Milestone 1
      </h3>
      <Table className="w-full border">
        <TableBody className="[&>*:nth-child(odd)]:bg-muted">
          <TableRow>
            <TableCell className="border-r font-semibold">
              Submission status
            </TableCell>
            <TableCell>No submissions have been made yet</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border-r font-semibold">
              Grading status
            </TableCell>
            <TableCell>Not graded</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border-r font-semibold">Due date</TableCell>
            <TableCell>
              <ClientDateTime datetime={new Date()} variant="formal" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border-r font-semibold">
              Time remaining
            </TableCell>
            <TableCell>6 days, 12 hours remain</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border-r font-semibold">
              Last modified
            </TableCell>
            <TableCell>-</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border-r font-semibold">
              File Submissions
            </TableCell>
            <TableCell>
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <FileIcon className="h-4 w-4" />
                  Lorem ipsum dolor sit.zip
                </div>
                <div className="flex items-center gap-1">
                  <FileIcon className="h-4 w-4" />
                  amet consectetur adipisicing elit.docx
                </div>
                <div className="flex items-center gap-1">
                  <FileIcon className="h-4 w-4" />
                  z5555555_firstname_lastname_assignment_final.pdf
                </div>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="border-r font-semibold">
              Submission comments
            </TableCell>
            <TableCell>-</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

function UploadArea() {
  return (
    <div>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Assignment Submission</h3>
          <p className="text-sm text-muted-foreground">
            Please fill out the form below to submit your assignment.
          </p>
        </div>
        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Submission name</Label>
              <Input id="name" placeholder="Enter a name for this submission" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-id">Student ID</Label>
              <Input id="student-id" placeholder="Enter your student ID" />
            </div>
          </div>
          <div>
            <label className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 hover:bg-gray-100 ">
              <div className=" text-center">
                <div className=" mx-auto max-w-min rounded-md border p-2">
                  <UploadCloudIcon size={20} />
                </div>

                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold">Drag & drop files</span>
                </p>
                <p className="text-xs text-gray-500">
                  Click to upload files &#40;files should be under 10 MB &#41;
                </p>
              </div>
            </label>

            <Input
              id="dropzone-file"
              accept="image/png, image/jpeg"
              type="file"
              className="hidden"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              rows={4}
              placeholder="Enter any additional comments"
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Assignment
          </Button>
        </form>
      </div>
    </div>
  );
}
