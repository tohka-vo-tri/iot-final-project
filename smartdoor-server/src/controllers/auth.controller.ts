import { type Request, type Response } from "express";

const localLogin = (request: Request, response: Response) => {
    response.status(200);
}

export default {
    localLogin
}