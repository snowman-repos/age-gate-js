import AgeGate from "./index";

describe("Age Gate", () => {

  let ageGate = null;

  // Ensure the DOM has loaded before we start any tests
  beforeAll((done) => {

    document.addEventListener("DOMContentLoaded", () => {
      done();
    });

  });

  // // Setup a fresh age gate before each test
  // beforeEach(() => {
  //
  //   ageGate = new AgeGate();
  //
  // });

  // Reset the modal after each test
  afterEach(() => {

    document.body.innerHTML = "";
    ageGate = null;

  });

  it("Should initialise a modal object", () => {

    ageGate = new AgeGate();
    expect(ageGate.el.modal).not.toBe(null);

  });

  it("Should create and append a wrapper object if one is specified", () => {

    let testName = "test-wrapper";
    let el = document.createElement("div");
    el.id = testName;

    ageGate = new AgeGate({
      wrapper: el
    });

    let result = document.getElementById(testName);
    expect(result.length).not.toBe(0);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it(`Should only be able to configure allowed content for the age gate`, () => {

    ageGate = new AgeGate({
      contents: {
        title: {},
        intro: {},
        image: {},
        radio: {},
        dateOfBirth: {},
        checkboxes: {},
        country: {},
        language: {},
        button: {},
        disclaimer: {},
        random: {}
      }
    });

    expect(typeof(ageGate.config.contents.title)).toBe("object");
    expect(typeof(ageGate.config.contents.intro)).toBe("object");
    expect(typeof(ageGate.config.contents.image)).toBe("object");
    expect(typeof(ageGate.config.contents.radio)).toBe("object");
    expect(typeof(ageGate.config.contents.dateOfBirth)).toBe("object");
    expect(typeof(ageGate.config.contents.checkboxes)).toBe("object");
    expect(typeof(ageGate.config.contents.country)).toBe("object");
    expect(typeof(ageGate.config.contents.language)).toBe("object");
    expect(typeof(ageGate.config.contents.button)).toBe("object");
    expect(typeof(ageGate.config.contents.disclaimer)).toBe("object");
    expect(ageGate.config.contents.random).toBe(undefined);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/8
  it(`Should be able to configure whether the title will be shown on the age
     gate`, () => {

    let title = {};

    ageGate = new AgeGate();

    // The title is not mandatory
    expect(ageGate.config.contents.title).toBe(undefined);

    ageGate = new AgeGate({
      contents: {
        title: title
      }
    });

    expect(ageGate.config.contents.title).toBe(title);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/9
  it("Should always show the intro on the age gate", () => {

    ageGate = new AgeGate();

    // The title is not mandatory
    expect(typeof(ageGate.config.contents.intro)).toBe("object");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/10
  it(`Should be able to configure whether an image will be shown on
     the age gate`, () => {

    let image = {};

    ageGate = new AgeGate();

    // Checkboxes are not mandatory
    expect(ageGate.config.contents.image).toBe(undefined);

    ageGate = new AgeGate({
      contents: {
        image: image
      }
    });

    expect(ageGate.config.contents.image).toBe(image);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/12
  // https://github.com/darryl-snow/age-gate-js/issues/13
  it(`Should be able to configure whether the radio or the date of birth input
     will be shown on the age gate`, () => {

    ageGate = new AgeGate();

    // False by default
    expect(ageGate.config.rules.dateOfBirth).toBe(false);

    ageGate = new AgeGate({
      rules: {
        dateOfBirth: true
      }
    });

    expect(ageGate.config.rules.dateOfBirth).toBe(true);

  });

  //
  it(`Should be able to configure whether the age gate data will be saved to a
     cookie`, () => {

    ageGate = new AgeGate();

    // True by default
    expect(ageGate.config.rules.saveToCookie).toBe(true);

    ageGate = new AgeGate({
      rules: {
        saveToCookie: false
      }
    });

    expect(ageGate.config.rules.saveToCookie).toBe(false);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/12
  // https://github.com/darryl-snow/age-gate-js/issues/13
  it(`Should be able to configure always to show either the date of birth input
     or the radio on the age gate`, () => {

    ageGate = new AgeGate();

    // Show radio by default
    expect(typeof(ageGate.config.contents.radio)).toBe("object");
    expect(ageGate.config.contents.dateOfBirth).toBe(undefined);

    ageGate = new AgeGate({
      rules: {
        dateOfBirth: true
      }
    });

    // Show radio by default
    expect(typeof(ageGate.config.contents.dateOfBirth)).toBe("object");
    expect(ageGate.config.contents.radio).toBe(undefined);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/11
  it(`Should be able to configure whether any checkboxes will be shown on
     the age gate`, () => {

    let checkboxes = {};

    ageGate = new AgeGate();

    // Checkboxes are not mandatory
    expect(ageGate.config.contents.checkboxes).toBe(undefined);

    ageGate = new AgeGate({
      contents: {
        checkboxes: checkboxes
      }
    });

    expect(ageGate.config.contents.checkboxes).toBe(checkboxes);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/17
  it(`Should be able to configure whether the country input will be shown on
     the age gate`, () => {

    let country = {};

    ageGate = new AgeGate();

    // The country input is not mandatory
    expect(ageGate.config.contents.country).toBe(undefined);

    ageGate = new AgeGate({
      contents: {
        country: country
      }
    });

    expect(ageGate.config.contents.country).toBe(country);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/18
  it(`Should be able to configure whether the language input will be shown on
     the age gate`, () => {

    let language = {};

    ageGate = new AgeGate();

    // The language input is not mandatory
    expect(ageGate.config.contents.language).toBe(undefined);

    ageGate = new AgeGate({
      contents: {
        language: language
      }
    });

    expect(ageGate.config.contents.language).toBe(language);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/19
  it("Should always show the button on the age gate", () => {

    ageGate = new AgeGate();

    // The title is not mandatory
    expect(typeof(ageGate.config.contents.button)).toBe("object");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/20
  it(`Should be able to configure whether the disclaimer will be shown on
     the age gate`, () => {

    let disclaimer = {};

    ageGate = new AgeGate();

    // The disclaimer is not mandatory
    expect(ageGate.config.contents.disclaimer).toBe(undefined);

    ageGate = new AgeGate({
      contents: {
        disclaimer: disclaimer
      }
    });

    expect(ageGate.config.contents.disclaimer).toBe(disclaimer);

  });

});
