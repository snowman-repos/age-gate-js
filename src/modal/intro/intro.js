import styles from "./intro.css";

/**
 * Creates intro elements that can be configured with the following options:
 * - content
 * - classes
 * @param {object} The configuration object.
 * @return {object} The HTML node for the intro element created.
 */
export default class Intro {

  constructor(config) {

    config = config || {};

    return this.createElement(config);

  }

  /**
   * Creates the intro element.
   * @param {object} The configuration object.
   * @return {object} The HTML node for the intro element created.
   */
  createElement(config) {

    let el = document.createElement("p");
    el.classList.add(styles.agIntro);

    // optional configuration
    el.classList.add(config.classes);
    el.innerHTML = config.content;

    return el;

  }

}
