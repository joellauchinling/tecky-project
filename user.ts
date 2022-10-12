import { Router, Request, Response } from 'express';
import { client } from './db';

export let userRoutes = Router();
userRoutes.post('/signup', signup);
userRoutes.post('/login', login)

export async function signup(req: Request, res: Response) {
    let { username, password } = req.body;
    let result = await client.query(
        'insert into users (username, password) values ($1, $2) returning id',
        [username, password]
    )
    let id = result.rows[0].id;
    res.json(id);
}

export async function login(req: Request, res: Response) {
    let { username, password } = req.body;
    let result = await client.query(
        'select id from users where username = $1 and password = $2',
        [username, password],
    )
    let user = result.rows[0];
    res.json(user);
}