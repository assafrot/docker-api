import { object, string } from 'zod';

export const createImageSchema = object({
    body: object({
        name: string({
            required_error: "Name is required",
        }),
        repository: string({
            required_error: "Repository is required",
        }),
        version: string({
            required_error: "Version is required",
        }),
        metadata: object({
        }).optional(),
    }),
});
