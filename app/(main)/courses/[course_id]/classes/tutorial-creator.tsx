"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { format, nextWednesday } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { clientFetch, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TimePickerFields } from "@/components/datetime-picker/time-picker-fields";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  // "Saturday",
  // "Sunday",
];

const tutorialCreationFormSchema = z
  .object({
    course_id: z.string().nonempty("Parent Course ID is required."),
    name: z
      .string()
      .min(4, {
        message: "Tutorial name must be at least 4 characters.",
      })
      .nonempty("Tutorial name is required."),
    capacity: z.number().nonnegative("Capacity must be a positive number."),
    //   weighting: z.preprocess(
    //     (val) => (typeof val === "string" ? parseFloat(val) : val),
    //     z.number().nonnegative().max(100, "Cannot exceed 100%"),
    //   ),
    //   datetime: z.date({
    //     required_error: "A date & time is required.",
    //   }),
    //   dates: z.array(z.date()).nonempty("At least one date is required."),
    day: z.string().refine((day) => daysOfWeek.includes(day)),
    start_time: z.date(),
    end_time: z.date(),
    location: z.string(),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: "End time must be greater than start time",
    path: ["end_time"], // This specifies which field the error is associated with
  });

function localDateToISOTime(date: Date) {
  return date.toISOString().split("T")[1];
}

function ISOTimeToLocalDate(time: string, localDate: Date) {
  const date = new Date();
  const [hours, minutes, ...rem] = time.split(":");
  localDate.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);

  // Get local hours and minutes
  const localHours = date.getHours().toString().padStart(2, "0");
  const localMinutes = date.getMinutes().toString().padStart(2, "0");

  const now = new Date();
  localDate.setHours(parseInt(localHours), parseInt(localMinutes), 0, 0);
  return localDate;
}

export default function TutorialCreator() {
  const router = useRouter();

  const { course_id } = useParams();
  const [open, setOpen] = useState(false);

  const tempDate = new Date();

  const form = useForm<z.infer<typeof tutorialCreationFormSchema>>({
    resolver: zodResolver(tutorialCreationFormSchema),
    defaultValues: {
      course_id: Array.isArray(course_id) ? undefined : course_id,
      name: "T14A",
      capacity: 25,
      start_time: new Date(tempDate.setHours(10, 0, 0, 0)),
      end_time: new Date(tempDate.setHours(12, 0, 0, 0)),
      day: "Wednesday",
      location: "Online",
    },
  });

  function onSubmit(values: z.infer<typeof tutorialCreationFormSchema>) {
    const { start_time, end_time, ...rem } = values;
    const valuesToSubmit = {
      start_time: localDateToISOTime(start_time),
      end_time: localDateToISOTime(end_time),
      ...rem,
    };
    toast(
      <div className="w-full">
        <p>You submitted the following values:</p>
        <pre className="mt-2 w-full overflow-x-auto rounded-md bg-slate-900 p-4">
          <code className="text-white">
            {JSON.stringify(valuesToSubmit, null, 2)}
          </code>
        </pre>
      </div>,
    );

    clientFetch(`/api/tutorials`, "POST", valuesToSubmit)
      .then((data) => {
        toast.success("Tutorial created successfully!");
        setOpen(false);
        router.refresh();
      })
      .catch((error) => toast.error(error.message));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="expandIcon" Icon={PlusIcon} iconPlacement="left">
          New tutorial
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add tutorial</DialogTitle>
          <DialogDescription>
            Add a new tutorial to the course.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-6"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Tutorial name</FormLabel>
                    <FormControl>
                      <Input placeholder="F09A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max capacity</FormLabel>
                    <FormControl>
                      <Input placeholder="25" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem className="w-fit">
                    <FormLabel>Start time</FormLabel>
                    <FormControl>
                      <TimePickerFields
                        setDate={field.onChange}
                        date={field.value}
                      />
                      {/* <Input type="time" {...field} /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End time</FormLabel>
                    <FormControl>
                      <TimePickerFields
                        setDate={field.onChange}
                        date={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4 ">
              <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Day of tutorial</FormLabel>
                    <FormControl>
                      <ToggleGroup
                        type="single"
                        variant="outline"
                        onValueChange={(value) => {
                          if (value) form.setValue("day", value);
                        }}
                        {...field}
                      >
                        {daysOfWeek.map((day, index) => (
                          <ToggleGroupItem
                            key={day}
                            value={day}
                            aria-label={"Tutorial day:" + day}
                          >
                            {index === 3 ? "H" : day.slice(0, 1)}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Online" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* <FormField
              control={form.control}
              name="dates"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Tutorial dates ({field.value?.length || 0})
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-fit whitespace-pre-wrap pl-3 text-left font-normal",
                            !field.value?.length && "text-muted-foreground",
                          )}
                        >
                          {field.value?.length ? (
                            field.value
                              .map((date) =>
                                format(
                                  date,
                                  "dd MMM" +
                                    (date.getFullYear() ==
                                    new Date().getFullYear()
                                      ? ""
                                      : " yyyy"),
                                ),
                              )
                              .join(", ")
                          ) : (
                            <span>Pick dates</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="multiple"
                        selected={field.value}
                        weekStartsOn={1}
                        onSelect={(selectedDates) =>
                          field.onChange(selectedDates)
                        }
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your dates of birth are used to calculate your age.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
