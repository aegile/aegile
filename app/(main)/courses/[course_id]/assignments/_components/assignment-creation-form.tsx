"use client";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { convertUTCDateLocalTimeToISO } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// {
//   "assignment_id": "string",
//   "name": "Milestone 1",
//   "description": "UML diagrams + model and API tests using pytest",
//   "deadline": "2024-05-09T12:38:16.634778"
// }

const assigmentCreationFormSchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "Assignment name must be at least 5 characters.",
    })
    .max(120, {
      message: "Assignment name must not exceed 120 characters.",
    })
    .nonempty("assigment name is required."),
  type: z.string().nonempty("Assignment type is required."),
  dueDate: z.date({
    required_error: "A deadline is required.",
  }),
  dueTime: z
    .string()
    .regex(
      /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])(:[0-5]?[0-9])?$/,
      "Due Time must be in HH:mm or HH:mm:ss format.",
    ),
});

export function AssignmentCreationForm() {
  const { course_id } = useParams();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof assigmentCreationFormSchema>>({
    resolver: zodResolver(assigmentCreationFormSchema),
    defaultValues: {
      name: "Capstone Project",
      type: "individual",
      dueDate: new Date(),
      dueTime: "23:59",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof assigmentCreationFormSchema>) {
    const submittedValues = {
      course_id,
      deadline: convertUTCDateLocalTimeToISO(values.dueDate, values.dueTime),
      name: values.name,
      type: values.type,
    };

    toast(
      <div className="w-full">
        <p>You submitted the following values:</p>
        <pre className="mt-2 w-full overflow-x-auto rounded-md bg-slate-900 p-4">
          <code className="text-white">
            {JSON.stringify(submittedValues, null, 2)}
          </code>
        </pre>
      </div>,
    );

    fetch("/api/assignments", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submittedValues), // body data type must match "Content-Type" header
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Error: ${response.status} - ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        toast.success("Success!!");
      })
      .catch((error) => {
        toast.error(error.toString());
      });
    router.refresh();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignment Name</FormLabel>
              <FormControl>
                <Input placeholder="Capstone Project" {...field} />
              </FormControl>
              {/* <FormDescription>
                assigment name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-2">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[200px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {/* <FormDescription>When is this due?</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Time</FormLabel>
                <FormControl>
                  <Input
                    // defaultValue={"2024-05-04T15:28"}
                    type="time"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>When is this due?</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignment Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a submission type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                  <SelectItem value="homework">Homework</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Individual or group submission?{" "}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="submit" className="ml-auto mt-2">
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
}
