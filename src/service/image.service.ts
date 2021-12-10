import { DocumentDefinition } from 'mongoose'
import { ImageDocument, ImageModel } from '../models/image.model';
import { combination } from '../utils/combinations';
import flatifyObject from 'flatify-obj';

export async function createImage(input: DocumentDefinition<Omit<ImageDocument, "createdAt" | "updatedAt">>){
    try{
        return await ImageModel.create(input);
    }catch (e: any){
        if (e['code'] === 11000){
            throw new Error("Image Already Exists")
        }
        else{
            throw new Error(e.message)
        }
    }
}

export async function updateImage(query: object,update: ImageDocument) {
    try{
        let nestedUpdate = flatifyObject(update)

        let updatedImage = await ImageModel.findOneAndUpdate(query, nestedUpdate,  {
            new: true,
            overwriteDiscriminatorKey: true
        });
        if (!updatedImage){
            throw new Error("Image not exists")
        }
        return updatedImage
    } catch(e: any){
        throw new Error((e))
    }
}

export async function getImage(query: object){
    try{
        return await ImageModel.findOne(query);
    }catch (e: any){
        throw new Error((e))
    }
}

export async function getImages(){
    try{
        return await ImageModel.find();
    }catch (e: any){
        throw new Error((e))
    }
}

export async function getImagesCombinations(length: number){
    try{
        const images = await ImageModel.find();
        const combinations = combination<ImageDocument>(images, length)
        return combinations
    }catch (e: any){
        throw new Error((e))
    }
}
