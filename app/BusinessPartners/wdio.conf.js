require("dotenv").config({path : "../../.env"})
const endPoint = require("../../tests/util/config").bp_app
exports.config = {

  // wdi5 Configuration
  wdi5: {
    logLevel: "verbose", 
    waitForUI5Timeout: 80000
  },

  // Specify Test Files
  specs: ["../../tests/ui/specs/*.js"],

  // Capabilities
  maxInstances: 10,

  capabilities: [
    {
        maxInstances: 5,
        browserName: "chrome",
        acceptInsecureCerts: true,
        'goog:chromeOptions': {
          args: [ '--headless', '--disable-dev-shm-usage', '--disable-gpu', '--no-sandbox', '--window-size=1920,1080'], 
        },
        "wdi5:authentication": {
          provider: "BTP"
        }
    },
  ],

  // Test Configurations
  logLevel: "error",
  
  bail: 0,

  baseUrl: "",

  waitforTimeout: 100000,

  connectionRetryTimeout: 120000,

  connectionRetryCount: 3,
  
  // Test runner services
  services: ["ui5", "chromedriver"],

  // Framework you want to run your specs with.
  framework: "mocha",
 
  reporters: ["spec"],


  mochaOpts: {
    ui: "bdd",
    timeout: 80000,
  },

  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  /**
   * Gets executed once before all workers get launched.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  // onPrepare: function (config, capabilities) {
  // },
  /**
   * Gets executed before a worker process is spawned and can be used to initialise specific service
   * for that worker as well as modify runtime environments in an async fashion.
   * @param  {String} cid      capability id (e.g 0-0)
   * @param  {[type]} caps     object containing capabilities for session that will be spawn in the worker
   * @param  {[type]} specs    specs to be run in the worker process
   * @param  {[type]} args     object that will be merged with the main configuration once worker is initialized
   * @param  {[type]} execArgv list of string arguments passed to the worker process
   */
  // onWorkerStart: function (cid, caps, specs, args, execArgv) {
  // },
  /**
   * Gets executed just after a worker process has exited.
   * @param  {String} cid      capability id (e.g 0-0)
   * @param  {Number} exitCode 0 - success, 1 - fail
   * @param  {[type]} specs    specs to be run in the worker process
   * @param  {Number} retries  number of retries used
   */
  // onWorkerEnd: function (cid, exitCode, specs, retries) {
  // },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   * @param {String} cid worker id (e.g. 0-0)
   */
  // beforeSession: async function () {
  // },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs        List of spec file paths that are to be run
   * @param {Object}         browser      instance of created browser/device session
   */

  //Login into the app and get to the main page
  before: async function (capabilities, specs, browser) {

      console.log(await browser.getWindowSize())
      await browser.waitUntil(async() => {
          return((await browser.getUrl()) === endPoint.auth)
      })
      await (await $("=Default Identity Provider")).click();

      console.log("Logging in...")    

      console.log(browser.options.baseUrl)

      await browser.waitUntil(async() => {
          return((await browser.getUrl()) === browser.options.baseUrl)
      })

      console.log("Log in successful")

      endPoint.main = browser.options.baseUrl.split("#")[0]+"#fe-lrop-v4";

      const tile = await $("span=Business Partner Validation");
      if(await tile.waitForDisplayed({ timeout: 10000 }) && await tile.waitForClickable({ timeout: 10000 })){
        
        console.log("Navigating from Home Page")  
        await tile.click();

        await browser.waitUntil(async() => {
          return((await browser.getUrl()) === endPoint.main)
        })
        console.log("Navigated to the main page ")
      }

      if (await browser.getUrl() !== endPoint.main){
        console.log("Required page not loaded");
        browser.closeWindow();
        process.exit();
      }
  }
  ,
  /**
   * Runs before a WebdriverIO command gets executed.
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   */
  // beforeCommand: function (commandName, args) {
  // },
  /**
   * Hook that gets executed before the suite starts
   * @param {Object} suite suite details
   */
  // beforeSuite: function (suite) {
  // },
  /**
   * Function to be executed before a test (in Mocha/Jasmine) starts.
   */
  // beforeTest: function (test, context) {
  // },
  /**
   * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
   * beforeEach in Mocha)
   */
  // beforeHook: function (test, context) {
  // },
  /**
   * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
   * afterEach in Mocha)
   */
  // afterHook: function (test, context, { error, result, duration, passed, retries }) {
  // },
  /**
   * Function to be executed after a test (in Mocha/Jasmine only)
   * @param {Object}  test             test object
   * @param {Object}  context          scope object the test was executed with
   * @param {Error}   result.error     error object in case the test fails, otherwise `undefined`
   * @param {Any}     result.result    return object of test function
   * @param {Number}  result.duration  duration of test
   * @param {Boolean} result.passed    true if test has passed, otherwise false
   * @param {Object}  result.retries   informations to spec related retries, e.g. `{ attempts: 0, limit: 0 }`
   */
  // afterTest: function(test, context, { error, result, duration, passed, retries }) {
  // },

  /**
   * Hook that gets executed after the suite has ended
   * @param {Object} suite suite details
   */
  // afterSuite: function (suite) {
  // },
  /**
   * Runs after a WebdriverIO command gets executed
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {Number} result 0 - command success, 1 - command error
   * @param {Object} error error object if any
   */
  // afterCommand: function (commandName, args, result, error) {
  // },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {Number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // after: function (result, capabilities, specs) {
  // },
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // afterSession: function (config, capabilities, specs) {
  // },
  /**
   * Gets executed after all workers got shut down and the process is about to exit. An error
   * thrown in the onComplete hook will result in the test run failing.
   * @param {Object} exitCode 0 - success, 1 - fail
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */
  // onComplete: function(exitCode, config, capabilities, results) {
  // },
  /**
   * Gets executed when a refresh happens.
   * @param {String} oldSessionId session ID of the old session
   * @param {String} newSessionId session ID of the new session
   */
  // onReload: function(oldSessionId, newSessionId) {
  // }
};