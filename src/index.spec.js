import AgeGate from "./index";

let clearCookies = function() {

  let cookies = document.cookie.split(";");

  for(let i = 0; i < cookies.length; i++) {

    let cookie = cookies[i];
    let pos = cookie.indexOf("=");
    let name = pos > -1 ? cookie.substr(0, pos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";

  }

}

describe("Age Gate", () => {

  let ageGate = null;

  // Ensure the DOM has loaded before we start any tests
  beforeAll((done) => {

    document.addEventListener("DOMContentLoaded", () => {
      done();
    });

  });

  // Reset the modal after each test
  afterEach(() => {

    document.body.innerHTML = "";
    clearCookies();
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

  // https://github.com/darryl-snow/age-gate-js/issues/36
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

  // https://github.com/darryl-snow/age-gate-js/issues/29
  it("Should be able to save an age gate cookie", () => {

    ageGate = new AgeGate();

    let testData = {
      testKey: "testValue"
    };

    ageGate.saveCookie(testData);

    expect(document.cookie.indexOf("age-gate")).not.toBe(-1);
    expect(document.cookie.indexOf(JSON.stringify(testData))).not.toBe(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/28
  it("Should be able to read an age gate cookie", () => {

    ageGate = new AgeGate();

    let testData = {
      testKey: "testValue"
    };

    document.cookie = "age-gate=" + JSON.stringify(testData);

    let returnData = ageGate.readCookie();

    expect(typeof(returnData)).toBe("object");
    expect(returnData.testKey).toMatch("testValue");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/28
  // https://github.com/darryl-snow/age-gate-js/issues/29
  it("Should be able to clear an age gate cookie", () => {

    ageGate = new AgeGate();

    let testData = {
      testKey: "testValue"
    };

    document.cookie = "age-gate=" + JSON.stringify(testData);

    ageGate.clearCookie();

    expect(document.cookie.indexOf("age-gate")).toBe(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/36
  it(`Should be able to configure the name and expiry date of the age gate
     cookie`, () => {

    let yesterday = new Date(new Date() - (1000 * 60 * 60 * 24));
    let tomorrow = new Date(new Date() + (1000 * 60 * 60 * 24));

    // TODO: find a way to test the timing of the cookie that's been set,
    // given that you can't set a cookie with an expiry date in the past
    // ageGate = new AgeGate({
    //   cookie: {
    //     name: "testName1",
    //     expiry: yesterday.toUTCString()
    //   }
    // });
    //
    // ageGate.saveCookie({});
    //
    // expect(document.cookie.indexOf("testName1")).toBe(-1);
    //
    // clearCookies();

    ageGate = new AgeGate({
      cookie: {
        name: "testName2",
        expiry: tomorrow.toUTCString()
      }
    });

    ageGate.saveCookie({});

    expect(document.cookie.indexOf("testName2")).not.toBe(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/28
  // https://github.com/darryl-snow/age-gate-js/issues/29
  it(`Should be able to determine whether to show the age gate based on the
     cookie value`, () => {

    ageGate = new AgeGate();

    let testData = {
      passed: true
    };

    ageGate.saveCookie(testData);

    expect(ageGate.shouldShowAgeGate()).toBe(false);

    testData = {
      passed: false
    };

    ageGate.saveCookie(testData);

    expect(ageGate.shouldShowAgeGate()).toBe(true);

  });

});
