import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel'
import { createUser, getUserByID, getUserByToken, getUsers } from './controller/users';

export const config = {
  runtime: 'edge'
}

const app = new Hono().basePath('/api')

app.use('*', cors())

app.post('/auth/create', async (c) => {
    return await createUser(c);
});

app.get('/user/:id', async (c) => {
    return await getUserByID(c);
});

app.post('/user/current', async (c) => {
    return await getUserByToken(c);
});

app.get('/users', async (c) => {
    return await getUsers(c);
});

export default handle(app)
