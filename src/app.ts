import config from 'config';
import express  from 'express';
import connect  from './utils/connect';
import routes from './routes';

const port = config.get<number>('port');

const app=express()

app.use(express.json())

app.listen(port, async () =>{
    console.log(`app is listening on ${port}`);

    await connect();

    routes(app);
})
