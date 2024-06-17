"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const courseInfoFormSchema = z.object({
  name: z
    .string()
    .max(120, {
      message: "Course name must not exceed 120 characters.",
    })
    .nonempty("Course name is required."),
  term: z.string({
    required_error: "Please select a term offering.",
  }),
  code: z
    .string()
    .length(8, { message: "Course code must be exactly 8 characters." })
    .refine((code) => /^[A-Z]{4}\d{4}$/.test(code), {
      message:
        "Course code must begin with 4 uppercase letters and end with 4 numbers.",
    }),
  // faculty: z.string({
  //   required_error: "Please select a faculty.",
  // }),
  status: z.string().nonempty("Status is required."),
  instructors: z.string().max(120, {
    message: "Instructors must not exceed 120 characters.",
  }),
  description: z.string().max(200, {
    message: "Course description must not exceed 200 characters.",
  }),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      }),
    )
    .optional(),
});

type CourseInfoFormValues = z.infer<typeof courseInfoFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<CourseInfoFormValues> = {
  // bio: "I own a computer.",
  urls: [
    { value: "https://shadcn.com" },
    { value: "http://twitter.com/shadcn" },
  ],
};

export function CourseInfoForm({
  initialData,
  courseId,
}: {
  initialData: CourseInfoFormValues;
  courseId: string;
}) {
  const router = useRouter();

  const form = useForm<CourseInfoFormValues>({
    resolver: zodResolver(courseInfoFormSchema),
    defaultValues: { ...initialData, ...defaultValues },
    mode: "onChange",
  });

  const { fields, append } = useFieldArray({
    name: "urls",
    control: form.control,
  });

  async function onSubmit(data: CourseInfoFormValues) {
    toast(
      <div className="w-full">
        <p>You submitted the following values:</p>
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>,
    );
    const response = await fetch(`/api/courses/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast.success("Course updated successfully");
      form.reset(data);
      router.refresh();
    } else {
      toast.error("Failed to update course");
    }
  }

  const year = new Date().getFullYear().toString().slice(-2);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course name</FormLabel>
              <FormControl>
                <Input placeholder="Enter course name" {...field} />
              </FormControl>
              <FormDescription>
                This is the official name of the course. Please adhere to
                university guidelines.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-start justify-between gap-x-4">
          <FormField
            control={form.control}
            name="term"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Term Offering</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a term" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={`${year}T0`}>
                      {`${year}T0`} (Summer)
                    </SelectItem>
                    <SelectItem value={`${year}T1`}>{`${year}T1`}</SelectItem>
                    <SelectItem value={`${year}T2`}>{`${year}T2`}</SelectItem>
                    <SelectItem value={`${year}T3`}>{`${year}T3`}</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Please select the term offering for this course.
                </FormDescription>
                <FormMessage className="h-5" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Course Code</FormLabel>
                <FormControl>
                  <Input placeholder="COMP1511" {...field} />
                </FormControl>
                <FormDescription>
                  Course code should follow 'ABCD1234' format.
                </FormDescription>
                <FormMessage className="h-5" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-start justify-between gap-x-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-1/3">
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="stashed">Stashed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="h-5" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instructors"
            render={({ field }) => (
              <FormItem className="w-2/3">
                <FormLabel>Instructors</FormLabel>
                <FormControl>
                  <Input placeholder="Andrew Taylor" {...field} />
                </FormControl>
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
                  placeholder="Tell us a little bit about the course"
                  // className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add a brief description about this course.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
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
        </div>
        <Button type="submit" disabled={!form.formState.isDirty}>
          Update
        </Button>
      </form>
    </Form>
  );
}
