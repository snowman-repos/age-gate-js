import styles from "./title.css";

/**
 * Creates title elements that can be configured with the following options:
 * - content
 * - classes
 * @param {object} The configuration object.
 * @return {object} The HTML node for the title element created.
 */
export default class Title {

  constructor(config) {

    config = config || {};

    return this.createElement(config);

  }

  /**
   * Creates the title element.
   * @param {object} The configuration object.
   * @return {object} The HTML node for the title element created.
   */
  createElement(config) {

    let el = document.createElement("h1");
    el.classList.add(styles.agTitle);

    // optional configuration
    el.classList.add(config.classes);
    el.textContent = config.content;

    return el;

  }

}
