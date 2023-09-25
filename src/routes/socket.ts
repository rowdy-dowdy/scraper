import { Group } from "@stricjs/router";
import { qs } from "@stricjs/utils";
import { formatSocketData, parseSocketData } from "../services/utils";
import { getScanStatus, startScanInSocket, stopScanInSocket } from "../controllers/socketController";
import { randomUUID } from "crypto";

const getID = qs.searchKey('id');

global.scanStatus = false
global.clients = []

const group = new Group()
  .ws('/ws', {
    open(ws) {
      const id = randomUUID()
      //@ts-ignore
      ws.id = id
      global.clients.push({ id, ws })
      // ws.subscribe('all')

      getScanStatus()
    },
    message: (ws, msg) => {
      const data = parseSocketData(msg)

      switch (data?.type) {
        case "scan":
          startScanInSocket(data.value)
          break;
        case "stop":
          stopScanInSocket()
          break;
        case "status":
          getScanStatus()
          break;
      }

      // ws.send((++count).toString())
    },
    close(ws) {
      //@ts-ignore
      global.clients = global.clients.filter(v => v.id != ws.id)
      // ws.unsubscribe('all')
    }
  })
    
export {
  group as socketRouter
}