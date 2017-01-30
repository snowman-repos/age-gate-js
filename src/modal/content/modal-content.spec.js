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

  // https://github.com/darryl-snow/age-gate-js/issues/8
  it("Should be able to generate a title element", () => {

    let testContent = "This is a title";

    let el = new ModalContent({
      id: "ag-title",
      tagName: "h1",
      content: testContent
    });

    expect(el.tagName).toMatch("H1");
    expect(el.innerHTML).toMatch(testContent);
    expect(el.className.indexOf("ag-title")).not.toBe(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/9
  it("Should be able to generate a intro element", () => {

    let testContent = `This is <em>italic text</em> and this is <strong>bold
     text</strong> and this is <a href="http://google.com">a link</a>, while
      <span style="text-decoration: underline;">this is underlined</span>.`;

    let el = new ModalContent({
      id: "ag-intro",
      tagName: "p",
      content: testContent
    });

    expect(el.tagName).toMatch("P");
    expect(el.innerHTML).toMatch(testContent);
    expect(el.className.indexOf("ag-intro")).not.toBe(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/9
  it("Should be able to generate an image element", () => {

    let el = new ModalContent({
      id: "ag-image",
      tagName: "img",
      attributes: {
        src: "http://www.underconsideration.com/brandnew/archives/google_2015_logo_detail.png",
        alt: "This is the alt text"
      }
    });

    expect(el.tagName).toMatch("IMG");
    expect(el.className.indexOf("ag-image")).not.toBe(-1);
    expect(el.getAttribute("src")).toMatch("http://www.underconsideration.com/brandnew/archives/google_2015_logo_detail.png");
    expect(el.getAttribute("alt")).toMatch("This is the alt text");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/11
  it("Should be able to generate a checkbox element", () => {

    let el = new ModalContent({
      id: "ag-checkbox-container",
      tagName: "label",
      attributes: {
        for: "ag-checkbox"
      },
      content: "<input id='ag-checkbox' name='ag-checkbox' type='checkbox' /><span>This is the checkbox label</span>"
    });

    expect(el.tagName).toMatch("LABEL");
    expect(el.className.indexOf("ag-checkbox-container")).not.toBe(-1);
    expect(el.getAttribute("for")).toMatch("ag-checkbox");
    expect(el.querySelectorAll('input').length).toEqual(1);
    expect(el.querySelectorAll('input')[0].id).toMatch("ag-checkbox");
    expect(el.querySelectorAll('input')[0].getAttribute("name")).toMatch("ag-checkbox");
    expect(el.querySelectorAll('input')[0].getAttribute("type")).toMatch("checkbox");
    expect(el.querySelectorAll('span').length).toEqual(1);


  });

  // https://github.com/darryl-snow/age-gate-js/issues/12
  it("Should be able to generate a radio element", () => {

    let el = new ModalContent({
      id: "ag-radio-container",
      tagName: "div",
      content: `
        <input id='ag-radio1' name='ag-radio' type='radio' value='legal' />
        <label for='ag-radio1'>Option 1</label>
        <input id='ag-radio2' name='ag-radio' type='radio' value='illegal' />
        <label for='ag-radio2'>Option 2</label>`
    });

    expect(el.tagName).toMatch("DIV");
    expect(el.className.indexOf("ag-radio-container")).not.toBe(-1);
    expect(el.querySelectorAll('input').length).toEqual(2);
    expect(el.querySelectorAll('label').length).toEqual(2);
    expect(el.querySelectorAll('label')[0].getAttribute("for")).toMatch("ag-radio1");
    expect(el.querySelectorAll('label')[1].getAttribute("for")).toMatch("ag-radio2");
    expect(el.querySelectorAll('input')[0].id).toMatch("ag-radio1");
    expect(el.querySelectorAll('input')[1].id).toMatch("ag-radio2");
    expect(el.querySelectorAll('input')[0].getAttribute("name")).toMatch("ag-radio");
    expect(el.querySelectorAll('input')[1].getAttribute("name")).toMatch("ag-radio");
    expect(el.querySelectorAll('input')[0].getAttribute("type")).toMatch("radio");
    expect(el.querySelectorAll('input')[1].getAttribute("type")).toMatch("radio");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/17
  it("Should be able to generate a country select element", () => {

    let el = new ModalContent({
      id: "ag-country-container",
      tagName: "div",
      content: `
        <label for='ag-country'>Select the country you are in:</label>
        <select id='ag-country'>
          <option value='country'>Country</option>
        </select>`
    });

    expect(el.tagName).toMatch("DIV");
    expect(el.className.indexOf("ag-country-container")).not.toBe(-1);
    expect(el.querySelectorAll('label').length).toEqual(1);
    expect(el.querySelectorAll('select').length).toEqual(1);
    expect(el.querySelectorAll('select')[0].id).toMatch("ag-country");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/18
  it("Should be able to generate a language select element", () => {

    let el = new ModalContent({
      id: "ag-language-container",
      tagName: "div",
      content: `
        <label for='ag-language'>Select your language:</label>
        <select id='ag-language'>
          <option value='language'>Language</option>
        </select>`
    });

    expect(el.tagName).toMatch("DIV");
    expect(el.className.indexOf("ag-language-container")).not.toBe(-1);
    expect(el.querySelectorAll('label').length).toEqual(1);
    expect(el.querySelectorAll('select').length).toEqual(1);
    expect(el.querySelectorAll('select')[0].id).toMatch("ag-language");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/19
  it("Should be able to generate a button element", () => {

    let el = new ModalContent({
      id: "ag-button-container",
      tagName: "div",
      content: `
        <button id='ag-button'>Verify age</button>`
    });

    expect(el.tagName).toMatch("DIV");
    expect(el.className.indexOf("ag-button-container")).not.toBe(-1);
    expect(el.querySelectorAll('button').length).toEqual(1);
    expect(el.querySelectorAll('button')[0].id).toMatch("ag-button");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/20
  it("Should be able to generate a disclaimer element", () => {

    let el = new ModalContent({
      id: "ag-disclaimer",
      tagName: "p",
      content: `This is <em>italic text</em> and this is <strong>bold
       text</strong> and this is <a href="http://google.com">a link</a>, while
        <span style="text-decoration: underline;">this is underlined</span>.`
    });

    expect(el.tagName).toMatch("P");
    expect(el.className.indexOf("ag-disclaimer")).not.toBe(-1);
    expect(el.querySelectorAll('em').length).toEqual(1);
    expect(el.querySelectorAll('strong').length).toEqual(1);
    expect(el.querySelectorAll('a').length).toEqual(1);
    expect(el.querySelectorAll('span').length).toEqual(1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/14
  it("Should be able to generate a day input element", () => {

    let el = new ModalContent({
      id: "ag-day-container",
      tagName: "div",
      content: `<span>This is an error notification</span><input id="ag-day"
       name="ag-day" type="text" />`
    });

    expect(el.tagName).toMatch("DIV");
    expect(el.className.indexOf("ag-day-container")).not.toBe(-1);
    expect(el.querySelectorAll('span').length).toEqual(1);
    expect(el.querySelectorAll('input').length).toEqual(1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/15
  it("Should be able to generate a month input element", () => {

    let el = new ModalContent({
      id: "ag-month-container",
      tagName: "div",
      content: `<span>This is an error notification</span><input id="ag-month"
       name="ag-month" type="text" />`
    });

    expect(el.tagName).toMatch("DIV");
    expect(el.className.indexOf("ag-month-container")).not.toBe(-1);
    expect(el.querySelectorAll('span').length).toEqual(1);
    expect(el.querySelectorAll('input').length).toEqual(1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/16
  it("Should be able to generate a year input element", () => {

    let el = new ModalContent({
      id: "ag-year-container",
      tagName: "div",
      content: `<span>This is an error notification</span><input id="ag-year"
       name="ag-year" type="text" />`
    });

    expect(el.tagName).toMatch("DIV");
    expect(el.className.indexOf("ag-year-container")).not.toBe(-1);
    expect(el.querySelectorAll('span').length).toEqual(1);
    expect(el.querySelectorAll('input').length).toEqual(1);

  });

});
