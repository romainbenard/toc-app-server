# TOC App | Server

A Express app which handle the routing of the app like user, ocd CRUD and authentication
Working with Postgresql and Prisma ORM

#### Routes

- `/auth`
- `/users`
- `/ocds`

#### Tests

Tests require a local Database for testing, so you need to create a `.env.test` with a `DATABASE_URL` containing the Database used for test.

3 commands are available:

- `yarn test`
- `yarn test:watch` - tests are runInBand (-i) in watch
- `yarn test:coverage`
