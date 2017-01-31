import ModalContent from "./modal-content";

describe("Modal Content", () => {

  let testId = "testId";

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Must have an ID attribute specified", () => {

    let el = new ModalContent();

    expect(el.tagName).toBe(undefined);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should be able to specify a tagName", () => {

    let el = new ModalContent({
      id: testId,
      tagName: "p"
    });

    expect(el.tagName).toMatch("P");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should be able to specify the content", () => {

    let testContent = "this is a test";

    let el = new ModalContent({
      id: testId,
      content: testContent
    });

    expect(el.innerHTML).toMatch(testContent);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should be able to insert HTML content", () => {

    let testContent = `This is <em>italic text</em> and this is <strong>bold
     text</strong> and this is <a href="http://google.com">a link</a>, while
      <span style="text-decoration: underline;">this is underlined</span>.`;

    let el = new ModalContent({
      id: testId,
      content: testContent
    });

    expect(el.innerHTML).toMatch(testContent);
    expect(el.querySelectorAll('em').length).toEqual(1);
    expect(el.querySelectorAll('strong').length).toEqual(1);
    expect(el.querySelectorAll('a').length).toEqual(1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should be able to apply a single attribute", () => {

    let el = new ModalContent({
      id: testId,
      attributes: {
        testkey: "testValue"
      }
    });

    expect(el.hasAttribute("testkey")).toBe(true);
    expect(el.getAttribute("testkey")).toMatch("testValue");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should be able to apply multiple attributes", () => {

    let el = new ModalContent({
      id: testId,
      attributes: {
        testkey1: "testValue1",
        testkey2: "testValue2",
        testkey3: "testValue3"
      }
    });

    expect(el.hasAttribute("testkey1")).toBe(true);
    expect(el.getAttribute("testkey1")).toMatch("testValue1");
    expect(el.hasAttribute("testkey2")).toBe(true);
    expect(el.getAttribute("testkey2")).toMatch("testValue2");
    expect(el.hasAttribute("testkey3")).toBe(true);
    expect(el.getAttribute("testkey3")).toMatch("testValue3");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should be able to apply a single class", () => {

    let el = new ModalContent({
      id: testId,
      classes: [
        "class1"
      ]
    });

    expect(el.classList.contains("class1")).toBe(true);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should be able to apply multiple classes", () => {

    let el = new ModalContent({
      id: testId,
      classes: [
        "class1",
        "class2",
        "class3"
      ]
    });

    expect(el.classList.contains("class1")).toBe(true);
    expect(el.classList.contains("class2")).toBe(true);
    expect(el.classList.contains("class3")).toBe(true);

  });

});
