import { Express, Request, Response } from 'express';
import {
    createImageHandler,
    getImageHandler, getImagesCombinationsHandler,
    getImagesHandler,
    updateImageHandler
} from './controller/image.controller';
import validateResource from './middleware/validateResource';
import { createImageSchema } from './schema/image.schema';
import { getTokenHandler } from './controller/auth.controller';
import { authCheck } from './middleware/authCheck';
import { createDeploymentHandler, getAllDeploymentsHandler, getCountHandler } from './controller/deployment.controller';
import { createDeploymentSchema } from './schema/deployment.schema';


function routes(app: Express){
    /**
     * @openapi
     * '/healthcheck':
     *  get:
     *      tag:
     *      -Healthcheck
     *      responses:
     *          200:
     *              description: App is live
     */
    app.get("/healthcheck", (req: Request, res:Response) => res.sendStatus(200));

    //jwt
    app.post('/auth', getTokenHandler)

    // images endpoints
    app.get('/images', authCheck,getImagesHandler)
    app.get('/images/combinations/:length',authCheck, getImagesCombinationsHandler)
    /**
     * @openapi
     * '/images/{_id}':
     *  get:
     *     tags:
     *     - Images
     *     summary: Get a single image by image id
     *     parameters:
     *      - name: _id
     *        in: path
     *        description: The id of the image
     *        required: true
     *        default: 61af8fdca54de0f48aea3352
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *          application/json:
     *           schema:
     *              $ref: '#/components/schemas/CreateImageResponse'
     *       404:
     *         description: Image not found
     */
    app.get("/images/:_id", authCheck, getImageHandler)
    /**
     * @openapi
     * '/images':
     *  post:
     *     tags:
     *     - Images
     *     summary: Create an Image
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *              $ref: '#/components/schemas/CreateImageRequest'
     *     responses:
     *      200:
     *        description: Success
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/CreateImageResponse'
     *      409:
     *        description: Conflict
     *      400:
     *        description: Bad request
     */
    app.post("/images", authCheck, validateResource(createImageSchema), createImageHandler)
    /**
     * @openapi
     * '/images/{_id}':
     *  put:
     *     tags:
     *     - Images
     *     summary: Update a single image
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *              $ref: '#/components/schemas/CreateImageRequest'
     *     parameters:
     *      - name: _id
     *        in: path
     *        description: The id of the image
     *        required: true
     *        default: 61af8fdca54de0f48aea3352
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *          application/json:
     *           schema:
     *              $ref: '#/components/schemas/CreateImageResponse'
     *       404:
     *         description: Image not found
     */
    app.put("/images/:_id", authCheck, validateResource(createImageSchema), updateImageHandler)

    //deployment endpoints
    app.post("/deployment", validateResource(createDeploymentSchema), createDeploymentHandler)
    app.get("/deployment", getAllDeploymentsHandler)
    app.get("/deployment/count", getCountHandler)
}

export default routes
