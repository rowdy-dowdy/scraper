import { Group, Router } from "@stricjs/router"
import { dir, file } from '@stricjs/utils';
import figlet from "figlet";
import { scanRouter } from "./scan"
import { socketRouter } from "../routes/socket"

const useRoutes = (app: Router) => {
  console.log(import.meta.dir)
  app.plug(scanRouter)
  app.plug(socketRouter)

  app.get('/test', ctx => {
    const body = figlet.textSync("Viet Hung IT!")
    return new Response(body);
  })
  .get('/*', dir('./public'))
  .get('/', file(`./public/index.html`))
}

export default useRoutes