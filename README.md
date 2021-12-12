# docker-api

## Testing the appliction
The tests located in `./src/tets`.
For running the test please run `npm run test`

## TBD:
### Testing FileSystem R/W (deployment.service.ts)
Need to mock fs or add a test env var with testing machine name in order to be able to test the it.
### Mongo Transcation (deployment.service.ts)
Add transaction mechanisem for rollingback request in case the filesystem writing if failing (including tests).
### Swagger
Add documuntation for all routes.
