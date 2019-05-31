
const GetVersionFromAcceptHeaderVersion = (req) => {
  return req.header('Accept')
}

class VersionController {
  getVersion (req, _res) {
    return GetVersionFromAcceptHeaderVersion(req)
  }
}

const versionController = new VersionController()
export default versionController
