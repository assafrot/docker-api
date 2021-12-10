import { Request, Response } from 'express';
import { createImage, getImage, getImages, getImagesCombinations, updateImage } from '../service/image.service';
import mongoose from 'mongoose';


export async function getImagesHandler(req: Request, res: Response) {
    try{
        const images = await getImages();
        res.status(200).send({images})
    }catch(e:any){
        return res.status(500).send(e.message);
    }

}

export async function getImageHandler(req: Request, res: Response) {
    const query = {_id: new mongoose.Types.ObjectId(req.params._id)}
    const image = await getImage(query);
    if (image === null) {
        res.sendStatus(404);
    } else {
        res.status(200).send(image)
    }
}

export async function createImageHandler(req: Request, res: Response) {
    try {
        const image = await createImage(req.body);
        return res.status(200).send(image)
    } catch (e: any) {
        return res.status(409).send(e.message);
    }
}

export async function updateImageHandler(req: Request, res: Response) {
    try {
        const query = {_id: new mongoose.Types.ObjectId(req.params._id)}
        const update = req.body;
        const updatedImage = await updateImage(query, update);
        return res.status(200).send(updatedImage)
    } catch (e: any) {
        if (e.messege === 'Image not exists'){
            return res.status(404).send(e.message);
        } else{
            return res.status(500).send(e.message);
        }
    }
}

export async function getImagesCombinationsHandler(req: Request, res: Response) {
    try{
        const images = await getImagesCombinations(+req.params.length);
        res.status(200).send(images);
    }catch(e:any){
        return res.status(500).send(e.message);
    }
}
