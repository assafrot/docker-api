import { Request, Response } from 'express';
import { DeploymentService } from '../service/deployment.service';

const deploymentService = new DeploymentService

export async function createDeploymentHandler(req: Request, res: Response) {
    try {
        const deployment = await deploymentService.createDeployment(req.body);
        return res.status(200).send(deployment)
    } catch (e: any) {
        if (e.message === 'Deployment Already Exists') {
            return res.status(409).send(e.message);
        } else {
            return res.status(500).send(e.message);
        }
    }
}

export async function getAllDeploymentsHandler(req: Request, res: Response) {
    try {
        let parsedLimit = req.query.limit ? +req.query.limit : undefined;
        let parsedSkip = req.query.skip ? +req.query.skip : undefined;
        const deployments = await deploymentService.getDeployments(parsedLimit, parsedSkip);
        res.status(200).send({deployments})
    } catch (e: any) {
        return res.status(500).send(e.message);
    }
}

export async function getCountHandler(req: Request, res: Response) {
    try {
        const count = deploymentService.getCount();
        res.status(200).send({count})
    } catch (e: any) {
        return res.status(500).send(e.message);
    }
}
