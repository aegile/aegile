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
