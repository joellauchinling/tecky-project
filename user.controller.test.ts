import { Request, Response } from 'express'
import { UserController } from "./user.controller";
import { UserService } from "./user.service";


describe('User Controller Unit Test', () => {
    let userService: UserService
    let userController: UserController

    let req: Request;
    let res: Response;

    beforeAll(() => {
        userService = {} as any;
        userController = new UserController(userService);
    })

    beforeEach(() => {
        req = {} as any;
        req.body = {};

        res = {} as any;
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn();

    })

    describe('login', ()=> {
        it("should reject if both passwords don't match", async () => {
            req.body.username = 'alicewong';
            req.body.password = 'secret1';
            req.body.password2 = 'secret2';
            await userController.login(req, res);
        })
    })
})