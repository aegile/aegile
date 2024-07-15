"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { TimePickerFields } from "@/components/datetime-picker/time-picker-fields";

const assignmentInfoFormSchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "Assignment name must be at least 5 characters.",
    })
    .max(120, {
      message: "Assignment name must not exceed 120 characters.",
    })
    .nonempty("assigment name is required."),
  archived: z.boolean(),
  variant: z.string().nonempty("Assignment type is required."),
  deadline: z.date({
    required_error: "A date & time is required.",
  }),
  weighting: z.string().refine(
    (value) => {
      const numberValue = Number(value);
      return !isNaN(numberValue) && numberValue >= 0 && numberValue <= 100;
    },
    {
      message: "Percentage must be a valid number between 0 and 100",
    },
  ),
  description: z.string().max(300, {
    message: "Assignment description must not exceed 300 characters.",
  }),
  labels: z
    .array(
      z.object({
        value: z.string().nonempty("Please do not leave an empty label."),
      }),
    )
    .optional(),
});

type AssignmentInfoFormValues = z.infer<typeof assignmentInfoFormSchema>;
type initialAssignmentData = AssignmentInfoFormValues & {
  deadline: string;
};
// This can come from your database or API.
const defaultValues: Partial<AssignmentInfoFormValues> = {
  // bio: "I own a computer.",
  // urls: [
  //   { value: "https://shadcn.com" },
  //   { value: "http://twitter.com/shadcn" },
  // ],
};

export function AssignmentInfoForm({
  initialData,
  assignmentId,
}: {
  initialData: initialAssignmentData;
  assignmentId: string;
}) {
  const router = useRouter();

  const form = useForm<AssignmentInfoFormValues>({
    resolver: zodResolver(assignmentInfoFormSchema),
    defaultValues: {
      ...initialData,
      ...defaultValues,
      deadline: new Date(initialData.deadline),
      weighting: (Number(initialData.weighting) * 100).toString(),
    },
    mode: "onChange",
  });

  // const { fields, append } = useFieldArray({
  //   name: "urls",
  //   control: form.control,
  // });

  async function onSubmit(data: AssignmentInfoFormValues) {
    const { weighting, ...remainder } = data;
    const submittedValues = {
      ...remainder,
      weighting: Number(weighting) / 100,
    };

    toast(
      <div className="w-full">
        <p>You submitted the following values:</p>
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(submittedValues, null, 2)}
          </code>
        </pre>
      </div>,
    );
    const response = await fetch(`/api/assignments/${assignmentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submittedValues),
    });

    if (response.ok) {
      toast.success("Assignment updated successfully");
      form.reset(data);
      router.refresh();
    } else {
      toast.error("Failed to update assignment");
    }
  }

  const year = new Date().getFullYear().toString().slice(-2);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6 sm:flex sm:space-x-2 sm:space-y-0">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignment name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter assignment name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the official name of the assignment. Please adhere to
                  university guidelines.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weighting"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weighting (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter assignment weighting"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please enter a value between 0% and 100%
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-6 sm:flex sm:space-x-2 sm:space-y-0">
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="text-left">Deadline</FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-9 min-w-[280px] justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "eee, dd MMM, yyy  ->  hh:mm a")
                        ) : (
                          <span>Pick a date & time</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                    <div className="border-t border-border p-3">
                      <TimePickerFields
                        setDate={field.onChange}
                        date={field.value}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="variant"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>Assignment Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about the assignment"
                  // className="resize-none"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add a brief description about this assignment.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="archived"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-white p-4 dark:bg-[#09090b]">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Archive Assignment</FormLabel>
                <FormDescription>
                  Receive emails about new products, features, and more.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            Add URL
          </Button>
        </div> */}
        <Button type="submit" disabled={!form.formState.isDirty}>
          Update
        </Button>
      </form>
    </Form>
  );
}
