"use client";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { clientFetch, cn } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
import { TimePickerFields } from "@/components/datetime-picker/time-picker-fields";

const deliverableEditFormSchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "Deliverable name must be at least 5 characters.",
    })
    .nonempty("Deliverable name is required."),
  weighting: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().nonnegative().max(100, "Cannot exceed 100%"),
  ),
  deadline: z.date({
    required_error: "A date & time is required.",
  }),
  cutoff: z.date({
    required_error: "A date & time is required.",
  }),
  description: z.string().max(300, {
    message: "Assignment description must not exceed 300 characters.",
  }),
});

type DeliverableEditFormValues = z.infer<typeof deliverableEditFormSchema>;

export function DeliverableEditForm({
  initialData,
}: {
  initialData: DeliverableEditFormValues;
}) {
  const router = useRouter();

  const { del_id } = useParams();

  const form = useForm<z.infer<typeof deliverableEditFormSchema>>({
    resolver: zodResolver(deliverableEditFormSchema),
    defaultValues: { ...initialData, deadline: new Date(initialData.deadline) },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof deliverableEditFormSchema>) {
    toast(
      <div className="w-full">
        <p>You submitted the following values:</p>
        <pre className="mt-2 w-full overflow-x-auto rounded-md bg-slate-900 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      </div>,
    );

    clientFetch(`/api/deliverables/${del_id}`, "PUT", values)
      .then(() => {
        toast.success("Deliverable edited successfully!");
        form.reset(values);
        router.refresh();
      })
      .catch((error) => toast.error(error.message));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Deliverable Name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
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
                  <Input placeholder="15%" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-left">Deadline</FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-9 justify-start text-left font-normal",
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
                <FormDescription>
                  Late submissions allowed, marked as late.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cutoff"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-left">Cut-off Datetime</FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-9 justify-start text-left font-normal",
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
                <FormDescription>
                  No submissions after date without extension.
                </FormDescription>
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
                  placeholder="Give a brief summary of the deliverable"
                  // className="resize-none"
                  rows={4}
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
        <Button type="submit" disabled={!form.formState.isDirty}>
          Update
        </Button>
      </form>
    </Form>
  );
}
