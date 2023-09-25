import { WSContext } from "@stricjs/router"
import { ServerWebSocket } from "bun"

export {}

interface Person {
  name: string
}

declare global {
  var scanStatus: boolean
  var clients: {
    id: string,
    ws: ServerWebSocket<WSContext<"/ws">>
  }[]
}