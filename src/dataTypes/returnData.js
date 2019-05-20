class ReturnData {
  constructor (success = null, data = null, err = null) {
    this.success = success
    this.data = data
    this.err = err
  }
}

export default ReturnData
