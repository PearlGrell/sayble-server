import { Hono } from "hono";
import { createUser, getUserByID } from "./controller/users";

const app = new Hono();

app.post('/auth/create', async (c) => {
    return await createUser(c);
});

app.get('/user/:id', async (c) => {
    return await getUserByID(c);
});

export default app;
