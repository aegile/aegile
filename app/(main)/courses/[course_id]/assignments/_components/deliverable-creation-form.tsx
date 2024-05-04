"use client";
import { PlusIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipTrigger } from "@/components/ui/tooltip";

import Editor from "@/components/editor";
// {
//   "assignment_id": "string",
//   "name": "Milestone 1",
//   "description": "UML diagrams + model and API tests using pytest",
//   "deadline": "2024-05-09T12:38:16.634778"
// }

const deliverableCreationFormSchema = z.object({
  assignment_id: z.string().nonempty("Assignment ID is required."),
  name: z
    .string()
    .min(5, {
      message: "Deliverable name must be at least 5 characters.",
    })
    .nonempty("Deliverable name is required."),
  type: z.string().nonempty("Deliverable type is required."),
  description: z.string(),
  deadline: z.string(),
});

export function DeliverableCreationForm({
  assignmentId,
}: {
  assignmentId: string;
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof deliverableCreationFormSchema>>({
    resolver: zodResolver(deliverableCreationFormSchema),
    defaultValues: {
      assignment_id: assignmentId,
      name: "Weekly Lab Exercises",
      description: "",
      type: "",
      deadline: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof deliverableCreationFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    toast(
      <div className="w-full">
        <p>You submitted the following values:</p>
        <pre className="mt-2 w-full overflow-x-auto rounded-md bg-slate-900 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      </div>,
    );
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
              <FormLabel>Deliverable Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              {/* <FormDescription>
                Deliverable name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="justify-between sm:flex sm:space-x-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deliverable Type</FormLabel>
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
                  </SelectContent>
                </Select>
                <FormDescription>
                  Individual or group submission?{" "}
                  {/* <Link href="/examples/forms">email settings</Link>. */}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={"2024-05-04T15:28"}
                    type="datetime-local"
                    {...field}
                  />
                </FormControl>
                <FormDescription>When is this due?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Editor />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button type="submit" className="ml-auto mt-2">
          Submit
        </Button>
      </form>
    </Form>
  );
}
