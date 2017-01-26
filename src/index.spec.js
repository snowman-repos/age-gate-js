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

});
