// Source: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color

const consoleColor = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m'
}

class Logger {
  consoleLog (message, err) {
    const dateTime = new Date()

    const year = dateTime.getFullYear()
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0')
    const day = dateTime.getDate().toString().padStart(2, '0')
    const hour = dateTime.getHours().toString().padStart(2, '0')
    const minute = dateTime.getMinutes().toString().padStart(2, '0')
    const second = dateTime.getSeconds().toString().padStart(2, '0')
    const milisecond = dateTime.getMilliseconds().toString().padStart(3, '0')

    // yyyy-MM-dd hh:mm:ss:fff
    const builtDateTime =
      `(${consoleColor.FgCyan}${year}-${month}-${day}` +
      ` ${hour}:${minute}:${second}:${milisecond}${consoleColor.Reset})`

    let builtMessage =
      `${builtDateTime} ${message}`

    // TODO: Expand logging system
    if (err) {
      // Color the error message in red
      builtMessage +=
        `\n ${consoleColor.FgRed}%s${consoleColor.Reset}`

      console.log(builtMessage, err)
    } else {
      console.log(builtMessage)
    }
  }
}

const logger = new Logger()
export default logger
