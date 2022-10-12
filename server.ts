import express, { Request, Response } from 'express';
import { print } from 'listening-on';
import { client } from './db';
import { env } from './env'
import { userRoutes } from './user';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const app = express();

app.use(express.static('public'))
app.use(express.urlencoded());
app.use(express.json());

let userService = new UserService(client);
let userController = new UserController(userService);
app.use(userController.router)

app.listen(env.PORT, () => {
    print(env.PORT);
})