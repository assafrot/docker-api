import mongoose, { DocumentDefinition } from 'mongoose';
import { DeploymentDocument, DeploymentModel } from '../models/deployment.model';
import * as fs from 'fs';
import { ImageService } from './image.service';

export class DeploymentService {
    imageService: ImageService

    constructor() {
        this.imageService = new ImageService()
    }

    async createDeployment(input: DocumentDefinition<Omit<DeploymentDocument, "createdAt" | "updatedAt">>) {
        try {
            let image = await this.imageService.getImageById(input.imageId)
            if (!image) {
                throw new Error("Cant create deployment. Image is not exists")
            }

                let deploy = await DeploymentModel.create(input);
                await this.writeCount();
                return deploy
        } catch (e: any) {
            if (e['code'] === 11000) {
                throw new Error("Deployment Already Exists")
            } else {
                throw new Error(e.message)
            }
        }
    }

    private async writeCount() {
        const lockfile = require('proper-lockfile');

        lockfile.lock('./count.txt')
            .then((release: any) => {
                let count = +fs.readFileSync('./count.txt', 'utf-8')
                count++
                fs.writeFileSync('./count.txt', count.toString(), 'utf-8')
                return release();
            })
            .catch((e: any) => {
                throw new Error(e.message)
            });
    }

    async getDeployments(limit = 2, skip = 0) {
        try {
            return await DeploymentModel.find()
                .sort({
                    createdAt: 'desc'
                })
                .limit(limit)
                .skip(skip);
            ;
        } catch (e: any) {
            throw new Error((e))
        }
    }

    getCount() {
        try {
            return +fs.readFileSync('./count.txt', 'utf-8').toString();
        } catch (e: any) {
            throw new Error((e))
        }
    }
}



