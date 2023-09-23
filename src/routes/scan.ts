import { Group } from "@stricjs/router";
import { scan } from "../controllers/scanController";

const group = new Group('/scan')
  .post('/', scan, {
    body: 'json'
  })
    
export {
  group as scanRouter
}