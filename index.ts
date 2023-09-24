import { Router } from '@stricjs/router';
import useRoutes from "./src/routes";

const app = new Router()

useRoutes(app)

export default app