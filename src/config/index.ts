const config = {
  verifyToken: process.env.VERIFY_TOKEN || '',
  accessToken: process.env.ACCESS_TOKEN || '',
  port: process.env.PORT || 3000,

  get hostName() {
    let hostNameEnv = process.env.GITPOD_WORKSPACE_URL || `http://localhost:${this.port || 3000}`
    return hostNameEnv.startsWith("https://") ? hostNameEnv : "https://" + hostNameEnv
  }
}

export default config