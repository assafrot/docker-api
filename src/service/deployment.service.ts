import { DocumentDefinition } from 'mongoose';
import { DeploymentDocument, DeploymentModel } from '../models/deployment.model';
import * as fs from 'fs';
import { ImageService } from './image.service';
import config from 'config';
import { parseInt } from 'lodash';

export class DeploymentService {
    imageService: ImageService
    dbSuccess: boolean
    fileSuccess: boolean

    constructor() {
        this.imageService = new ImageService()
        this.dbSuccess = false;
        this.fileSuccess = false;
    }

    async createDeployment(input: DocumentDefinition<Omit<DeploymentDocument, "createdAt" | "updatedAt">>) {
        try {
            let image = await this.imageService.getImageById(input.imageId)
            if (!image) {
                throw new Error("Cant create deployment. Image is not exists")
            }
            let deploy = await DeploymentModel.create(input);
            if (deploy) { this.dbSuccess = true };
            await this.writeCount();
            return deploy
        } catch (e: any) {
            if (this.fileSuccess && !this.dbSuccess) {
                //rollback file
                throw new Error('transaction failed creation rolled back')
            } else if (this.dbSuccess && !this.fileSuccess) {
                //rollback db
                throw new Error('transaction failed creation rolled back')
            } else if (e['code'] === 11000) {
                throw new Error("Deployment Already Exists")
            } else {
                throw new Error(e.message)
            }
        }
    }

    private async writeCount() {
        let count = 0;
        let machineId: string = config.get<string>("machineId") || '';
        await fs.readFile('./count.txt', 'utf8', (error, data) => {
            const lines = data.split(/\r?\n/);
            lines.forEach((line) => {
                if (line.startsWith(machineId)) {
                    let splits = line.split(' ')
                    count = +splits[1]
                }
            });
            let newCountData: string
            if (count > 0) {
                newCountData = data.replace(`${machineId} ${count}`, `${machineId} ${count + 1}`)
            } else {
                newCountData = `${machineId} ${count}`
            }

            fs.writeFile('./count.txt', newCountData, 'utf-8', (e) => {
                if (e) {
                    throw new Error(e.message)
                } else {
                    this.fileSuccess = true
                }
            })
        })
    }

    async getDeployments(limit = 2, skip = 0) {
        try {
            return await DeploymentModel.find()
                .sort({ createdAt: 'desc' })
                .limit(limit)
                .skip(skip);
            ;
        } catch (e: any) {
            throw new Error((e))
        }
    }

    getCount() {
        try {
            let count = 0
            let data =  fs.readFileSync('./count.txt', 'utf8')
                const lines = data.split(/\r?\n/);
                lines.splice(lines.length-1,1)
                lines.forEach((line) => {
                    let splits = line.split(' ')
                    let addition = parseInt(splits[1])
                    count += addition
                })
            return count
        } catch (e: any) {
            throw new Error((e))
        }
    }
}



