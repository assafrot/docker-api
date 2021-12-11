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
    app.get("/healthcheck", (req: Request, res:Response) => res.sendStatus(200));

    //jwt
    app.post('/auth', getTokenHandler)

    // images endpoints
    app.get('/images', authCheck,getImagesHandler)
    app.get('/images/combinations/:length',authCheck, getImagesCombinationsHandler)
    app.get("/images/:_id", authCheck, getImageHandler)
    app.post("/images", authCheck, validateResource(createImageSchema), createImageHandler)
    app.put("/images/:_id", authCheck, validateResource(createImageSchema), updateImageHandler)

    //deployment endpoints
    app.post("/deployment", validateResource(createDeploymentSchema), createDeploymentHandler)
    app.get("/deployment", getAllDeploymentsHandler)
    app.get("/deployment/count", getCountHandler)
}

export default routes
