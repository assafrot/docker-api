import { object, string } from 'zod';

export const createDeploymentSchema = object({
    body: object({
        imageId: string({
            required_error: "imageId is required",
        })
    }),
});
