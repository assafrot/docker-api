import config from 'config';
import connect  from './utils/connect';
import { createServer } from './utils/server';

const port = config.get<number>('port');

const app = createServer();

app.listen(port, async () =>{
    console.log(`app is listening on ${port}`);

    await connect();
})
