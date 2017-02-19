import styles from "./modal.css";
import ModalContent from "./content/modal-content";

// Keep this outside of the main class so that it remains private and
// inaccessible
let allowedMainElements = [
  "content",
  "curtain",
  "dialog"
];

/**
 * Class to create and control a modal window for the age gate; the
 * modal is not shown by default.
 * @param {object} HTMLNode to which the modal will be attached.
 * @constructor
 */
export default class Modal {

  constructor(config) {

    // Save DOM references
    this.el = {
      body: document.body,
      mainElements: this.createMainElements(),
      previouslyFocused: null
    };

    // State object
    this.state = {
      shown: false
    };

    // If the instance has been initialised with a wrapper element specified
    // in a config object, then append the main elements to it, otherwise
    // append the main elements to the body directly
    if(config) {
      this.appendTo(config.wrapper);
    } else {
      this.appendTo(document.body);
    }

  }

  /**
   * Append the main elements to a wrapper element.
   * @param {object} The HTML Node to which main elements should be appended.
   * @return {object} The HTML Node to which main elements have been appended.
   */
  appendTo(parent) {

    if(!parent) {
      return null;
    }

    parent.appendChild(this.el.mainElements.curtain);
    parent.appendChild(this.el.mainElements.dialog);
    this.el.mainElements.dialog.appendChild(this.el.mainElements.content);

    return parent;

  }

  /**
   * Create one of the main elements based on a config object.
   * @param {object} The set of options for creating the element.
   * @return {object} The HTML node for the newly created object.
   */
  createMainElement(config) {

    if(this.mainElementIsNotAllowed(config.name) || this.mainElementsAlreadyExist()) {
      return false;
    }

    let el = document.createElement(config.tagName);
    el.setAttribute("aria-hidden", config.ariaHidden);
    el.classList.add(styles[config.className]);
    el.id = config.id;
    el.setAttribute("role", config.role);
    el.setAttribute("tabindex", config.tabindex);
    el.style.zIndex = config.zindex;

    return(el);

  }

  /**
   *
   */
  createMainElements() {

    if(this.mainElementsAlreadyExist()) {
      return false;
    }

    // Modal elements must be placed above anything else on the page,
    // so find out what the highest element is
    let highestZIndex = this.getHighestZIndex();

    // There are 3 main parts to the modal:
    // - content: a container for the modal content
    // - curtain: a semi-opaque layer that covers the entire screen
    // - dialog: a dialog box that contains the content
    let content, curtain, dialog = null;

    content = this.createMainElement({
      ariaHidden: "true",
      className: "agModalContent",
      id: "ag-modal-content",
      name: "content",
      role: "document",
      tabindex: 0,
      tagName: "div",
      zindex: highestZIndex + 3
    });

    curtain = this.createMainElement({
      ariaHidden: "true",
      className: "agModalCurtain",
      id: "ag-modal-curtain",
      name: "curtain",
      role: "",
      tabindex: -1,
      tagName: "div",
      zindex: highestZIndex + 1
    });

    dialog = this.createMainElement({
      ariaHidden: "true",
      className: "agModalDialog",
      id: "ag-modal-dialog",
      name: "dialog",
      role: "dialog",
      tabindex: -1,
      tagName: "div",
      zindex: highestZIndex + 2
    });

    return {
      content: content,
      curtain: curtain,
      dialog: dialog
    };

  }

  /**
   * Generates an HTML node for the button row inside the modal content.
   * @param {object} The configuration for the button.
   * @return {object}
   */
  generateButton(config) {

    config = config || {};

    let container = this.generateContainer();

    let el = {
      id: "ag-button",
      tagName: "button",
      content: config.content || "Let me in",
      classes: config.classes || {},
      attributes: config.attributes || {}
    };

    el.attributes.type = "button";

    container.appendChild(new ModalContent(el));

    return container;

  }

  /**
   * Generates an HTML node for a single checkbox row inside the checkboxes row
   * in the modal content.
   * @param {object} The configuration for the checkbox.
   * @return {object}
   */
  generateCheckbox(config, index) {

    config = config || {};

    let container = document.createElement("label");
    container.classList.add(styles.agCheckboxContainer);
    container.setAttribute("for", "ag-checkbox-" + index);

    config.error = config.error || {};

    let el = {
      id: "ag-checkbox-" + index + "-error",
      tagName: "p",
      content: config.error.content || "Sorry, you are required to check this checkbox.",
      classes: config.error.classes || {},
      attributes: config.error.attributes || {}
    };

    container.appendChild(new ModalContent(el));

    config.input = config.input || {};

    el = {
      id: "ag-checkbox-" + index,
      tagName: "input",
      content: "",
      classes: config.error.classes || {},
      attributes: config.error.attributes || {}
    };

    el.attributes = config.input.attributes || {};
    el.attributes.name = "ag-checkbox-" + index;
    el.attributes.type = "checkbox";

    container.appendChild(new ModalContent(el));

    config.label = config.label || {};

    el = {
      id: "ag-checkbox-" + index + "-label",
      tagName: "span",
      content: config.label.content || "Please check this",
      classes: config.label.classes || {},
      attributes: config.label.attributes || {}
    };

    container.appendChild(new ModalContent(el));

    return container;

  }

  /**
   * Generates an HTML node for the checkboxes row inside the modal content.
   * @param {object} The configuration for the checkboxes.
   * @return {object}
   */
  generateCheckboxes(config) {

    let container = document.createElement("div");

    for(let i = 0; i < config.length; i++) {
      container.appendChild(this.generateCheckbox(config[i], i));
    }

    return container;

  }

  /**
   * Generates an HTML node for a container row inside the modal content.
   * @return {object}
   */
  generateContainer() {

    let container = document.createElement("div");
    container.classList.add(styles.agModalContentRow);
    return container;

  }

  /**
   * Generate the HTML for the required content inside the modal dialog.
   * @param {object} The configuration for the contents.
   * @return {object} The content of the modal dialog.
   */
  generateContents(config) {

    let configuration = config || {};

    this.el.mainElements.content.innerHTML = "";

    if(configuration.title) {
      this.el.mainElements.content.appendChild(this.generateTitle(configuration.title));
    }

    if(configuration.image) {
      this.el.mainElements.content.appendChild(this.generateImage(configuration.image));
    }

    // Intro is mandatory
    this.el.mainElements.content.appendChild(this.generateIntro(configuration.intro));

    if(configuration.radio) {
      this.el.mainElements.content.appendChild(this.generateRadio(configuration.radio));
    }

    if(configuration.dateOfBirth) {
      this.el.mainElements.content.appendChild(this.generateDateOfBirth(configuration.dateOfBirth));
    }

    if(configuration.checkboxes) {
      this.el.mainElements.content.appendChild(this.generateCheckboxes(configuration.checkboxes));
    }

    if(configuration.country) {
      this.el.mainElements.content.appendChild(this.generateCountry(configuration.country));
    }

    if(configuration.language) {
      this.el.mainElements.content.appendChild(this.generateLanguage(configuration.language));
    }

    // Button is mandatory
    this.el.mainElements.content.appendChild(this.generateButton(configuration.button));

    if(configuration.disclaimer) {
      this.el.mainElements.content.appendChild(this.generateDisclaimer(configuration.disclaimer));
    }

    this.el.mainElements.content = this.setTabIndices(this.el.mainElements.content);

    return(this.el.mainElements.content);

  }

  /**
   * Generates an HTML node for the country input row inside the modal content.
   * @param {object} The configuration for the country input.
   * @return {object}
   */
  generateCountry(config) {

    config = config || {};

    let container = this.generateContainer();

    config.error = config.error || {};

    let el = {
      id: "ag-country-error",
      tagName: "p",
      content: config.error.content || "Sorry, this site does not allow access from the country you have selected.",
      classes: config.error.classes || {},
      attributes: config.error.attributes || {}
    };

    container.appendChild(new ModalContent(el));

    config.label = config.label || {};

    el = {
      id: "ag-country-label",
      tagName: "label",
      content: config.label.content || "Select the country you are in:",
      classes: config.label.classes || {},
      attributes: config.label.attributes || {}
    };

    el.attributes.for = "ag-country";

    container.appendChild(new ModalContent(el));

    config.input = config.input || {};

    let countryList = config.input.content || this.getCountryList();

    el = {
      id: "ag-country",
      tagName: "select",
      content: this.generateSelectList(countryList),
      classes: config.input.classes || {},
      attributes: config.input.attributes || {}
    };

    el.attributes.name = "ag-country";

    container.appendChild(new ModalContent(el));

    return container;

  }

  /**
   * Generates the HTML node for the date of birth input row inside the modal
   * content.
   * @param {object} The configuration for the date of birth input.
   * @return {object}
   */
  generateDateOfBirth(config) {

    let container = this.generateContainer();

    config = config || {};

    config.error = config.error || {};

    let el = {
      id: "ag-dob-error",
      tagName: "p",
      content: config.error.content || "Sorry, you must be of legal age to enter this site.",
      classes: config.error.classes || {},
      attributes: config.error.attributes || {}
    };

    container.appendChild(new ModalContent(el));

    config.day = config.day || {};
    config.month = config.month || {};
    config.year = config.year || {};

    container.appendChild(this.generateDay(config.day));
    container.appendChild(this.generateMonth(config.month));
    container.appendChild(this.generateYear(config.year));

    return container;

  }

  /**
   * Generates an HTML node for the day input column inside the date of birth
   * row in the modal content.
   * @param {object} The configuration for the day input.
   * @return {object}
   */
  generateDay(config) {

    let subContainer = this.generateSubContainer();

    config = config || {};

    config.label = config.label || {};

    let el = {
      attributes: config.label.attributes || {},
      classes: config.label.classes || {},
      content: config.label.content || "Day:",
      id: "ag-dob-day-label",
      tagName: "label"
    };

    el.attributes.for = "ag-dob-day";

    subContainer.appendChild(new ModalContent(el));

    config.input = config.input || {};
    config.input.attributes = config.input.attributes || {};

    el = {
      attributes: config.input.attributes,
      classes: config.input.classes || {},
      content: "",
      id: "ag-dob-day",
      tagName: "input"
    };

    el.attributes.name = "ag-dob-day";
    el.attributes.placeholder = config.input.attributes.placeholder || "Day";
    el.attributes.type = "text";

    subContainer.appendChild(new ModalContent(el));

    return subContainer;

  }

  /**
   * Generates an HTML node for the disclaimer row inside the modal content.
   * @param {object} The configuration for the disclaimer.
   * @return {object}
   */
  generateDisclaimer(config) {

    config = config || {};

    let container = this.generateContainer();

    let el = {
      id: "ag-disclaimer",
      tagName: "p",
      content: config.content || "Disclaimer text",
      classes: config.classes || {},
      attributes: config.attributes || {}
    };

    container.appendChild(new ModalContent(el));

    return container;

  }

  /**
   * Generates the HTML node for the image row inside the modal content.
   * @param {object} The configuration for the image.
   * @return {object}
   */
  generateImage(config) {

    let container = this.generateContainer();

    config = config || {};

    let el = {
      attributes: config.attributes || {},
      classes: config.classes || {},
      content: "",
      id: "ag-image",
      tagName: "img"
    };

    el.attributes.src = el.attributes.src || "";
    el.attributes.alt = el.attributes.alt || "";

    container.appendChild(new ModalContent(el));

    return container;

  }

  /**
   * Generates the HTML node for the intro row inside the modal content.
   * @param {object} The configuration for the intro.
   * @return {object}
   */
  generateIntro(config) {

    let container = this.generateContainer();

    config = config || {};

    let el = {
      attributes: config.attributes || {},
      classes: config.classes || {},
      content: config.content || `For legal reasons, we need you to verify that you are of legal age before we can let you in to our site.`,
      id: "ag-intro",
      tagName: "p"
    };

    container.appendChild(new ModalContent(el));

    return container;

  }

  /**
   * Generates an HTML node for the month input column inside the date of birth
   * row in the modal content.
   * @param {object} The configuration for the month input.
   * @return {object}
   */
  generateMonth(config) {

    let subContainer = this.generateSubContainer();

    config = config || {};

    config.label = config.label || {};

    let el = {
      attributes: config.label.attributes || {},
      classes: config.label.classes || {},
      content: config.label.content || "Month:",
      id: "ag-dob-month-label",
      tagName: "label"
    };

    el.attributes.for = "ag-dob-month";

    subContainer.appendChild(new ModalContent(el));

    config.input = config.input || {};
    config.input.attributes = config.input.attributes || {};

    el = {
      attributes: config.input.attributes,
      classes: config.input.classes || {},
      content: "",
      id: "ag-dob-month",
      tagName: "input"
    };

    el.attributes.name = "ag-dob-month";
    el.attributes.placeholder = config.input.attributes.placeholder || "Month";
    el.attributes.type = "text";

    subContainer.appendChild(new ModalContent(el));

    return subContainer;

  }

  /**
   * Generates an HTML node for the country input row inside the modal content.
   * @param {object} The configuration for the language input.
   * @return {object}
   */
  generateLanguage(config) {

    config = config || {};

    let container = this.generateContainer();

    config.error = config.error || {};

    let el = {
      id: "ag-language-error",
      tagName: "p",
      content: config.error.content || "Sorry, the language you have selected is not supported.",
      classes: config.error.classes || {},
      attributes: config.error.attributes || {}
    };

    container.appendChild(new ModalContent(el));

    config.label = config.label || {};

    el = {
      id: "ag-language-label",
      tagName: "label",
      content: config.label.content || "Select your language:",
      classes: config.label.classes || {},
      attributes: config.label.attributes || {}
    };

    el.attributes.for = "ag-language";

    container.appendChild(new ModalContent(el));

    config.input = config.input || {};

    let languageList = config.input.content || this.getLanguageList();

    el = {
      id: "ag-language",
      tagName: "select",
      content: this.generateSelectList(languageList),
      classes: config.input.classes || {},
      attributes: config.input.attributes || {}
    };

    el.attributes.name = "ag-language";

    container.appendChild(new ModalContent(el));

    return container;

  }

  /**
   * Generates the HTML node for the radio buttons row inside the modal content.
   * @param {object} The configuration for the radio buttons.
   * @return {object}
   */
  generateRadio(config) {

    let container = this.generateContainer();

    config = config || {};

    config.error = config.error || {};

    let el = {
      attributes: config.error.attributes || {},
      classes: config.error.classes || {},
      content: config.error.content || `Sorry, you must be of legal age to enter this site.`,
      id: "ag-radio-error",
      tagName: "p"
    };

    container.appendChild(new ModalContent(el));

    let subContainer = this.generateSubContainer();

    config.yes = config.yes || {};

    config.yes.input = config.yes.input || {};

    el = {
      attributes: config.yes.input.attributes || {},
      classes: config.yes.input.classes || {},
      id: "ag-radio-yes",
      tagName: "input",
    };

    el.attributes.name = "radio";
    el.attributes.type = "radio";
    el.attributes.value = "yes";

    subContainer.appendChild(new ModalContent(el));

    config.yes.label = config.yes.label || {};

    el = {
      attributes: config.yes.label.attributes || {},
      classes: config.yes.label.classes || {},
      id: "ag-radio-yes-label",
      tagName: "label",
      content: config.yes.label.content || "Yes, I am of legal age."
    };

    el.attributes.for = "ag-radio-yes";

    subContainer.appendChild(new ModalContent(el));

    container.appendChild(subContainer);

    subContainer = this.generateSubContainer();

    config.no = config.no || {};

    config.no.input = config.no.input || {};

    el = {
      attributes: config.no.input.attributes || {},
      classes: config.no.input.classes || {},
      id: "ag-radio-no",
      tagName: "input",
    };

    el.attributes.name = "radio";
    el.attributes.type = "radio";
    el.attributes.value = "no";

    subContainer.appendChild(new ModalContent(el));

    config.no.label = config.no.label || {};

    el = {
      attributes: config.no.label.attributes || {},
      classes: config.no.label.classes || {},
      id: "ag-radio-no-label",
      tagName: "label",
      content: config.no.label.content || "No, I am not of legal age."
    };

    el.attributes.for = "ag-radio-no";

    subContainer.appendChild(new ModalContent(el));

    container.appendChild(subContainer);

    return container;

  }

  /**
   * Generates the HTML content for a select input..
   * @param {object} The configuration for the list.
   * @return {string}
   */
  generateSelectList(list) {

    let select = document.createElement("select");

    for(var item in list) {

      if(typeof(item) === "string") {

        let option = document.createElement("option");
        option.setAttribute("value", item);
        option.innerHTML = list[item];
        select.appendChild(option);

      }

    }

    return select.innerHTML;

  }

  /**
   * Generates an HTML node for a column inside a row in the modal content.
   * @return {object}
   */
  generateSubContainer() {

    let container = document.createElement("div");
    container.classList.add(styles.agModalContentColumn);
    return container;

  }

  /**
   * Generates the HTML node for the title row inside the modal content.
   * @param {object} The configuration for the title.
   * @return {object}
   */
  generateTitle(config) {

    let container = this.generateContainer();

    config = config || {};

    let el = {
      attributes: config.attributes || {},
      classes: config.classes || {},
      content: config.content || "Please Verify Your Age",
      id: "ag-title",
      tagName: "h1"
    };

    container.appendChild(new ModalContent(el));

    return container;

  }

  /**
   * Generates an HTML node for the year input column inside the date of birth
   * row in the modal content.
   * @param {object} The configuration for the year input.
   * @return {object}
   */
  generateYear(config) {

    let subContainer = this.generateSubContainer();

    config = config || {};

    config.label = config.label || {};

    let el = {
      attributes: config.label.attributes || {},
      classes: config.label.classes || {},
      content: config.label.content || "Year:",
      id: "ag-dob-year-label",
      tagName: "label"
    };

    el.attributes.for = "ag-dob-year";

    subContainer.appendChild(new ModalContent(el));

    config.input = config.input || {};
    config.input.attributes = config.input.attributes || {};

    el = {
      attributes: config.input.attributes,
      classes: config.input.classes || {},
      content: "",
      id: "ag-dob-year",
      tagName: "input"
    };

    el.attributes.name = "ag-dob-year";
    el.attributes.placeholder = config.input.attributes.placeholder || "Year";
    el.attributes.type = "text";

    subContainer.appendChild(new ModalContent(el));

    return subContainer;

  }

  /**
   * Returns a list of all countries (in English).
   * @return {object}
   */
  getCountryList() {

    return {
      AF: "Afghanistan",
      AX: "Aland Islands",
      AL: "Albania",
      DZ: "Algeria",
      AS: "American Samoa",
      AD: "Andorra",
      AO: "Angola",
      AI: "Anguilla",
      AQ: "Antarctica ",
      AG: "Antigua and Barbuda",
      AR: "Argentina",
      AM: "Armenia",
      AW: "Aruba",
      AU: "Australia",
      AT: "Austria",
      AZ: "Azerbaijan",
      BS: "Bahamas",
      BH: "Bahrain",
      BD: "Bangladesh",
      BB: "Barbados",
      BY: "Belarus",
      BE: "Belgium",
      BZ: "Belize",
      BJ: "Benin",
      BM: "Bermuda",
      BT: "Bhutan",
      BO: "Bolivia",
      BA: "Bosnia and Herzegovina",
      BW: "Botswana",
      BV: "Bouvet Island",
      BR: "Brazil",
      VG: "British Virgin Islands",
      IO: "British Indian Ocean Territory",
      BN: "Brunei Darussalam",
      BG: "Bulgaria",
      BF: "Burkina Faso",
      BI: "Burundi",
      KH: "Cambodia",
      CM: "Cameroon",
      CA: "Canada ",
      CV: "Cape Verde",
      KY: "Cayman Islands ",
      CF: "Central African Republic",
      TD: "Chad",
      CL: "Chile",
      CN: "China",
      HK: "Hong Kong, Special Administrative Region of China",
      MO: "Macao, Special Administrative Region of China",
      CX: "Christmas Island",
      CC: "Cocos (Keeling) Islands",
      CO: "Colombia",
      KM: "Comoros",
      CG: "Congo (Brazzaville) ",
      CD: "Congo, Democratic Republic of the ",
      CK: "Cook Islands ",
      CR: "Costa Rica",
      CI: "Côte d'Ivoire",
      HR: "Croatia",
      CU: "Cuba",
      CY: "Cyprus",
      CZ: "Czech Republic",
      DK: "Denmark",
      DJ: "Djibouti",
      DM: "Dominica",
      DO: "Dominican Republic",
      EC: "Ecuador",
      EG: "Egypt",
      SV: "El Salvador",
      GQ: "Equatorial Guinea",
      ER: "Eritrea",
      EE: "Estonia",
      ET: "Ethiopia",
      FK: "Falkland Islands (Malvinas) ",
      FO: "Faroe Islands",
      FJ: "Fiji",
      FI: "Finland",
      FR: "France",
      GF: "French Guiana",
      PF: "French Polynesia",
      TF: "French Southern Territories ",
      GA: "Gabon",
      GM: "Gambia",
      GE: "Georgia",
      DE: "Germany ",
      GH: "Ghana",
      GI: "Gibraltar ",
      GR: "Greece",
      GL: "Greenland",
      GD: "Grenada",
      GP: "Guadeloupe",
      GU: "Guam",
      GT: "Guatemala",
      GG: "Guernsey",
      GN: "Guinea",
      GW: "Guinea-Bissau",
      GY: "Guyana",
      HT: "Haiti",
      HM: "Heard Island and Mcdonald Islands",
      VA: "Holy See (Vatican City State)",
      HN: "Honduras",
      HU: "Hungary",
      IS: "Iceland",
      IN: "India",
      ID: "Indonesia",
      IR: "Iran, Islamic Republic of",
      IQ: "Iraq",
      IE: "Ireland",
      IM: "Isle of Man ",
      IL: "Israel ",
      IT: "Italy ",
      JM: "Jamaica",
      JP: "Japan",
      JE: "Jersey",
      JO: "Jordan",
      KZ: "Kazakhstan",
      KE: "Kenya",
      KI: "Kiribati",
      KP: "Korea, Democratic People's Republic of ",
      KR: "Korea, Republic of ",
      KW: "Kuwait",
      KG: "Kyrgyzstan",
      LA: "Lao PDR",
      LV: "Latvia",
      LB: "Lebanon",
      LS: "Lesotho",
      LR: "Liberia",
      LY: "Libya",
      LI: "Liechtenstein",
      LT: "Lithuania",
      LU: "Luxembourg",
      MK: "Macedonia, Republic of",
      MG: "Madagascar",
      MW: "Malawi",
      MY: "Malaysia",
      MV: "Maldives",
      ML: "Mali",
      MT: "Malta",
      MH: "Marshall Islands",
      MQ: "Martinique",
      MR: "Mauritania",
      MU: "Mauritius",
      YT: "Mayotte",
      MX: "Mexico",
      FM: "Micronesia, Federated States of",
      MD: "Moldova",
      MC: "Monaco",
      MN: "Mongolia",
      ME: "Montenegro",
      MS: "Montserrat",
      MA: "Morocco",
      MZ: "Mozambique",
      MM: "Myanmar",
      NA: "Namibia",
      NR: "Nauru",
      NP: "Nepal",
      NL: "Netherlands",
      AN: "Netherlands Antilles",
      NC: "New Caledonia",
      NZ: "New Zealand",
      NI: "Nicaragua",
      NE: "Niger",
      NG: "Nigeria",
      NU: "Niue ",
      NF: "Norfolk Island",
      MP: "Northern Mariana Islands",
      NO: "Norway",
      OM: "Oman",
      PK: "Pakistan",
      PW: "Palau",
      PS: "Palestinian Territory, Occupied",
      PA: "Panama",
      PG: "Papua New Guinea",
      PY: "Paraguay",
      PE: "Peru",
      PH: "Philippines",
      PN: "Pitcairn ",
      PL: "Poland",
      PT: "Portugal",
      PR: "Puerto Rico",
      QA: "Qatar",
      RE: "Réunion",
      RO: "Romania",
      RU: "Russian Federation ",
      RW: "Rwanda",
      BL: "Saint-Barthélemy",
      SH: "Saint Helena ",
      KN: "Saint Kitts and Nevis",
      LC: "Saint Lucia",
      MF: " Saint-Martin (French part)",
      PM: "Saint Pierre and Miquelon ",
      VC: "Saint Vincent and Grenadines",
      WS: "Samoa",
      SM: "San Marino",
      ST: "Sao Tome and Principe",
      SA: "Saudi Arabia",
      SN: "Senegal",
      RS: "Serbia",
      SC: "Seychelles",
      SL: "Sierra Leone",
      SG: "Singapore",
      SK: "Slovakia",
      SI: "Slovenia",
      SB: "Solomon Islands",
      SO: "Somalia",
      ZA: "South Africa",
      GS: "South Georgia and the South Sandwich Islands",
      SS: "South Sudan",
      ES: "Spain",
      LK: "Sri Lanka",
      SD: "Sudan",
      SR: "Suriname *",
      SJ: "Svalbard and Jan Mayen Islands ",
      SZ: "Swaziland",
      SE: "Sweden",
      CH: "Switzerland",
      SY: "Syrian Arab Republic (Syria)",
      TW: "Taiwan, Republic of China ",
      TJ: "Tajikistan",
      TZ: "Tanzania *, United Republic of ",
      TH: "Thailand",
      TL: "Timor-Leste",
      TG: "Togo",
      TK: "Tokelau ",
      TO: "Tonga",
      TT: "Trinidad and Tobago",
      TN: "Tunisia",
      TR: "Turkey",
      TM: "Turkmenistan",
      TC: "Turks and Caicos Islands ",
      TV: "Tuvalu",
      UG: "Uganda",
      UA: "Ukraine",
      AE: "United Arab Emirates",
      GB: "United Kingdom",
      US: "United States of America",
      UM: "United States Minor Outlying Islands ",
      UY: "Uruguay",
      UZ: "Uzbekistan",
      VU: "Vanuatu",
      VE: "Venezuela (Bolivarian Republic of)",
      VN: "Viet Nam",
      VI: "Virgin Islands, US",
      WF: "Wallis and Futuna Islands ",
      EH: "Western Sahara ",
      YE: "Yemen",
      ZM: "Zambia",
      ZW: "Zimbabwe"
    };

  }

  /**
   * Get the highest (z-index) element on the page.
   * @return {number} The current highest z-index.
   */
  getHighestZIndex() {

    // Get a collection of all elements on the page
    let elements = document.getElementsByTagName("*");
    let highest = 0;

    // Loop through all elements
    for(let i = 0; i < elements.length; i++) {

      // Get the element's z-index value
      let computedStyle = document.defaultView.getComputedStyle(elements[i], null).getPropertyValue("z-index");
      let zindex = Number(!isNaN(computedStyle) || elements[i].style.zIndex === "" ? 0 : elements[i].style.zIndex);

      // Save the z-index value if it's the highest so far
      if(zindex > highest && zindex !== 'auto') {
        highest = zindex;
      }

    }

    return highest;

  }

  /**
   * Returns a list of languages (in English).
   * @return {object}
   */
  getLanguageList() {

    return {
      EN: "English",
      ZH: "Chinese"
    };

  }

  /**
   * Hide the modal by removing the state classes and unlocking the
   * body, and also update the state object.
   * @return {boolean}
   */
  hide() {

    // Don't run if the modal is already hidden
    if(!this.state.shown) {
      return false;
    }

    this.state.shown = false;

    this.toggleClasses();
    this.toggleAriaHidden();
    this.restoreFocus();

    return true;

  }

  /**
   * Check if the main elements have already been created.
   * @return {boolean}
   */
  mainElementsAlreadyExist() {

    return(!!this.el);

  }

  /**
   * Check if a main element may be created.
   * @param {string} The name of the element.
   * @return {boolean}
   */
  mainElementIsNotAllowed(name) {

    return(allowedMainElements.indexOf(name) === -1);

  }

  /**
   * If any element was in focus before the modal was opened then restore
   * focus to that element.
   * @return {boolean}
   */
  restoreFocus() {

    if(this.el.previouslyFocused.tagName === "BODY" ||
     this.el.previouslyFocused.id === "ag-modal-content") {

      document.activeElement.blur();

    } else {

      this.el.previouslyFocused.focus();

    }

    return true;

  }

  /**
   * Save a reference to any currently focused element and give focus to the
   * modal content.
   * @return {boolean}
   */
  setFocus() {

    this.el.previouslyFocused = document.activeElement;
    this.el.mainElements.content.focus();

    return true;

  }

  /**
   * Find all focusable elements inside the modal content and assign sequential
   * tab index values.
   * @param {object} The modal contents.
   * @return {object} The modal contents with tab indices assigned.
   */
  setTabIndices(contents) {

    let tabindex = 1;
    let elements = contents.querySelectorAll("input, button");

    for(let i = 0; i < elements.length; i++) {

      elements[i].setAttribute("tabindex", tabindex);
      tabindex++;

    }

    return contents;

  }

  /**
   * Show the modal by removing the state classes and unlocking the
   * body, and also update the state object.
   * @return {boolean}
   */
  show() {

    // Don't run if the modal is already shown
    if(this.state.shown) {
      return false;
    }

    this.state.shown = true;

    this.toggleClasses();
    this.toggleAriaHidden();
    this.setFocus();

    return true;

  }

  /**
   * Toggle the classes on the body and main elements that
   * control the page scroll and the modal visibility. Note: this
   * does not impact the state object and so should not be called
   * directly - use modal.show() and modal.hide() instead.
   * @return {boolean}
   */
  toggleClasses() {

    this.el.body.classList.toggle(styles.sAgBodyIsLocked);
    this.el.mainElements.content.classList.toggle(styles.sAgModalContentIsShown);
    this.el.mainElements.curtain.classList.toggle(styles.sAgModalCurtainIsShown);
    this.el.mainElements.dialog.classList.toggle(styles.sAgModalDialogIsShown);

    return true;

  }

  /**
   * Toggle the aria-hiden attribute on the main elements.
   * @return {boolean}
   */
  toggleAriaHidden() {

    this.el.mainElements.content.setAttribute("aria-hidden", !this.state.shown);
    this.el.mainElements.curtain.setAttribute("aria-hidden", !this.state.shown);
    this.el.mainElements.dialog.setAttribute("aria-hidden", !this.state.shown);

    return true;

  }

}
