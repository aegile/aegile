"use client";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { clientFetch, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";

const deliverableSubmissionsFormSchema = z.object({
  is_group_submission: z.boolean().default(false),
  requires_group_confirmation: z.boolean().default(false),
  allow_resubmissions: z.boolean().default(true),
});

type DeliverableSubmissionsFormValues = z.infer<
  typeof deliverableSubmissionsFormSchema
>;

export function DeliverableSubmissionsForm(
  {
    // initialData,
  }: {
    // initialData: DeliverableSubmissionsFormValues;
  },
) {
  const router = useRouter();

  const { del_id } = useParams();

  const form = useForm<z.infer<typeof deliverableSubmissionsFormSchema>>({
    resolver: zodResolver(deliverableSubmissionsFormSchema),
    // defaultValues: initialData,
    mode: "onChange",
  });

  const isGroupSubmission = form.watch("is_group_submission");

  function onSubmit(values: z.infer<typeof deliverableSubmissionsFormSchema>) {
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
        <div className="text-red-500">
          TODO: query assignment type to set the below values
        </div>
        <FormField
          control={form.control}
          name="is_group_submission"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Group submission</FormLabel>
                <FormDescription>
                  Only one group member needs to submit.
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
        <FormField
          control={form.control}
          name="requires_group_confirmation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel
                  className={cn(
                    "text-base",
                    !isGroupSubmission && "text-muted-foreground/30",
                  )}
                >
                  Require group confirmation
                </FormLabel>
                <FormDescription
                  className={cn(
                    !isGroupSubmission && "text-muted-foreground/30",
                  )}
                >
                  All group members must agree to the submission.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={isGroupSubmission ? field.value : false}
                  onCheckedChange={field.onChange}
                  disabled={!isGroupSubmission}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="allow_resubmissions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Allow resubmissions</FormLabel>
                <FormDescription>
                  Allow students to resubmit their work.
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
        <Button type="submit" disabled={!form.formState.isDirty}>
          Update
        </Button>
      </form>
    </Form>
  );
}
