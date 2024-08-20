import { roles } from "../../utils/constant/enums.js";

export const orderEndpoint = {
    public: Object.values(roles),
    admin: [roles.ADMIN]
}