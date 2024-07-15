"use client";

import { useState } from "react";
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
import { TimePickerFields } from "@/components/datetime-picker/time-picker-fields";

const deliverableCreationFormSchema = z.object({
  assignment_id: z.string().nonempty("Assignment ID is required."),
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
});

export function DeliverableCreator() {
  const router = useRouter();

  const { ass_id } = useParams();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof deliverableCreationFormSchema>>({
    resolver: zodResolver(deliverableCreationFormSchema),
    defaultValues: {
      assignment_id: Array.isArray(ass_id) ? undefined : ass_id,
      name: "Weekly Lab Exercises",
      weighting: 15,
    },
  });

  function onSubmit(values: z.infer<typeof deliverableCreationFormSchema>) {
    toast(
      <div className="w-full">
        <p>You submitted the following values:</p>
        <pre className="mt-2 w-full overflow-x-auto rounded-md bg-slate-900 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      </div>,
    );

    clientFetch(`/api/deliverables`, "POST", values)
      .then((data) => {
        toast.success("Deliverable created successfully!");
        setOpen(false);
        router.refresh();
      })
      .catch((error) => toast.error(error.message));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex h-[202px] flex-grow cursor-pointer flex-col items-center justify-center space-y-2 rounded-xl border hover:bg-muted">
          <PlusIcon className="h-6 w-6" />
          <p className="text-md text-muted-foreground">New Deliverable</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-6"
          >
            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-[75%]">
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
                  <FormItem className="w-[25%]">
                    <FormLabel>Weighting (%)</FormLabel>
                    <FormControl>
                      <Input placeholder="15%" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                            "h-9 w-[280px] justify-start text-left font-normal",
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
