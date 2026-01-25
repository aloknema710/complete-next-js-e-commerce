import { z } from 'zod'

export const zSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email address" }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long"})
        .max(64, { message: "Password must be at most 64 characters long"})
        .regex(/[A-Z]/,{message: "Password must contain at least one uppercase letter"})
        .regex(/[a-z]/,{message: "Password must contain at least one lowercase letter"})
        .regex(/[0-9]/,{message: "Password must contain at least one number"})
        .regex(/[^A-Za-z0-9]/,{message: "Password must contain at least one special character"}),

    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(64, { message: "Name must be at most 64 characters long" }),
        // .regex(/^[a-zA-Z\s]+$/, { message: "Name must contain only letters and spaces" }),
    otp: z
        .string().regex(/^\d{6}$/, {
            message:"Otp must be a 6 digit number",
        }),
    _id: z.string().min(3, '_id is required'),
    alt: z.string().min(3, 'alt is required'),
    title: z.string().min(3, 'title is required'),
    slug: z.string().min(3, 'Slug is required.'),
    category: z.string().min(3, 'Category is required.'),
    mrp: z.union([
        z.number().positive('Expected positive value, recieved negative'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val>=0, 'Please enter a valid number')
    ]),
    sellingPrice: z.union([
        z.number().positive('Expected positive value, recieved negative'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val>=0, 'Please enter a valid number')
    ]),
    discountPercentage: z.union([
        z.number().positive('Expected positive value, recieved negative'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val>=0, 'Please enter a valid number')
    ]),
    description: z.string().min(3, 'Description is required.'),
    media: z.array(z.string()),
    product: z.string().min(3, 'Product is required.'),
    sku: z.string().min(3, 'SKU is required.'),
    color: z.string().min(3, 'Color is required.'),
    size: z.string().min(1, 'Size is required.'),
    code: z.string().min(3, 'Code is required.'),
    minShoppingAmount: z.union([
        z.number().positive('Expected positive value, recieved negative'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val>=0, 'Please enter a valid number')
    ]),
    validity: z.coerce.date(),
    userId: z.string().min(3, 'UserId is required.'),
    rating: z.union([
        z.number().positive('Expected positive value, recieved negative'),
        z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val>=0, 'Please enter a valid number')
    ]),
    review: z.string().min(3, 'Review is required.'),
})