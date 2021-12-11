import { DocumentDefinition } from 'mongoose';
import { DeploymentDocument, DeploymentModel } from '../models/deployment.model';
import * as fs from 'fs';
import { ImageService } from './image.service';

export class DeploymentService{
    imageService: ImageService
    constructor() {
        this.imageService= new ImageService()
    }

    async createDeployment(input: DocumentDefinition<Omit<DeploymentDocument, "createdAt" | "updatedAt">>) {
        try {
            let image = await this.imageService.getImageById(input.imageId)
            if (!image) {
                throw new Error("Cant create deployment. Image is not exists")
            }
            //should wrap with transaction
            const deploy = await DeploymentModel.create(input);
            let count = +fs.readFileSync('./count.txt', 'utf-8')
            count++
            fs.writeFileSync('./count.txt', count.toString(), 'utf-8')
            return deploy
            //
        } catch (e: any) {
            if (e['code'] === 11000) {
                throw new Error("Deployment Already Exists")
            } else {
                throw new Error(e.message)
            }
        }
    }

    async getDeployments(){
        try{
            return await DeploymentModel.find();
        }catch (e: any){
            throw new Error((e))
        }
    }

    getCount(){
        try{
            return +fs.readFileSync('./count.txt', 'utf-8').toString();
        }catch (e: any){
            throw new Error((e))
        }
    }
}



