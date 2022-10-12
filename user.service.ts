import { Client } from 'pg'
import { HTTPError } from './error';

export class UserService {
    constructor(private client: Client) {} //TODO

async signup(user:{ username: string, password: string }): Promise<{ id: number }> {
    let result = await this.client.query(
        'insert into users (username, password) values ($1, $2) returning id',
        [user.username, user.password]
    )
    let id = result.rows[0].id;
    return { id };
}

async login(user:{ username: string, password: string }) {
    let result = await this.client.query(
        'select id from users where username = $1 and password = $2',
        [user.username, user.password],
    )
    let row = result.rows[0];
    if (!row) {
        throw new HTTPError(401, "wrong username or password");
    }
    return row;
}
}