import mongoose from "mongoose";
import { ImageDocument } from './image.model';


export interface DeploymentDocument extends mongoose.Document {
    imageId: ImageDocument["_id"];
    createdAt: Date;
    updatedAt: Date;
}

const DeploymentSchema = new mongoose.Schema(
    {
        imageId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Image" }
    },
    {
        timestamps: true,
    }
);

export const DeploymentModel = mongoose.model("Deployment", DeploymentSchema);
