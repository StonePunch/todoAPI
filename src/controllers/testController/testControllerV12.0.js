
class TestController {
  async getTodo (req, res) {
    return res.status(200).send({
      success: true,
      message: 'Todo was retrieved successfully',
      data: 'Test controller'
    })
  }
}

const testController = new TestController()
module.exports = testController
