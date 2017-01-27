import Title from "./title";

describe("Modal Content: Title", () => {

  // https://github.com/darryl-snow/age-gate-js/issues/8
  it("Should return a heading element", () => {

    let title = new Title();

    expect(typeof(title)).toBe("object");
    expect(title.tagName).toBe("H1");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/8
  it("Should be able to set the text in the title", () => {

    let title = new Title();
    expect(title.textContent).toBe("undefined");

    let testPhrase = "Testing1 2 3";
    title = new Title({
      content: testPhrase
    });

    expect(title.textContent).toMatch(testPhrase);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/8
  it("Should be able to add a single class to the title", () => {

    let testClass = "testClass";
    let title = new Title({
      classes: testClass
    });

    expect(title.classList.contains(testClass)).toBe(true);

  });

});
