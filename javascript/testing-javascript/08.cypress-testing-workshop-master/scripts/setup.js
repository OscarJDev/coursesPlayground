var path = require('path')

var pkg = require(path.join(process.cwd(), 'package.json'))
var engines = pkg.engines

var options = {
  directories: [process.cwd(), path.join(process.cwd(), 'server')],
  node: engines.node,
  npm: engines.npm,
  yarn: engines.yarn,
}

require('./workshop-setup')
  .setup(options)
  .then(
    () => {
      console.log(`💯  You're all set up! 👏`)
    },
    error => {
      console.error(`🚨  There was a problem:`)
      console.error(error)
      console.error(
        `\nIf you would like to just ignore this error, then feel free to do so and install dependencies as you normally would in "${process.cwd()}". Just know that things may not work properly if you do...`,
      )
    },
  )

/* eslint no-var:0 */
