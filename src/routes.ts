import { Express, Request, Response } from 'express';
import { createImageHandler, getImageHandler, getImagesHandler } from './controller/image.controller';
import validateResource from './middleware/validateResource';
import { createImageSchema } from './schema/image.schema';

function routes(app: Express){
    app.get("/healthcheck", (req: Request, res:Response) => res.sendStatus(200));

    app.get('/images', getImagesHandler)
    app.get("/images/:_id", getImageHandler)
    app.post("/images", validateResource(createImageSchema), createImageHandler)
}

export default routes
