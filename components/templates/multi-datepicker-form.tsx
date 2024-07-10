"use client";

import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const multipleDatesFormSchema = z.object({
  dates: z.array(z.date()).nonempty("At least one date is required."),
});

export default function TutorialCreator() {
  const form = useForm<z.infer<typeof multipleDatesFormSchema>>({
    resolver: zodResolver(multipleDatesFormSchema),
  });

  function onSubmit(values: z.infer<typeof multipleDatesFormSchema>) {
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
        className="flex flex-col space-y-6"
      >
        <FormField
          control={form.control}
          name="dates"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tutorial dates ({field.value?.length || 0})</FormLabel>
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
                                (date.getFullYear() == new Date().getFullYear()
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
                    onSelect={(selectedDates) => field.onChange(selectedDates)}
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
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
