import Modal from "./modal/modal";

/**
 * Class to create and control the age gate.
 * @param {object} configuration options.
 * @constructor
 */
export default class AgeGate {

  constructor(config) {

    // Setup config options
    config = config || {};
    config.cookie = config.cookie || {};
    config.contents = config.contents || {};
    config.rules = config.rules || {};
    config.wrapper = config.wrapper || null;

    // Clean up confifuration and add any additional mandatory configuration
    // that may not have been supplied
    config.rules = this.getRulesConfiguration(config.rules);
    config.contents = this.getContentsConfiguration(config.contents, config.rules);

    if(config.rules.saveToCookie) {
      config.cookie = this.getCookieConfiguration(config.cookie);
    }

    // Save a reference to the configuration
    this.config = config;

    // Save references to useful Age Gate elements
    this.el = {
      contents: {},
      modal: null,
      wrapper: config.wrapper
    };

    // Initialise the age gate
    this.init();

  }

  /**
   * Removes the Age Gate cookie.
   * @return {boolean}
   */
  clearCookie() {

    document.cookie = this.config.cookie.name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

    return true;

  }

  /**
   * initialise the Age Gate.
   * @return {boolean}
   */
  init() {

    if(this.el.wrapper) {

      document.body.appendChild(this.el.wrapper);
      this.el.modal = new Modal({
        wrapper: this.el.wrapper
      });

    } else {

      this.el.modal = new Modal();

    }

    // Now add content to the modal
    this.el.content = this.el.modal.generateContents(this.config.contents);

    // Show the Age Gate if the cookie is missing or invalid
    if(this.shouldShowAgeGate()) {
      this.el.modal.show();
    }

    // TODO: Add event listeners

    return true;

  }

  /**
   * Cleans up the configuration object for the age gate cookie and sets default
   * values if no configuration was provided.
   * @param {object} The cookie configuration.
   * @return {object}
   */
  getCookieConfiguration(config) {

    config = config || {};

    let configuration = {
      name: config.name || "age-gate",
      expires: config.expires || ""
    };

    return configuration;

  }

  /**
   * Cleans up the configuration object for the age gate content to ensure
   * it contains configuration only for allowed elements, does not contain any
   * empty or irrelevant configurations, and contains the configuration for all
   * mandatory elements.
   * @param {object} The given content configuration.
   * @param {object} The ruleset that may pertain to the content shown on the age gate.
   * @return {object} The final configuration for the age gate content.
   */
  getContentsConfiguration(config) {

    config = this.trimUnpermittedContent(config);
    config = this.trimEmptyContent(config);

    return config;

  }

  /**
   * Cleans up the configuration object for the age gate rules, setting defaults
   * where necessary.
   * @param {object} The given age gate rules configuration.
   * @return {object} The final age gate rules configuration.
   */
  getRulesConfiguration(config) {

    // Whether to show the radio options or the date of birth inputs
    if(config.dateOfBirth === undefined ||
       typeof(config.dateOfBirth) !== "boolean") {
      config.dateOfBirth = false;
    }

    // Whether to save all data submitted via the age gate to a cookie for later
    // re-use
    if(config.saveToCookie === undefined ||
       typeof(config.saveToCookie) !== "boolean") {
      config.saveToCookie = true;
    }

    return config;

  }

  /**
   * Get the value of the age gate cookie.
   * @return {object}
   */
  readCookie() {

    let name = this.config.cookie.name + "=";
	  let allCookies = document.cookie.split(';');

    for(let i = 0; i < allCookies.length; i++) {

      let cookie = allCookies[i];

      while(cookie.charAt(0) === " ") {
        cookie = cookie.substring(1, cookie.length);
      }

      if(cookie.indexOf(name) === 0) {

        let value = cookie.substring(name.length, cookie.length);

        if(value !== "") {
          return JSON.parse(value);
        }

      }

    }

	  return {};

  }

  saveCookie(data) {

    data = JSON.stringify(data);

    document.cookie = this.config.cookie.name + "=" + data + ";expires=" + this.config.cookie.expires + ";path=/;max-age=31536000";

    return true;

  }

  /**
   * Determines whether the Age Gate should be shown based on the status of the
   * age gate cookie.
   * @return {boolean}
   */
  shouldShowAgeGate() {

    let cookie = this.readCookie();

    if(!!cookie) {
      return !cookie.passed;
    } else {
      return true;
    }

  }

  /**
   * In case the content configuration contains any empty objects, this function
   * removes them.
   * @param {object} The given content configuration.
   * @return {object} The content configuration without any empty properties.
   */
  trimEmptyContent(config) {

    let keys = Object.keys(config);

    for(let i = 0; i < keys.length; i++) {

      if(typeof(config[keys[i]]) === undefined) {
        delete config[keys[i]];
      }

    }

    return config;

  }

  /**
   * Ensures that the content configuration only contains configuration objects
   * for the allowed set of age gate content. Any additional content elements
   * are removed.
   * @parm {object} The given age gate content configuration.
   * @return {object} The age gate content configuration with any unpermitted items removed.
   */
  trimUnpermittedContent(config) {

    let keys = Object.keys(config);
    let allowedKeys = [
      "title",
      "image",
      "intro",
      "radio",
      "dateOfBirth",
      "radio",
      "checkboxes",
      "country",
      "language",
      "button",
      "disclaimer"
    ];

    for(let i = 0; i < keys.length; i++) {

      if(allowedKeys.indexOf(keys[i]) === -1) {
        delete config[keys[i]];
      }

    }

    return config;

  }

}
