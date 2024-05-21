"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { CourseCreationSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function CourseCreationForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof CourseCreationSchema>>({
    resolver: zodResolver(CourseCreationSchema),
    defaultValues: {
      term: "24T0",
      code: "COMP1511",
      name: "Programming Fundamentals",
      status: "active",
      instructors: "Marc Chee",
      description: "An introduction to programming in C.",
    },
    mode: "onChange",
  });
  async function onSubmit(data: z.infer<typeof CourseCreationSchema>) {
    toast(
      <div className="w-full">
        <p>You submitted the following values:</p>
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>,
    );
    const url = "/api/courses"; // replace with your API endpoint
    // const data = { /* your data object */ };

    fetch(url, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
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
  const year = new Date().getFullYear().toString().slice(-2);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
        <div className="flex items-start gap-x-4 justify-between">
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
                    <SelectItem value={`${year}T0`}>{`${year}T0`}</SelectItem>
                    <SelectItem value={`${year}T1`}>{`${year}T1`}</SelectItem>
                    <SelectItem value={`${year}T2`}>{`${year}T2`}</SelectItem>
                    <SelectItem value={`${year}T3`}>{`${year}T3`}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="h-5" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Code</FormLabel>
                <FormControl>
                  <Input placeholder="COMP1511" {...field} />
                </FormControl>
                <FormMessage className="h-5" />
              </FormItem>
            )}
          />
        </div>
        {/* <FormField
          control={form.control}
          name="faculty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Faculty</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a faculty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Business">Business School</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <div className="flex items-start gap-x-4 justify-between">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-1/2">
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
                    <SelectItem value="archived">Archived</SelectItem>
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
              <FormItem>
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Name</FormLabel>
              <FormControl>
                <Input placeholder="Programming Fundamentals" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about the course"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="submit" disabled={!form.formState.isValid}>
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
}
