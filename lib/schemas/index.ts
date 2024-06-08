import * as z from 'zod';

export const nameSchema = z
  .string()
  .min(1, { message: 'Name is required and must be at least 1 character.' })
  .regex(/^[A-Za-z'-]+$/, {
    message:
      'Name can only contain alphabetical characters, hyphens, and apostrophes.',
  })
  .max(50, { message: 'Name must be less than 50 characters.' });

export const LoginSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Invalid email address.',
    })
    .refine(
      (value) =>
        // /^[\w.-]+@student\.unsw\.edu\.au$/.test(value) ||
        /^z\d{7}@ad\.unsw\.edu\.au$/.test(value),
      {
        message: 'Email must follow: z5555555@ad.unsw.edu.au',
      }
    ),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters.',
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Password must contain at least one uppercase letter.',
    })
    .refine((value) => /\W|_/.test(value), {
      message: 'Password must contain at least one symbol.',
    }),
});

export const RegisterSchema = z
  .object({
    first_name: nameSchema,
    last_name: nameSchema,
    email: z
      .string()
      .email({
        message: 'Invalid email address.',
      })
      .refine(
        (value) =>
          // /^[\w.-]+@student\.unsw\.edu\.au$/.test(value) ||
          /^z\d{7}@ad\.unsw\.edu\.au$/.test(value),
        {
          message: 'Email must follow: z5555555@ad.unsw.edu.au',
        }
      ),
    password: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters.',
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Password must contain at least one uppercase letter.',
      })
      .refine((value) => /\W|_/.test(value), {
        message: 'Password must contain at least one symbol.',
      }),
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  });

export const CourseCreationSchema = z.object({
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

export const courseEnrolmentSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  handle: z.string(),
  image: z.string().nullable(),
  role: z.string().nullable(),
});

export type Participant = z.infer<typeof courseEnrolmentSchema>;

export const ClassFormSchema = z
  .object({
    name: z
      .string()
      .max(50, {
        message: 'Class name must not exceed 50 characters.',
      })
      .nonempty('Class name is required.'),
    location: z
      .string()
      .max(120, {
        message: 'Class location must not exceed 120 characters.',
      })
      .nonempty('Class location is required.'),
    capacity: z.coerce
      .number()
      .int()
      .nonnegative()
      .min(1, { message: 'Capacity must be at least 1.' })
      .max(50, { message: 'Capacity must not exceed 50.' }),
    day: z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
    start_time: z.string().nonempty('Time is required.'),
    end_time: z.string().nonempty('Time is required.'),
  })
  .refine((schema) => schema.end_time.localeCompare(schema.start_time) > 0, {
    message: 'Class cannot end before it starts.',
    path: ['start_time'],
  });

  export const AssessmentSchema = z.object({
    id: z.string(),
    assessment_name: z.string(),
    type: z.string(),
    weighting: z.string(),
    length: z.string().nullable(),
    due_date: z.string(),
  });
  
  export type Assessment = z.infer<typeof AssessmentSchema>;

  export const WeeklyContentSchema = z.object({
    id: z.string(),
    name: z.string(),
    dates: z.string(),
    tasks: z.string(),
    status: z.number(),
  })

  export type WeeklyContent = z.infer<typeof WeeklyContentSchema>
