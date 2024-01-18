'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';

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
import { ClassCreationSchema } from '@/lib/schemas';
import { fetchClientAPIRequest } from '@/lib/utils';

export function ClassCreationForm() {
  const router = useRouter();
  const { course_id } = useParams();

  const form = useForm<z.infer<typeof ClassCreationSchema>>({
    resolver: zodResolver(ClassCreationSchema),
    defaultValues: {
      name: 'H11A',
      capacity: 25,
      day: 'Mon',
      start_time: '11:00',
      end_time: '13:00',
      location: 'Quadrangle G047',
    },
    mode: 'onChange',
  });
  async function onSubmit(data: z.infer<typeof ClassCreationSchema>) {
    toast(
      <div className="w-full">
        <p>You submitted the following values:</p>
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
    );
    const { name, capacity, day, start_time, end_time, location } = data;

    const res = await fetchClientAPIRequest(
      `/api/v1/tutorials/crs/${course_id}`,
      'POST',
      {
        name,
        capacity,
        day,
        times: `${start_time} - ${end_time}`,
        location,
      }
    );
    if (!res.ok) {
      // Handle error
      console.error('Course creation failed');
      const data = await res.json();
      toast.error(data.message);
      return;
    }
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
        <div className="flex items-start gap-x-4 justify-between">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Name/Code</FormLabel>
                <FormControl>
                  <Input placeholder="H11A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="day"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Day</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Mon">Mon</SelectItem>
                    <SelectItem value="Tue">Tue</SelectItem>
                    <SelectItem value="Wed">Wed</SelectItem>
                    <SelectItem value="Thu">Thu</SelectItem>
                    <SelectItem value="Fri">Fri</SelectItem>
                    <SelectItem value="Sat">Sat</SelectItem>
                    <SelectItem value="Sun">Sun</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="h-5" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-start gap-x-4 justify-start">
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="25" {...field} />
                </FormControl>
                <FormMessage className="h-5" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start time</FormLabel>
                <FormControl>
                  <Input type="time" placeholder="11:00" {...field} />
                </FormControl>
                <FormMessage className="h-5" />
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
                  <Input type="time" placeholder="13:00" {...field} />
                </FormControl>
                <FormMessage className="h-5" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Quadrangle G047" {...field} />
              </FormControl>
              <FormMessage className="h-5" />
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
