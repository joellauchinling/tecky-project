import { Request, Response } from 'express'
import { RestfulController } from './restful.controller'
import { UserService } from './user.service'

export class UserController extends RestfulController{
    constructor (private userService: UserService) {
        super();
        this.router.post('/signup',  this.signup);
        this.router.post('/login', this.login);
    }

    signup = async (req: Request, res: Response) => {
        //TODO
    }
    login = async (req: Request, res: Response) => {
        //TODO
    }
}