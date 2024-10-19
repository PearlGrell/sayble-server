import { Options } from "../types";
import { UserRoutes } from "./User";

export const Routes = async (options : Options) =>{
    await UserRoutes(options);
};