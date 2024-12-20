import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { createUser, loginUser, getUserByID, getUsers} from './controller/users';

const app = new Hono().basePath('/api')

app.use('*', cors())

app.post('/auth/create', async (c) => {
    return await createUser(c);
});

app.post('auth/login', async (c) => {
    return await loginUser(c);
});

app.get('/user/:id', async (c) => {
    return await getUserByID(c);
});

app.get('/users', async (c) => {
    return await getUsers(c);
});

export default app;
