import AgeGate from "./index";

describe("Age Gate", () => {

  let ageGate = null;

  // Setup a fresh age gate before each test
  beforeEach(() => {

    ageGate = new AgeGate();

  });

  // Reset the modal after each test
  afterEach(() => {

    document.body.innerHTML = "";
    ageGate = null;

  });

  it("Should create an Age Gate container div with ID ag-root", () => {

    let result = ageGate.createContainer();

    expect(result.tagName).toBe("DIV");
    expect(result.id).toBe("ag-root");

  });

});
