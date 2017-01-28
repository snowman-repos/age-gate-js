import styles from "./modal-content.css";

/**
 * Creates elements to be placed inside the modal content. Each element is a
 * row that contains content based on the configuration options. The
 * configuration object should be formatted like this:
 * {
 * 	 id: {string},
 * 	 tagName: {string},
 * 	 attributes: {
 * 	 	 key: value,
 * 	 	 key: value
 * 	 },
 * 	 classes: [
 * 	 	 {string},
 * 	 	 {string}
 * 	 ],
 * 	 content: {string}
 * }
 * @param {object} The configuration object.
 * @return {object} The HTML node for the element created.
 */
export default class ModalContent {

  constructor(config) {

    config = config || {};
    config.id = config.id || "";
    config.tagName = config.tagName || "div";
    config.attributes = config.attributes || {};
    config.classes = config.classes || [];
    config.content = config.content || "";

    if(config.id === "") {
      return false;
    }

    return this.createElement(config);

  }

  /**
   * Creates the element.
   * @param {object} The configuration object.
   * @return {object} The HTML node for the element created.
   */
  createElement(config) {

    let container = document.createElement("div");
    container.classList.add(styles.agModalContentRow);

    let el = document.createElement(config.tagName);
    el.id = config.id;
    el.classList.add(styles[config.id]);

    // optional attributes
    let keys = Object.keys(config.attributes);
    for(let i = 0; i < keys.length; i++) {
      el.setAttribute(keys[i], config.attributes[keys[i]]);
    }

    // optional classes
    el.className += " " + config.classes.join(" ");

    // optional content
    el.innerHTML = config.content;

    container.appendChild(el);

    return container;

  }

  /**
   * Takes a hyphen-delimited ID and returns a camel-case class name.
   * @param {string}
   * @return {string}
   */
  getClassNameFromId(id) {

    let words = id.split("-");

    for(let i=0; i < words.length; i++){
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }

    return "ag" + words.join("");

  }

}
