import { Request, Response } from "express";
import { createUser, forgotPassword, getUser, getUserFromToken, getUsers, loginUser, logoutUser, resendOTP, resetPassword, updateProfileImage, updateUsernameAndPassword, verifyUser } from "../controller/User";
import { APIContextType, Options } from "../types";
import app from "../app";
import { settings } from "../config/settings";

const apiPrefix = settings.server.apiPrefix;

export const UserRoutes = async (options: Options) => {

    await app.post(`${apiPrefix}/auth/create`, async (
        request: Request, response: Response
    ) => await createUser({
        request: request,
        response: response,
        em: options.orm.em.fork()
    } as APIContextType));

    await app.get(`${apiPrefix}/user/current`, async (
        request: Request, response: Response
    ) => await getUserFromToken({
        request: request,
        response: response,
        em: options.orm.em.fork()
    } as APIContextType));

    await app.get(`${apiPrefix}/users`, async (
        request: Request, response: Response
    ) => await getUsers({
        request: request,
        response: response,
        em: options.orm.em.fork()
    } as APIContextType));

    await app.get(`${apiPrefix}/users/:id`, async (
        request: Request, response: Response
    ) => await getUser({
        request: request,
        response: response,
        em: options.orm.em.fork()
    } as APIContextType));

    await app.post(`${apiPrefix}/auth/verify`, async (
        request: Request, response: Response
    ) => await verifyUser({
        request: request,
        response: response,
        em: options.orm.em.fork()
    } as APIContextType));

    await app.put(`${apiPrefix}/users/credentials`, async (
        request: Request, response: Response
    ) => await updateUsernameAndPassword({
        request: request,
        response: response,
        em: options.orm.em.fork()
    } as APIContextType));

    await app.post(`${apiPrefix}/auth/login`, async (
        request: Request, response: Response
    ) => await loginUser({
        request: request,
        response: response,
        em: options.orm.em.fork()
    } as APIContextType));

    await app.post(`${apiPrefix}/auth/logout`, async (
        request: Request, response: Response
    ) => await logoutUser({
        request: request,
        response: response,
        em: options.orm.em.fork()
    } as APIContextType));

    await app.get(`${apiPrefix}/users/:id`, async (
        request: Request, response: Response
    ) => await getUser({
        request: request,
        response: response,
        em: options.orm.em.fork()
    } as APIContextType));

    await app.post(`${apiPrefix}/auth/resendotp`, async (
        request: Request, response: Response
    ) => await resendOTP({
        request: request,
        response: response,
        em: options.orm.em.fork()
    } as APIContextType));

    app.post(`${apiPrefix}/auth/forgotpassword`, async (
        request: Request, response: Response
    ) => await forgotPassword({
        request: request,
        response: response,
        em: options.orm.em.fork()
    } as APIContextType));

    app.post(`${apiPrefix}/auth/resetpassword`, async (
        request: Request, response: Response
    ) => await resetPassword({
        request: request,
        response: response,
        em: options.orm.em.fork()
    } as APIContextType));

    app.post(`${apiPrefix}/user/profile/image`, async (
        request: Request, response: Response
    ) => await updateProfileImage({
        request: request,
        response: response,
        em: options.orm.em.fork()
    } as APIContextType));
};

