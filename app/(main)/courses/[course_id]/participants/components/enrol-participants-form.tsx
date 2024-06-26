"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

export default function EnrolParticipantsForm({
  enrollableUsers,
}: {
  enrollableUsers: User[];
}) {
  const router = useRouter();
  const { course_id } = useParams();

  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredUsers = enrollableUsers.filter((user: User) => {
    return (
      user.first_name.toLowerCase().includes(searchTerm) ||
      user.last_name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  });

  async function enrolUser(userId: string) {
    const response = await fetch(
      `/api/courses/${course_id}/enrolments/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (response.ok) {
      toast.success("User enrolled successfully!");
    } else {
      toast.error("Failed to enrol user.");
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <div className="">
        {!filteredUsers.length && (
          <div className="flex items-center justify-center">
            <p className="text-sm text-gray-400">No users found...</p>
          </div>
        )}
        {filteredUsers.map((user) => (
          <div className="flex items-center space-y-0 rounded-md p-2 hover:bg-muted/60">
            <Avatar className="border">
              <AvatarImage src={user?.image} alt="@shadcn" />
              <AvatarFallback>
                {user.first_name.charAt(0)}
                {user.last_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="mx-3 line-clamp-1 text-sm">
              {user.first_name} {user.last_name} - {user.email}
            </p>
            <Button
              variant="outline"
              className="ml-auto"
              onClick={() => enrolUser(user.id)}
            >
              Add
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// const FormSchema = z.object({
//   members: z.array(z.string()).refine((value) => value.some((item) => item), {
//     message: "You have to select at least one item.",
//   }),
// });

// export default function EnrolParticipantsForm({
//   enrollableUsers,
// }: {
//   enrollableUsers: User[];
// }) {
//   const router = useRouter();
//   const { course_id } = useParams();
//   const [searchTerm, setSearchTerm] = React.useState("");
//   const filteredUsers = enrollableUsers.filter((user: User) =>
//     (
//       user.handle.toLowerCase() +
//       " " +
//       user.first_name.toLowerCase() +
//       " " +
//       user.last_name.toLowerCase()
//     ).includes(searchTerm.toLowerCase()),
//   );

//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       members: [],
//     },
//     mode: "onSubmit",
//   });

//   async function onSubmit(data: z.infer<typeof FormSchema>) {
//     toast(
//       <div className="w-full">
//         <p>You submitted the following values:</p>
//         <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       </div>,
//     );
//     // const res = await fetchClientAPIRequest(
//     //   `/api/v1/courses/${course_id}/enroll`,
//     //   'POST',
//     //   data
//     // );
//     // if (!res.ok) {
//     //   const data = await res.json();
//     //   toast.error(data.message);
//     //   return;
//     // }
//     router.refresh();
//   }

//   return (
//     <div className="space-y-4">
//       <Input
//         type="search"
//         placeholder="Search users..."
//         value={searchTerm}
//         onChange={(event) => setSearchTerm(event.target.value)}
//       />
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           <FormField
//             control={form.control}
//             name="members"
//             render={() => (
//               <FormItem>
//                 <div className="mb-4">
//                   <FormLabel className="text-base">Available Users</FormLabel>
//                   <FormDescription>
//                     Select the users you want to enrol to the course.
//                   </FormDescription>
//                 </div>
//                 {!filteredUsers.length && (
//                   <div className="flex items-center justify-center">
//                     <p className="text-sm text-gray-400">No users found...</p>
//                   </div>
//                 )}
//                 {filteredUsers.map((user) => (
//                   <FormField
//                     key={user.id}
//                     control={form.control}
//                     name="members"
//                     render={({ field }) => {
//                       return (
//                         <FormItem
//                           key={user.id}
//                           className="flex items-center space-y-0"
//                         >
//                           <FormControl>
//                             <Checkbox
//                               checked={field.value?.includes(user.handle)}
//                               onCheckedChange={(checked) => {
//                                 return checked
//                                   ? field.onChange([
//                                       ...field.value,
//                                       user.handle,
//                                     ])
//                                   : field.onChange(
//                                       field.value?.filter(
//                                         (value) => value !== user.handle,
//                                       ),
//                                     );
//                               }}
//                             />
//                           </FormControl>
//                           <Avatar>
//                             <AvatarImage src={user?.image} alt="@shadcn" />
//                             <AvatarFallback>
//                               {user.first_name.charAt(0)}
//                               {user.last_name.charAt(0)}
//                             </AvatarFallback>
//                           </Avatar>
//                           {/* <FormLabel className="text-sm font-normal"> */}
//                           <p className="mx-3 overflow-hidden text-ellipsis whitespace-nowrap leading-7">
//                             z5555555 - {user.first_name} {user.last_name}
//                           </p>
//                           <Button variant="outline" className="ml-auto">
//                             Add
//                           </Button>
//                         </FormItem>
//                       );
//                     }}
//                   />
//                 ))}
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <DialogFooter className="sm:justify-start">
//             <DialogClose asChild>
//               <Button type="submit" disabled={!form.formState.isValid}>
//                 Enrol
//               </Button>
//             </DialogClose>
//           </DialogFooter>
//         </form>
//       </Form>
//     </div>
//   );
// }
