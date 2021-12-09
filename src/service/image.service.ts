import {DocumentDefinition} from 'mongoose'
import { ImageDocument, ImageModel } from '../models/image.model';

export async function CreateImage(input: DocumentDefinition<Omit<ImageDocument, "createdAt" | "updatedAt">>){
    try{
        return await ImageModel.create(input);
    }catch (e: any){
        throw new Error((e))
    }
}
