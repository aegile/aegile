'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchClientAPIRequest } from '@/lib/utils';

const formSchema = z.object({
  term: z.string({
    required_error: 'Please select a term offering.',
  }),
  code: z
    .string()
    .length(8, { message: 'Course code must be exactly 8 characters.' })
    .refine((code) => /^[A-Za-z]{4}\d{4}$/.test(code), {
      message: 'Course code must begin with 4 letters and end with 4 numbers.',
    }),
  name: z
    .string()
    .max(120, {
      message: 'Course name must not exceed 120 characters.',
    })
    .nonempty('Course name is required.'),
  // faculty: z.string({
  //   required_error: 'Please select a faculty.',
  // }),
  description: z
    .string()
    .max(200, {
      message: 'Course description must not exceed 200 characters.',
    })
    .nonempty('Course description is required.'),
});

export function CourseCreationForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // term: '',
      // code: '',
      // name: '',
      // description: '',
    },
    mode: 'onChange',
  });
  async function onSubmit(data: z.infer<typeof formSchema>) {
    toast(
      <div className="w-full">
        <p>You submitted the following values:</p>
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
    );

    const res = await fetchClientAPIRequest('/api/v1/courses', 'POST', {
      ...data,
    });
    if (!res.ok) {
      // Handle error
      console.error('Course creation failed');
      const data = await res.json();
      toast.error(data.message);
      return;
    }
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
