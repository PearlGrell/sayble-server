import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { createUser, getUserByID } from './controller/users';

export const config = {
  runtime: 'edge'
}

const app = new Hono().basePath('/api')

app.post('/auth/create', async (c) => {
    return await createUser(c);
});

app.get('/user/:id', async (c) => {
    return await getUserByID(c);
});

export default handle(app)
