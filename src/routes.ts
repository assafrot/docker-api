import { Express, Request, Response } from 'express';
import {
    createImageHandler,
    getImageHandler, getImagesCombinationsHandler,
    getImagesHandler,
    updateImageHandler
} from './controller/image.controller';
import validateResource from './middleware/validateResource';
import { createImageSchema } from './schema/image.schema';

function routes(app: Express){
    app.get("/healthcheck", (req: Request, res:Response) => res.sendStatus(200));

    // images endpoint
    app.get('/images', getImagesHandler)
    app.get('/images/combinations/:length', getImagesCombinationsHandler)
    app.get("/images/:_id", getImageHandler)
    app.post("/images", validateResource(createImageSchema), createImageHandler)
    app.put("/images/:_id", validateResource(createImageSchema), updateImageHandler)
}

export default routes
