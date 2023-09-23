import { Group } from "@stricjs/router";
import { qs } from "@stricjs/utils";
import { formatSocketData, parseSocketData } from "../services/utils";
import { getScanStatus, startScanInSocket, stopScanInSocket } from "../controllers/socketController";

const getID = qs.searchKey('id');

global.scanStatus = false

const group = new Group()
  .ws('/ws', {
    open(ws) {
      getScanStatus(ws)
      ws.subscribe('all')
    },
    message: (ws, msg) => {
      const data = parseSocketData(msg)

      switch (data?.type) {
        case "scan":
          startScanInSocket(ws, data.value)
          break;
        case "stop":
          stopScanInSocket(ws)
          break;
        case "status":
          getScanStatus(ws)
          break;
      }

      // ws.send((++count).toString())
    },
    close(ws) {
      ws.unsubscribe('all')
    }
  })
    
export {
  group as socketRouter
}