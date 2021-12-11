import { object, string } from 'zod';

export const createImageSchema = object({
    /**
     * @openapi
     * components:
     *  schemas:
     *    CreateImageRequest:
     *      type: object
     *      required:
     *        - name
     *        - repository
     *        - version
     *      properties:
     *        name:
     *          type: string
     *          default: image123
     *        repository:
     *          type: string
     *          default: my-repository
     *        version:
     *          type: string
     *          default: 1.1.0
     *        metadata:
     *          type: object
     *          default: {}
     *    CreateImageResponse:
     *      type: object
     *      properties:
     *        name:
     *          type: string
     *        repository:
     *          type: string
     *        version:
     *          type: string
     *        _id:
     *          type: string
     *        createdAt:
     *          type: string
     *        updatedAt:
     *          type: string
     */

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
