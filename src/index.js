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
    config.contents = config.contents || {};
    config.rules = config.rules || {};
    config.wrapper = config.wrapper || null;

    // Clean up confifuration and add any additional mandatory configuration
    // that may not have been supplied
    config.rules = this.getRulesConfiguration(config.rules);
    config.contents = this.getContentsConfiguration(config.contents, config.rules);

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
   * Creates the default configuration for the mandatory button element.
   * @return {object}
   */
  createButton() {

    return {
      id: "ag-button",
      tagName: "button",
      content: "Let me in"
    }

  }

  /**
   * Creates the default configuration for the mandatory date of birth element.
   * @return {object}
   */
  createDateOfBirth() {

    return {
      id: "ag-date-of-birth",
      tagName: "div",
    }

  }

  /**
   * Creates the default configuration for the mandatory intro element.
   * @return {object}
   */
  createIntro() {

    return {
      id: "ag-intro",
      tagName: "p",
      content: "For legal reasons, we need to confirm that you are of legal age before we can let you into our site."
    }

  }

  /**
   * Creates the default configuration for the mandatory radio element.
   * @return {object}
   */
  createRadio() {

    return {
      id: "ag-radio",
      tagName: "div"
    }

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

    // TODO: Assess whether the modal should be shown
    // TODO: Add event listeners

    return true;

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
  getContentsConfiguration(config, rules) {

    config = this.trimUnpermittedContent(config);
    config = this.trimEmptyContent(config);

    // The title is mandatory
    config.intro = config.intro || this.createIntro();

    if(rules.dateOfBirth) {
      config.dateOfBirth = config.dateOfBirth || this.createDateOfBirth();
    } else {
      config.radio = config.radio || this.createRadio();
    }

    // The button is mandatory
    config.button = config.button || this.createButton();

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
