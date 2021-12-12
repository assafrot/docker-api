import supertest from 'supertest';
import { createServer } from '../utils/server';
import { signJwt } from '../utils/jwt.utils';
import { ImageService } from '../service/image.service';
import { imageInput } from './image.input';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DeploymentService } from '../service/deployment.service';

const app = createServer()
const jwt = signJwt('fake-auth')

const imageService = new ImageService
const deploymentService = new DeploymentService

describe("deployment", () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });
    beforeEach(async()=>{
        const collections = mongoose.connection.collections;
        for (const key in collections){
            const collection = collections[key]
            // @ts-ignore
            await collection.deleteMany();
        }
    });

    describe('create deployment', () => {
        describe('when payload is invalid',()=>{
            describe('when image id param is missing', () => {
                it('should return 400', async ()=> {
                    const invalidDeploymentInput = {
                        image: "give-me-id"
                    }
                    const { statusCode, body } = await supertest(app).post('/deployment').set("Authorization", `Bearer ${jwt}`).send(invalidDeploymentInput)
                    expect(statusCode).toBe(400);
                    // @ts-ignore
                    let errorsMessages = body.map(er => er.message)
                    expect(errorsMessages.sort()).toEqual(['imageId is required'].sort())
                });
            });
            describe('when image id is not valid',()=>{
                it('should return 500', async ()=> {
                    const invalidDeploymentInput = {
                        imageId: "not a mongo id"
                    }
                    const { statusCode } = await supertest(app).post('/deployment').set("Authorization", `Bearer ${jwt}`).send(invalidDeploymentInput)
                    expect(statusCode).toBe(500);
                });
            })
        });

        describe('when payload is valid',()=>{
            describe('when image id is not exist',()=>{
                it('should return 500',  async() => {
                    const DeploymentInput = {
                        imageId: new mongoose.Types.ObjectId().toString()
                    }
                    const { statusCode, body } = await supertest(app).post('/deployment').set("Authorization", `Bearer ${jwt}`).send(DeploymentInput);
                    expect(statusCode).toBe(500);
                });
            })
            describe('when image id exists',()=>{
                it('should create new deployment', async ()=> {
                    const image = await imageService.createImage(imageInput);
                    const DeploymentInput = {
                        imageId: image._id
                    }
                    const { statusCode, body } = await supertest(app).post('/deployment').set("Authorization", `Bearer ${jwt}`).send(DeploymentInput);
                    expect(statusCode).toBe(200);
                    expect(body).toEqual({
                        __v: 0,
                        _id: expect.any(String),
                        imageId: DeploymentInput.imageId.toString(),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    });
                });
            })
        })
    });
    
    describe('get deployments',()=>{
        describe('when no deployment available',()=>{
            it('should return 200 with no empty list', async ()=> {
                const { statusCode, body } = await supertest(app).get('/deployment').set("Authorization", `Bearer ${jwt}`);
                expect(statusCode).toBe(200);
                expect(body.deployments).toEqual([]);
            });
        })
        describe('when deployments available',()=>{
            it('should return 200 with list of deployments', async ()=> {
                const image = await imageService.createImage(imageInput);
                const DeploymentInput = {
                    imageId: image._id
                }
                let deployNumber = Math.floor(Math.random() * 3) + 1
                for (let i = 0; i < deployNumber; i++) {
                    await deploymentService.createDeployment(DeploymentInput)
                }
                const { statusCode, body } = await supertest(app).get('/deployment').set("Authorization", `Bearer ${jwt}`);
                expect(statusCode).toBe(200);
                expect(body.deployments.length).toBe(deployNumber);
            });
        })
    })
});
