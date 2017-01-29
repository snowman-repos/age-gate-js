import ModalContent from "./modal-content";

describe("Modal Content", () => {

  let testId = "testId";

  /**
   * Helper function to get the relevant element from inside the container,
   * because the modal content class generates a container element that serves
   * as a row inside the modal dialog, with the relevant element inside. Inside
   * the container may be other elements, such as error notifications, so we
   * need to be able to find the relevant element to test.
   * @param {object} The HTML node for the container element.
   * @param {string} The ID of the element to be tested.
   * @return {object} The HTML node for the element to be tested.
   */
  function getChild(el, id) {

    let child = null;

    for(let i = 0; i < el.children.length; i++) {

      if(el.children[i].id === id) {
        child = el.children[i];
      }

    }

    return child;

  }

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Must have an ID attribute specified", () => {

    let newRow = new ModalContent();

    expect(newRow.tagName).toBe(undefined);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should create a container element", () => {

    let newRow = new ModalContent({
      id: testId,
      tagName: "p"
    });

    expect(newRow.tagName).toMatch("DIV");
    expect(newRow.className.indexOf("ag-modal-content-row")).not.toBe(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should be able to specify a tagName", () => {

    let newRow = new ModalContent({
      id: testId,
      tagName: "p"
    });

    expect(getChild(newRow, testId).tagName).toMatch("P");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should be able to specify the content", () => {

    let testContent = "this is a test";

    let newRow = new ModalContent({
      id: testId,
      content: testContent
    });

    expect(getChild(newRow, testId).innerHTML).toMatch(testContent);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should be able to insert HTML content", () => {

    let testContent = `This is <em>italic text</em> and this is <strong>bold
     text</strong> and this is <a href="http://google.com">a link</a>, while
      <span style="text-decoration: underline;">this is underlined</span>.`;

    let newRow = new ModalContent({
      id: testId,
      content: testContent
    });

    let child = getChild(newRow, testId);

    expect(child.innerHTML).toMatch(testContent);
    expect(child.querySelectorAll('em').length).toEqual(1);
    expect(child.querySelectorAll('strong').length).toEqual(1);
    expect(child.querySelectorAll('a').length).toEqual(1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should be able to apply a single attribute", () => {

    let newRow = new ModalContent({
      id: testId,
      attributes: {
        testkey: "testValue"
      }
    });

    let child = getChild(newRow, testId);

    expect(child.hasAttribute("testkey")).toBe(true);
    expect(child.getAttribute("testkey")).toMatch("testValue");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should be able to apply multiple attributes", () => {

    let newRow = new ModalContent({
      id: testId,
      attributes: {
        testkey1: "testValue1",
        testkey2: "testValue2",
        testkey3: "testValue3"
      }
    });

    let child = getChild(newRow, testId);

    expect(child.hasAttribute("testkey1")).toBe(true);
    expect(child.getAttribute("testkey1")).toMatch("testValue1");
    expect(child.hasAttribute("testkey2")).toBe(true);
    expect(child.getAttribute("testkey2")).toMatch("testValue2");
    expect(child.hasAttribute("testkey3")).toBe(true);
    expect(child.getAttribute("testkey3")).toMatch("testValue3");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should be able to apply a single class", () => {

    let newRow = new ModalContent({
      id: testId,
      classes: [
        "class1"
      ]
    });

    let child = getChild(newRow, testId);

    expect(child.classList.contains("class1")).toBe(true);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should be able to apply multiple classes", () => {

    let newRow = new ModalContent({
      id: testId,
      classes: [
        "class1",
        "class2",
        "class3"
      ]
    });

    let child = getChild(newRow, testId);

    expect(child.classList.contains("class1")).toBe(true);
    expect(child.classList.contains("class2")).toBe(true);
    expect(child.classList.contains("class3")).toBe(true);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/8
  it("Should be able to generate a title element", () => {

    let testContent = "This is a title";

    let newRow = new ModalContent({
      id: "ag-title",
      tagName: "h1",
      content: testContent
    });

    let child = getChild(newRow, "ag-title");

    expect(child.tagName).toMatch("H1");
    expect(child.innerHTML).toMatch(testContent);
    expect(child.className.indexOf("ag-title")).not.toBe(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/9
  it("Should be able to generate a intro element", () => {

    let testContent = `This is <em>italic text</em> and this is <strong>bold
     text</strong> and this is <a href="http://google.com">a link</a>, while
      <span style="text-decoration: underline;">this is underlined</span>.`;

    let newRow = new ModalContent({
      id: "ag-intro",
      tagName: "p",
      content: testContent
    });

    let child = getChild(newRow, "ag-intro");

    expect(child.tagName).toMatch("P");
    expect(child.innerHTML).toMatch(testContent);
    expect(child.className.indexOf("ag-intro")).not.toBe(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/9
  it("Should be able to generate an image element", () => {

    let newRow = new ModalContent({
      id: "ag-image",
      tagName: "img",
      attributes: {
        src: "http://www.underconsideration.com/brandnew/archives/google_2015_logo_detail.png",
        alt: "This is the alt text"
      }
    });

    let child = getChild(newRow, "ag-image");

    expect(child.tagName).toMatch("IMG");
    expect(child.className.indexOf("ag-image")).not.toBe(-1);
    expect(child.getAttribute("src")).toMatch("http://www.underconsideration.com/brandnew/archives/google_2015_logo_detail.png");
    expect(child.getAttribute("alt")).toMatch("This is the alt text");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/11
  it("Should be able to generate a checkbox element", () => {

    let newRow = new ModalContent({
      id: "ag-checkbox-container",
      tagName: "label",
      attributes: {
        for: "ag-checkbox"
      },
      content: "<input id='ag-checkbox' name='ag-checkbox' type='checkbox' /><span>This is the checkbox label</span>"
    });

    let child = getChild(newRow, "ag-checkbox-container");

    expect(child.tagName).toMatch("LABEL");
    expect(child.className.indexOf("ag-checkbox-container")).not.toBe(-1);
    expect(child.getAttribute("for")).toMatch("ag-checkbox");
    expect(child.querySelectorAll('input').length).toEqual(1);
    expect(child.querySelectorAll('input')[0].id).toMatch("ag-checkbox");
    expect(child.querySelectorAll('input')[0].getAttribute("name")).toMatch("ag-checkbox");
    expect(child.querySelectorAll('input')[0].getAttribute("type")).toMatch("checkbox");
    expect(child.querySelectorAll('span').length).toEqual(1);


  });

  // https://github.com/darryl-snow/age-gate-js/issues/12
  it("Should be able to generate a radio element", () => {

    let newRow = new ModalContent({
      id: "ag-radio-container",
      tagName: "div",
      content: `
        <input id='ag-radio1' name='ag-radio' type='radio' value='legal' />
        <label for='ag-radio1'>Option 1</label>
        <input id='ag-radio2' name='ag-radio' type='radio' value='illegal' />
        <label for='ag-radio2'>Option 2</label>`
    });

    let child = getChild(newRow, "ag-radio-container");

    expect(child.tagName).toMatch("DIV");
    expect(child.className.indexOf("ag-radio-container")).not.toBe(-1);
    expect(child.querySelectorAll('input').length).toEqual(2);
    expect(child.querySelectorAll('label').length).toEqual(2);
    expect(child.querySelectorAll('label')[0].getAttribute("for")).toMatch("ag-radio1");
    expect(child.querySelectorAll('label')[1].getAttribute("for")).toMatch("ag-radio2");
    expect(child.querySelectorAll('input')[0].id).toMatch("ag-radio1");
    expect(child.querySelectorAll('input')[1].id).toMatch("ag-radio2");
    expect(child.querySelectorAll('input')[0].getAttribute("name")).toMatch("ag-radio");
    expect(child.querySelectorAll('input')[1].getAttribute("name")).toMatch("ag-radio");
    expect(child.querySelectorAll('input')[0].getAttribute("type")).toMatch("radio");
    expect(child.querySelectorAll('input')[1].getAttribute("type")).toMatch("radio");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/17
  it("Should be able to generate a country select element", () => {

    let newRow = new ModalContent({
      id: "ag-country-container",
      tagName: "div",
      content: `
        <label for='ag-country'>Select the country you are in:</label>
        <select id='ag-country'>
          <option value='country'>Country</option>
        </select>`
    });

    let child = getChild(newRow, "ag-country-container");

    expect(child.tagName).toMatch("DIV");
    expect(child.className.indexOf("ag-country-container")).not.toBe(-1);
    expect(child.querySelectorAll('label').length).toEqual(1);
    expect(child.querySelectorAll('select').length).toEqual(1);
    expect(child.querySelectorAll('select')[0].id).toMatch("ag-country");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/18
  it("Should be able to generate a language select element", () => {

    let newRow = new ModalContent({
      id: "ag-language-container",
      tagName: "div",
      content: `
        <label for='ag-language'>Select your language:</label>
        <select id='ag-language'>
          <option value='language'>Language</option>
        </select>`
    });

    let child = getChild(newRow, "ag-language-container");

    expect(child.tagName).toMatch("DIV");
    expect(child.className.indexOf("ag-language-container")).not.toBe(-1);
    expect(child.querySelectorAll('label').length).toEqual(1);
    expect(child.querySelectorAll('select').length).toEqual(1);
    expect(child.querySelectorAll('select')[0].id).toMatch("ag-language");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/19
  it("Should be able to generate a button element", () => {

    let newRow = new ModalContent({
      id: "ag-button-container",
      tagName: "div",
      content: `
        <button id='ag-button'>Verify age</button>`
    });

    let child = getChild(newRow, "ag-button-container");

    expect(child.tagName).toMatch("DIV");
    expect(child.className.indexOf("ag-button-container")).not.toBe(-1);
    expect(child.querySelectorAll('button').length).toEqual(1);
    expect(child.querySelectorAll('button')[0].id).toMatch("ag-button");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/20
  it("Should be able to generate a disclaimer element", () => {

    let newRow = new ModalContent({
      id: "ag-disclaimer",
      tagName: "p",
      content: `This is <em>italic text</em> and this is <strong>bold
       text</strong> and this is <a href="http://google.com">a link</a>, while
        <span style="text-decoration: underline;">this is underlined</span>.`
    });

    let child = getChild(newRow, "ag-disclaimer");

    expect(child.tagName).toMatch("P");
    expect(child.className.indexOf("ag-disclaimer")).not.toBe(-1);
    expect(child.querySelectorAll('em').length).toEqual(1);
    expect(child.querySelectorAll('strong').length).toEqual(1);
    expect(child.querySelectorAll('a').length).toEqual(1);
    expect(child.querySelectorAll('span').length).toEqual(1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/14
  it("Should be able to generate a day input element", () => {

    let newRow = new ModalContent({
      id: "ag-day-container",
      tagName: "div",
      content: `<span>This is an error notification</span><input id="ag-day"
       name="ag-day" type="text" />`
    });

    let child = getChild(newRow, "ag-day-container");

    expect(child.tagName).toMatch("DIV");
    expect(child.className.indexOf("ag-day-container")).not.toBe(-1);
    expect(child.querySelectorAll('span').length).toEqual(1);
    expect(child.querySelectorAll('input').length).toEqual(1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/15
  it("Should be able to generate a month input element", () => {

    let newRow = new ModalContent({
      id: "ag-month-container",
      tagName: "div",
      content: `<span>This is an error notification</span><input id="ag-month"
       name="ag-month" type="text" />`
    });

    let child = getChild(newRow, "ag-month-container");

    expect(child.tagName).toMatch("DIV");
    expect(child.className.indexOf("ag-month-container")).not.toBe(-1);
    expect(child.querySelectorAll('span').length).toEqual(1);
    expect(child.querySelectorAll('input').length).toEqual(1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/16
  it("Should be able to generate a year input element", () => {

    let newRow = new ModalContent({
      id: "ag-year-container",
      tagName: "div",
      content: `<span>This is an error notification</span><input id="ag-year"
       name="ag-year" type="text" />`
    });

    let child = getChild(newRow, "ag-year-container");

    expect(child.tagName).toMatch("DIV");
    expect(child.className.indexOf("ag-year-container")).not.toBe(-1);
    expect(child.querySelectorAll('span').length).toEqual(1);
    expect(child.querySelectorAll('input').length).toEqual(1);

  });

});
