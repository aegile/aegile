'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { fetchClientAPIRequest } from '@/lib/utils';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { User } from '@/lib/types';

const FormSchema = z.object({
  members: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
});

export default function EnrolParticipantsForm({
  enrollableUsers,
}: {
  enrollableUsers: User[];
}) {
  const router = useRouter();
  const { course_id } = useParams();

  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredUsers = enrollableUsers.filter((user: User) =>
    (
      user.handle.toLowerCase() +
      ' ' +
      user.first_name.toLowerCase() +
      ' ' +
      user.last_name.toLowerCase()
    ).includes(searchTerm.toLowerCase())
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      members: [],
    },
    mode: 'onSubmit',
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast(
      <div className="w-full">
        <p>You submitted the following values:</p>
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
    );
    const res = await fetchClientAPIRequest(
      `/api/v1/courses/${course_id}/enroll`,
      'POST',
      data
    );
    if (!res.ok) {
      const data = await res.json();
      toast.error(data.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="overflow-auto space-y-4">
      <Input
        type="search"
        placeholder="Search users"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="members"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Available Users</FormLabel>
                  <FormDescription>
                    Select the users you want to enrol to the course.
                  </FormDescription>
                </div>
                {!filteredUsers.length && (
                  <div className="flex items-center justify-center">
                    <p className="text-sm text-gray-400">No users found...</p>
                  </div>
                )}
                {filteredUsers.map((user) => (
                  <FormField
                    key={user.id}
                    control={form.control}
                    name="members"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={user.id}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(user.handle)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      user.handle,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== user.handle
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <Avatar>
                            <AvatarImage src={user?.image} alt="@shadcn" />
                            <AvatarFallback>
                              {user.first_name.charAt(0)}{' '}
                              {user.last_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {/* <FormLabel className="text-sm font-normal"> */}
                          <p className="leading-7 mx-3 whitespace-nowrap overflow-hidden text-ellipsis">
                            z5555555 - {user.first_name} {user.last_name}
                          </p>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="submit" disabled={!form.formState.isValid}>
                Enrol
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
