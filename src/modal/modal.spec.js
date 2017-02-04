import Modal from "./modal";

describe("Modal", () => {

  let ageGate, modal, body, content, curtain, dialog, dummyContent = null;

  beforeAll(() => {

    // Before all tests, create a container element for the age gate
    // that we can append the modal to
    ageGate = document.createElement("div");
    ageGate.id = "ag-root";

    // Append some dummy page content
    // NOTE: we give the container an arbitrary z-index value
    // so we can test against this later
    document.body.innerHTML = `
      <div class="container" id="dummy-content" style="z-index: 10;">
        <h1>Hello World</h1>
        <p>This is a test</p>
        <a href="" id="dummy-link">test link</a>
      </div>
    `;

    document.body.appendChild(ageGate);
    body = document.body;
    dummyContent = document.getElementById("dummy-content");

  });

  // Setup a fresh modal before each test and save references
  // to the curtain and dialog elements
  beforeEach(() => {

    modal = new Modal({
      wrapper: ageGate
    });
    content = document.getElementById("ag-modal-content");
    curtain = document.getElementById("ag-modal-curtain");
    dialog = document.getElementById("ag-modal-dialog");

  });

  // Reset the modal after each test
  afterEach(() => {

    ageGate.innerHTML = "";
    body.className = "";
    modal = null;

  });

  // https://github.com/darryl-snow/age-gate-js/issues/43
  it(`Should append the modal main elements to the body if no wrapper is
     specified`, () => {

    // Reset the modal
    ageGate.innerHTML = "";
    modal = null;

    // Modal with no wrapper specified
    modal = new Modal();

    let el = document.getElementById("ag-modal-curtain");
    expect(el.parentNode).toBe(document.body);

    // Remove the curtain from the body so as not to impact subsequent tests
    document.body.removeChild(el);

    el = document.getElementById("ag-modal-dialog");
    expect(el.parentNode).toBe(document.body);

    // Remove the curtain from the body so as not to impact subsequent tests
    document.body.removeChild(el);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/43
  it(`Should append the modal main elements to the wrapper if one is
     specified`, () => {

    ageGate.innerHTML = "";
    modal = null;

    modal = new Modal({
      wrapper: ageGate
    });

    let el = document.getElementById("ag-modal-curtain");
    expect(el.parentNode).toBe(ageGate);

    el = document.getElementById("ag-modal-dialog");
    expect(el.parentNode).toBe(ageGate);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/5
  it("Should add a curtain element to the age gate", () => {

    expect(curtain.length).not.toBe(0);
    expect(curtain.parentElement.id).toBe("ag-root");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/6
  it("Should add a dialog element to the age gate", () => {

    expect(dialog.length).not.toBe(0);
    expect(dialog.parentElement.id).toBe("ag-root");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/5
  // https://github.com/darryl-snow/age-gate-js/issues/6
  it("Should find the highest z-index on the page", () => {

    // 13 because we gave the page content a z-index of 10
    // (see beforeAll), then the curtain, dialog, and content
    // should each be 1 level up: 10 + 1 + 1 = 13 = the content
    // z-index
    expect(modal.getHighestZIndex()).toEqual(13);

    // Remove the curtain and dialog from the DOM
    ageGate.innerHTML = "";

    // Now the highest z-index should be that of the dummy content
    expect(modal.getHighestZIndex()).toEqual(10);

    // Create a new element at the end of the document with
    // a smaller z-index
    let el = document.createElement("div");
    el.style.zIndex = 5;
    document.body.appendChild(el);

    // The highest z-index should __still__ be that of the
    // original dummy content; this new element should have
    // no impact
    expect(modal.getHighestZIndex()).toEqual(10);

    // Give the new element a new z-index that's higher than
    // that of the original dummy content
    el.style.zIndex = 100;

    // Now the highest z-index should be that of the new
    // element
    expect(modal.getHighestZIndex()).toEqual(100);

    // Remove the new element
    el.parentElement.removeChild(el);

    // Re-initialise a modal
    modal = new Modal({
      wrapper: ageGate
    });

    // Now the highest z-index should be the same as it was
    // at the start: original dummy content z-index (10) + curtain
    // z-index increment (1) + dialog z-index increment (1)  +
    // content z-index increment (1) = 13
    expect(modal.getHighestZIndex()).toEqual(13);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/5
  it("Should place the curtain element above anything else on the page", () => {

    // -2 because the dialog and modal content should be higher
    expect(Number(curtain.style.zIndex)).toEqual(modal.getHighestZIndex() - 2);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/6
  it("Should place the dialog element above the curtain", () => {

    let dialogZIndex = Number(dialog.style.zIndex);
    let curtainZIndex = Number(curtain.style.zIndex);

    expect(dialogZIndex).toBeGreaterThan(curtainZIndex);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/5
  // TODO: test that the curtain stretches to cover the viewport height
  it(`Should stretch the curtain element to the entire viewport width,
     minus the scrollbar`, () => {

    let viewportWidth = Math.max(document.documentElement.clientWidth,
      window.innerWidth || 0);
    // let viewportHeight = Math.max(document.documentElement.clientHeight,
    // window.innerHeight || 0);
    let curtainWidth = window.getComputedStyle(curtain, null).width;
    curtainWidth = curtainWidth.substr(0, curtainWidth.length-2);
    expect(Number(curtainWidth)).toEqual(viewportWidth - 16);


  });

  // https://github.com/darryl-snow/age-gate-js/issues/43
  it("Should check against a set list of allowed main elements", () => {

    expect(modal.mainElementIsNotAllowed("testing123")).toBe(true);
    expect(modal.mainElementIsNotAllowed("@££$%&^")).toBe(true);
    expect(modal.mainElementIsNotAllowed("")).toBe(true);
    expect(modal.mainElementIsNotAllowed("content")).toBe(false);
    expect(modal.mainElementIsNotAllowed("curtain")).toBe(false);
    expect(modal.mainElementIsNotAllowed("dialog")).toBe(false);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/43
  it("Should check that main elements have not already been created", () => {

    expect(modal.mainElementsAlreadyExist()).toBe(true);
    modal.el = null;
    expect(modal.mainElementsAlreadyExist()).toBe(false);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/43
  it(`Should only be able to append so-named curtain, dialog, or content
     elements to the modal`, () => {

    let el, result = null;

    modal.el.mainElements = null;
    ageGate.innerHTML = "";

    // Try to append an element other than curtain or dialog
    // It should **not** be able to append such an element
    let testPhrase = "testing123";
    result = modal.createMainElement({
      ariaHidden: "true",
      className: testPhrase,
      id: "ag-modal-" + testPhrase,
      name: testPhrase,
      parent: ageGate,
      role: "",
      tabindex: -1,
      tagName: "div",
      zindex: 1
    });
    el = document.querySelectorAll("#ag-modal-" + testPhrase);
    expect(el.length).toBe(0);
    expect(result).toBe(false);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/5
  it("Should not add a curtain element if there is one already", () => {

    let result = modal.createMainElement({
      ariaHidden: "true",
      className: "agModalCurtain",
      id: "ag-modal-curtain",
      name: "curtain",
      parent: ageGate,
      role: "",
      tabindex: -1,
      tagName: "div",
      zindex: 1
    });
    expect(result).toBe(false);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/6
  it("Should not add a dialog element if there is one already", () => {

    let result = modal.createMainElement({
      ariaHidden: "true",
      className: "agModalDialog",
      id: "ag-modal-dialog",
      name: "dialog",
      parent: ageGate,
      role: "dialog",
      tabindex: -1,
      tagName: "div",
      zindex: 1
    });
    expect(result).toBe(false);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/5
  it("Should not show the curtain element or lock the body by default", () => {

    expect(body.className.indexOf("is-locked")).toEqual(-1);
    expect(curtain.className.indexOf("is-shown")).toEqual(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/5
  it("Should not show the dialog element by default", () => {

    expect(dialog.className.indexOf("is-shown")).toEqual(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/5
  // https://github.com/darryl-snow/age-gate-js/issues/6
  // https://github.com/darryl-snow/age-gate-js/issues/7
  it(`Should be able to toggle the control classes on the body,
    and the curtain, dialog, and content elements`, () => {

    // State control classes are applied to the body, the
    // curtain, and the dialog elements
    // The modal is not shown by default so these state
    // control classes should not be applied
    expect(body.className.indexOf("is-locked")).toEqual(-1);
    expect(content.className.indexOf("is-shown")).toEqual(-1);
    expect(curtain.className.indexOf("is-shown")).toEqual(-1);
    expect(dialog.className.indexOf("is-shown")).toEqual(-1);

    modal.toggleClasses();

    // After calling the toggleClasses function, the state
    // control classes should be applied
    expect(body.className.indexOf("is-locked")).not.toEqual(-1);
    expect(content.className.indexOf("is-shown")).not.toEqual(-1);
    expect(curtain.className.indexOf("is-shown")).not.toEqual(-1);
    expect(dialog.className.indexOf("is-shown")).not.toEqual(-1);

    modal.toggleClasses();

    // After calling the toggleClasses function again, the state
    // control classes __should__ be applied
    expect(body.className.indexOf("is-locked")).toEqual(-1);
    expect(content.className.indexOf("is-shown")).toEqual(-1);
    expect(curtain.className.indexOf("is-shown")).toEqual(-1);
    expect(dialog.className.indexOf("is-shown")).toEqual(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/43
  it("Should be able to show the modal", () => {

    expect(body.className.indexOf("is-locked")).toEqual(-1);
    expect(content.className.indexOf("is-shown")).toEqual(-1);
    expect(curtain.className.indexOf("is-shown")).toEqual(-1);
    expect(dialog.className.indexOf("is-shown")).toEqual(-1);
    expect(modal.state.shown).toBe(false);

    modal.show();

    expect(body.className.indexOf("is-locked")).not.toEqual(-1);
    expect(content.className.indexOf("is-shown")).not.toEqual(-1);
    expect(curtain.className.indexOf("is-shown")).not.toEqual(-1);
    expect(dialog.className.indexOf("is-shown")).not.toEqual(-1);
    expect(modal.state.shown).toBe(true);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/43
  it("Should be able to hide the modal", () => {

    modal.show();

    expect(body.className.indexOf("is-locked")).not.toEqual(-1);
    expect(content.className.indexOf("is-shown")).not.toEqual(-1);
    expect(curtain.className.indexOf("is-shown")).not.toEqual(-1);
    expect(dialog.className.indexOf("is-shown")).not.toEqual(-1);
    expect(modal.state.shown).toBe(true);

    modal.hide();

    expect(body.className.indexOf("is-locked")).toEqual(-1);
    expect(content.className.indexOf("is-shown")).toEqual(-1);
    expect(curtain.className.indexOf("is-shown")).toEqual(-1);
    expect(dialog.className.indexOf("is-shown")).toEqual(-1);
    expect(modal.state.shown).toBe(false);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/5
  it(`Should give the curtain a tabindex of -1 so that it
     cannot be focused`, () => {

    expect(Number(curtain.getAttribute('tabindex'))).toEqual(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/6
  it(`Should give the dialog a tabindex of -1 so that it
     cannot be focused`, () => {

    expect(Number(dialog.getAttribute('tabindex'))).toEqual(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it(`Should give the modal content a tabindex of 0 so that it
     can be focused`, () => {

    expect(Number(content.getAttribute('tabindex'))).toEqual(0);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/5
  // https://github.com/darryl-snow/age-gate-js/issues/6
  // https://github.com/darryl-snow/age-gate-js/issues/7
  it(`Should be able to toggle the aria-hidden attribute on the curtain,
     dialog, and content elements`, () => {

    // Expect it to be true because the dialog is hiden by default
    expect(curtain.getAttribute("aria-hidden")).toBe("true");
    expect(dialog.getAttribute("aria-hidden")).toBe("true");
    expect(dialog.getAttribute("aria-hidden")).toBe("true");

    modal.state.shown = true;
    modal.toggleAriaHidden();

    expect(curtain.getAttribute("aria-hidden")).toBe("false");
    expect(dialog.getAttribute("aria-hidden")).toBe("false");
    expect(dialog.getAttribute("aria-hidden")).toBe("false");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/5
  it(`Should set aria-hidden='true' when the curtain is hidden and
   aria-hidden='false' when the curtain is shown`, () => {

    // Expect it to be true because the curtain is hiden by default
    expect(curtain.getAttribute('aria-hidden')).toBe("true");

    modal.show();

    expect(curtain.getAttribute('aria-hidden')).toBe("false");

    modal.hide();

    expect(curtain.getAttribute('aria-hidden')).toBe("true");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/6
  it(`Should set aria-hidden='true' when the dialog is hidden and
   aria-hidden='false' when the dialog is shown`, () => {

    // Expect it to be true because the dialog is hiden by default
    expect(dialog.getAttribute('aria-hidden')).toBe("true");

    modal.show();

    expect(dialog.getAttribute('aria-hidden')).toBe("false");

    modal.hide();

    expect(dialog.getAttribute('aria-hidden')).toBe("true");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/6
  it("Should give the dialog a role='dialog' attribute", () => {

    expect(dialog.getAttribute("role")).toBe("dialog");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should create a modal content element", () => {

    expect(content.length).not.toBe(0);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should not create a modal content element if there is one already", () => {

    let result = modal.createMainElement({
      ariaHidden: "true",
      className: "agModalContent",
      id: "ag-modal-content",
      name: "content",
      parent: ageGate,
      role: "document",
      tabindex: 0,
      tagName: "div",
      zindex: 1
    });
    expect(result).toBe(false);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should append the modal content element to the modal dialog", () => {

    expect(content.parentElement.id).toBe("ag-modal-dialog");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should give the modal content element role='document'", () => {

    expect(content.getAttribute("role")).toBe("document");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it(`Should set aria-hidden='true' when the modal content element is hidden and
   aria-hidden='false' when the modal content element is shown`, () => {

    // Expect it to be true because the content is hiden by default
    expect(content.getAttribute('aria-hidden')).toBe("true");

    modal.show();

    expect(content.getAttribute('aria-hidden')).toBe("false");

    modal.hide();

    expect(content.getAttribute('aria-hidden')).toBe("true");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should give focus to the modal content element when it appears", () => {

    modal.show();

    expect(document.activeElement.id).toBe("ag-modal-content");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it(`Should return focus to the previously focused element when the modal is
     closed`, () => {

    let dummyLink = dummyContent.querySelector("#dummy-link");

    // At first, nothing should be focused
    expect(document.activeElement.tagName).toBe("BODY");
    expect(document.activeElement.id).toBe("");

    modal.show();

    // After showing the modal, the modal content should be focused
    expect(document.activeElement.tagName).toBe("DIV");
    expect(document.activeElement.id).toBe("ag-modal-content");

    modal.hide();

    // After hiding the modal, nothing should be focused, just as before
    expect(document.activeElement.tagName).toBe("BODY");
    expect(document.activeElement.id).toBe("");

    dummyLink.focus();

    // After focusing the dummy link, the dummy link should be focused
    expect(document.activeElement.tagName).toBe("A");
    expect(document.activeElement.id).toBe("dummy-link");

    modal.show();

    // After showing the modal, the modal content should be focused
    expect(document.activeElement.tagName).toBe("DIV");
    expect(document.activeElement.id).toBe("ag-modal-content");

    modal.hide();

    // After hiding the modal, the dummy link should be focused, just as before
    expect(document.activeElement.tagName).toBe("A");
    expect(document.activeElement.id).toBe("dummy-link");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should create a container element", () => {

    let newRow = modal.generateContainer();

    expect(newRow.tagName).toMatch("DIV");
    expect(newRow.className.indexOf("ag-modal-content-row")).not.toBe(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should create intro, radio, and button elements by default", () => {

    // let modalContent = modal.generateContents();
    // console.log(modalContent);
    expect(true).toBe(true);

    // TODO: finsih this

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should generate a container (row) object", () => {

    let container = modal.generateContainer();

    expect(container.className.indexOf("ag-modal-content-row")).not.toBe(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should generate a sub container (column) object", () => {

    let subContainer = modal.generateSubContainer();

    expect(subContainer.className.indexOf("ag-modal-content-column")).not.toBe(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/8
  it("Should create a title element with default settings", () => {

    let title = modal.generateTitle();

    expect(title.className.indexOf("ag-modal-content-row")).not.toBe(-1);
    expect(title.querySelectorAll("h1").length).not.toBe(0);
    expect(title.querySelectorAll("h1")[0].id).toMatch("ag-title");
    expect(title.querySelectorAll("h1")[0].className.indexOf("ag-title")).not.toBe(-1);
    expect(title.querySelectorAll("h1")[0].innerHTML).toMatch("Please Verify Your Age");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/8
  it("Should create a title element with custom settings", () => {

    let title = modal.generateTitle({
      id: "dummyId",
      tagName: "p",
      content: "This is some test content",
      classes: [
        "testClassA",
        "testClassB"
      ],
      attributes: {
        testAttributeA: "testValueA",
        testAttributeB: "testValueB"
      }
    });

    expect(title.className.indexOf("ag-modal-content-row")).not.toBe(-1);
    expect(title.querySelectorAll("p").length).toBe(0);
    expect(title.querySelectorAll("h1").length).not.toBe(0);
    expect(title.querySelectorAll("h1")[0].id).toMatch("ag-title");
    expect(title.querySelectorAll("h1")[0].className.indexOf("ag-title")).not.toBe(-1);
    expect(title.querySelectorAll("h1")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(title.querySelectorAll("h1")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(title.querySelectorAll("h1")[0].innerHTML).toMatch("This is some test content");
    expect(title.querySelectorAll("h1")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(title.querySelectorAll("h1")[0].getAttribute("testAttributeB")).toMatch("testValueB");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/9
  it("Should create a intro element with default settings", () => {

    let intro = modal.generateIntro();

    expect(intro.className.indexOf("ag-modal-content-row")).not.toBe(-1);
    expect(intro.querySelectorAll("p").length).not.toBe(0);
    expect(intro.querySelectorAll("p")[0].id).toMatch("ag-intro");
    expect(intro.querySelectorAll("p")[0].className.indexOf("ag-intro")).not.toBe(-1);
    expect(intro.querySelectorAll("p")[0].innerHTML).toMatch(`For legal reasons, we need you to verify that you are of legal age before we can let you in to our site.`);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/9
  it("Should create a intro element with custom settings", () => {

    let intro = modal.generateIntro({
      id: "dummyId",
      tagName: "random",
      content: "This is some test content",
      classes: [
        "testClassA",
        "testClassB"
      ],
      attributes: {
        testAttributeA: "testValueA",
        testAttributeB: "testValueB"
      }
    });

    expect(intro.className.indexOf("ag-modal-content-row")).not.toBe(-1);
    expect(intro.querySelectorAll("random").length).toBe(0);
    expect(intro.querySelectorAll("p").length).not.toBe(0);
    expect(intro.querySelectorAll("p")[0].id).toMatch("ag-intro");
    expect(intro.querySelectorAll("p")[0].className.indexOf("ag-intro")).not.toBe(-1);
    expect(intro.querySelectorAll("p")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(intro.querySelectorAll("p")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(intro.querySelectorAll("p")[0].innerHTML).toMatch("This is some test content");
    expect(intro.querySelectorAll("p")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(intro.querySelectorAll("p")[0].getAttribute("testAttributeB")).toMatch("testValueB");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/10
  it("Should create a image element with default settings", () => {

    let image = modal.generateImage();

    expect(image.className.indexOf("ag-modal-content-row")).not.toBe(-1);
    expect(image.querySelectorAll("img").length).not.toBe(0);
    expect(image.querySelectorAll("img")[0].id).toMatch("ag-image");
    expect(image.querySelectorAll("img")[0].className.indexOf("ag-image")).not.toBe(-1);
    expect(image.querySelectorAll("img")[0].innerHTML).toMatch("");
    expect(image.querySelectorAll("img")[0].getAttribute("src")).toMatch("");
    expect(image.querySelectorAll("img")[0].getAttribute("alt")).toMatch("");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/10
  it("Should create a image element with custom settings", () => {

    let image = modal.generateImage({
      id: "dummyId",
      tagName: "random",
      content: "This is some test content",
      classes: [
        "testClassA",
        "testClassB"
      ],
      attributes: {
        testAttributeA: "testValueA",
        testAttributeB: "testValueB",
        src: "https://google.com",
        alt: "Alt text"
      }
    });

    expect(image.className.indexOf("ag-modal-content-row")).not.toBe(-1);
    expect(image.querySelectorAll("random").length).toBe(0);
    expect(image.querySelectorAll("img").length).not.toBe(0);
    expect(image.querySelectorAll("img")[0].id).toMatch("ag-image");
    expect(image.querySelectorAll("img")[0].className.indexOf("ag-image")).not.toBe(-1);
    expect(image.querySelectorAll("img")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(image.querySelectorAll("img")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(image.querySelectorAll("img")[0].innerHTML).toMatch("");
    expect(image.querySelectorAll("img")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(image.querySelectorAll("img")[0].getAttribute("testAttributeB")).toMatch("testValueB");
    expect(image.querySelectorAll("img")[0].getAttribute("src")).toMatch("https://google.com");
    expect(image.querySelectorAll("img")[0].getAttribute("alt")).toMatch("Alt text");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/12
  it("Should create a radio element with default settings", () => {

    let radio = modal.generateRadio();

    expect(radio.className.indexOf("ag-modal-content-row")).not.toBe(-1);
    expect(radio.querySelectorAll("p").length).not.toBe(0);
    expect(radio.querySelectorAll("p")[0].id).toMatch("ag-radio-error");
    expect(radio.querySelectorAll("p")[0].className.indexOf("ag-radio-error")).not.toBe(-1);
    expect(radio.querySelectorAll("p")[0].innerHTML).toMatch("Sorry, you must be of legal age to enter this site.");

    expect(radio.querySelectorAll("div").length).toBe(2);

    let firstColumn = radio.querySelectorAll("div")[0];
    let secondColumn = radio.querySelectorAll("div")[1];

    expect(firstColumn.className.indexOf("ag-modal-content-column")).not.toBe(-1);
    expect(secondColumn.className.indexOf("ag-modal-content-column")).not.toBe(-1);

    expect(firstColumn.querySelectorAll("input").length).not.toBe(0);
    expect(firstColumn.querySelectorAll("input")[0].id).toMatch("ag-radio-yes");
    expect(firstColumn.querySelectorAll("input")[0].className.indexOf("ag-radio-yes")).not.toBe(0);
    expect(firstColumn.querySelectorAll("input")[0].getAttribute("name")).toMatch("radio");
    expect(firstColumn.querySelectorAll("input")[0].getAttribute("type")).toMatch("radio");
    expect(firstColumn.querySelectorAll("input")[0].getAttribute("value")).toMatch("yes");

    expect(firstColumn.querySelectorAll("label").length).not.toBe(0);
    expect(firstColumn.querySelectorAll("label")[0].id).toMatch("ag-radio-yes-label");
    expect(firstColumn.querySelectorAll("label")[0].className.indexOf("ag-radio-yes-label")).not.toBe(0);
    expect(firstColumn.querySelectorAll("label")[0].innerHTML).toMatch("Yes, I am of legal age.");
    expect(firstColumn.querySelectorAll("label")[0].getAttribute("for")).toMatch("ag-radio-yes");

    expect(secondColumn.querySelectorAll("input").length).not.toBe(0);
    expect(secondColumn.querySelectorAll("input")[0].id).toMatch("ag-radio-no");
    expect(secondColumn.querySelectorAll("input")[0].className.indexOf("ag-radio-no")).not.toBe(0);
    expect(secondColumn.querySelectorAll("input")[0].getAttribute("name")).toMatch("radio");
    expect(secondColumn.querySelectorAll("input")[0].getAttribute("type")).toMatch("radio");
    expect(secondColumn.querySelectorAll("input")[0].getAttribute("value")).toMatch("no");

    expect(secondColumn.querySelectorAll("label").length).not.toBe(0);
    expect(secondColumn.querySelectorAll("label")[0].id).toMatch("ag-radio-no-label");
    expect(secondColumn.querySelectorAll("label")[0].className.indexOf("ag-radio-no-label")).not.toBe(0);
    expect(secondColumn.querySelectorAll("label")[0].innerHTML).toMatch("No, I am not of legal age.");
    expect(secondColumn.querySelectorAll("label")[0].getAttribute("for")).toMatch("ag-radio-no");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/12
  it("Should create a radio element with custom settings", () => {

    let radio = modal.generateRadio({
      error: {
        id: "dummyId",
        tagName: "random",
        content: "This is some test content",
        classes: [
          "testClassA",
          "testClassB"
        ],
        attributes: {
          testAttributeA: "testValueA",
          testAttributeB: "testValueB"
        }
      },
      yes: {
        input: {
          id: "dummyId",
          tagName: "random",
          content: "This is some test content",
          classes: [
            "testClassA",
            "testClassB"
          ],
          attributes: {
            testAttributeA: "testValueA",
            testAttributeB: "testValueB"
          }
        },
        label: {
          id: "dummyId",
          tagName: "random",
          content: "This is some test content",
          classes: [
            "testClassA",
            "testClassB"
          ],
          attributes: {
            testAttributeA: "testValueA",
            testAttributeB: "testValueB"
          }
        },
      },
      no: {
        input: {
          id: "dummyId",
          tagName: "random",
          content: "This is some test content",
          classes: [
            "testClassA",
            "testClassB"
          ],
          attributes: {
            testAttributeA: "testValueA",
            testAttributeB: "testValueB"
          }
        },
        label: {
          id: "dummyId",
          tagName: "random",
          content: "This is some test content",
          classes: [
            "testClassA",
            "testClassB"
          ],
          attributes: {
            testAttributeA: "testValueA",
            testAttributeB: "testValueB"
          }
        },
      }
    });

    expect(radio.className.indexOf("ag-modal-content-row")).not.toBe(-1);
    expect(radio.querySelectorAll("p").length).not.toBe(0);
    expect(radio.querySelectorAll("random").length).toBe(0);
    expect(radio.querySelectorAll("p")[0].id).toMatch("ag-radio-error");
    expect(radio.querySelectorAll("p")[0].className.indexOf("ag-radio-error")).not.toBe(-1);
    expect(radio.querySelectorAll("p")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(radio.querySelectorAll("p")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(radio.querySelectorAll("p")[0].innerHTML).toMatch("This is some test content");
    expect(radio.querySelectorAll("p")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(radio.querySelectorAll("p")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(radio.querySelectorAll("div").length).toBe(2);

    let firstColumn = radio.querySelectorAll("div")[0];
    let secondColumn = radio.querySelectorAll("div")[1];

    expect(firstColumn.className.indexOf("ag-modal-content-column")).not.toBe(-1);
    expect(secondColumn.className.indexOf("ag-modal-content-column")).not.toBe(-1);

    expect(firstColumn.querySelectorAll("random").length).toBe(0);

    expect(firstColumn.querySelectorAll("input").length).not.toBe(0);
    expect(firstColumn.querySelectorAll("input")[0].id).toMatch("ag-radio-yes");
    expect(firstColumn.querySelectorAll("input")[0].className.indexOf("ag-radio-yes")).not.toBe(0);
    expect(firstColumn.querySelectorAll("input")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(firstColumn.querySelectorAll("input")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(firstColumn.querySelectorAll("input")[0].innerHTML).toMatch("");
    expect(firstColumn.querySelectorAll("input")[0].getAttribute("name")).toMatch("radio");
    expect(firstColumn.querySelectorAll("input")[0].getAttribute("type")).toMatch("radio");
    expect(firstColumn.querySelectorAll("input")[0].getAttribute("value")).toMatch("yes");
    expect(firstColumn.querySelectorAll("input")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(firstColumn.querySelectorAll("input")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(firstColumn.querySelectorAll("label").length).not.toBe(0);
    expect(firstColumn.querySelectorAll("label")[0].id).toMatch("ag-radio-yes-label");
    expect(firstColumn.querySelectorAll("label")[0].className.indexOf("ag-radio-yes-label")).not.toBe(0);
    expect(firstColumn.querySelectorAll("label")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(firstColumn.querySelectorAll("label")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(firstColumn.querySelectorAll("label")[0].innerHTML).toMatch("This is some test content");
    expect(firstColumn.querySelectorAll("label")[0].getAttribute("for")).toMatch("ag-radio-yes");
    expect(firstColumn.querySelectorAll("label")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(firstColumn.querySelectorAll("label")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(secondColumn.querySelectorAll("input").length).not.toBe(0);
    expect(secondColumn.querySelectorAll("input")[0].id).toMatch("ag-radio-no");
    expect(secondColumn.querySelectorAll("input")[0].className.indexOf("ag-radio-no")).not.toBe(0);
    expect(secondColumn.querySelectorAll("input")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(secondColumn.querySelectorAll("input")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(secondColumn.querySelectorAll("input")[0].innerHTML).toMatch("");
    expect(secondColumn.querySelectorAll("input")[0].getAttribute("name")).toMatch("radio");
    expect(secondColumn.querySelectorAll("input")[0].getAttribute("type")).toMatch("radio");
    expect(secondColumn.querySelectorAll("input")[0].getAttribute("value")).toMatch("no");
    expect(secondColumn.querySelectorAll("input")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(secondColumn.querySelectorAll("input")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(secondColumn.querySelectorAll("label").length).not.toBe(0);
    expect(secondColumn.querySelectorAll("label")[0].id).toMatch("ag-radio-no-label");
    expect(secondColumn.querySelectorAll("label")[0].className.indexOf("ag-radio-no-label")).not.toBe(0);
    expect(secondColumn.querySelectorAll("label")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(secondColumn.querySelectorAll("label")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(secondColumn.querySelectorAll("label")[0].innerHTML).toMatch("This is some test content");
    expect(secondColumn.querySelectorAll("label")[0].getAttribute("for")).toMatch("ag-radio-no");
    expect(secondColumn.querySelectorAll("label")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(secondColumn.querySelectorAll("label")[0].getAttribute("testAttributeB")).toMatch("testValueB");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/13
  it("Should create a date of birth input element with default settings", () => {

    let dateOfBirth = modal.generateDateOfBirth();

    expect(dateOfBirth.className.indexOf("ag-modal-content-row")).not.toBe(-1);
    expect(dateOfBirth.querySelectorAll("p").length).not.toBe(0);
    expect(dateOfBirth.querySelectorAll("p")[0].id).toMatch("ag-dob-error");
    expect(dateOfBirth.querySelectorAll("p")[0].className.indexOf("ag-dob-error")).not.toBe(-1);
    expect(dateOfBirth.querySelectorAll("p")[0].innerHTML).toMatch("Sorry, you must be of legal age to enter this site.");

    expect(dateOfBirth.querySelectorAll("div").length).toBe(3);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/13
  it("Should create a date of birth input element with custom settings", () => {

    let dateOfBirth = modal.generateDateOfBirth({
      error: {
        id: "dummyId",
        tagName: "random",
        content: "This is some test content",
        classes: [
          "testClassA",
          "testClassB"
        ],
        attributes: {
          testAttributeA: "testValueA",
          testAttributeB: "testValueB"
        }
      },
      day: {},
      month: {},
      year: {}
    });

    expect(dateOfBirth.className.indexOf("ag-modal-content-row")).not.toBe(-1);
    expect(dateOfBirth.querySelectorAll("random").length).toBe(0);
    expect(dateOfBirth.querySelectorAll("p").length).not.toBe(0);
    expect(dateOfBirth.querySelectorAll("p")[0].id).toMatch("ag-dob-error");
    expect(dateOfBirth.querySelectorAll("p")[0].className.indexOf("ag-dob-error")).not.toBe(-1);
    expect(dateOfBirth.querySelectorAll("p")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(dateOfBirth.querySelectorAll("p")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(dateOfBirth.querySelectorAll("p")[0].innerHTML).toMatch("This is some test content");
    expect(dateOfBirth.querySelectorAll("p")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(dateOfBirth.querySelectorAll("p")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(dateOfBirth.querySelectorAll("div").length).toBe(3);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/14
  it("Should create a day input element with default settings", () => {

    let day = modal.generateDay();

    expect(day.className.indexOf("ag-modal-content-column")).not.toBe(-1);

    expect(day.querySelectorAll("label").length).not.toBe(0);
    expect(day.querySelectorAll("label")[0].id).toMatch("ag-dob-day-label");
    expect(day.querySelectorAll("label")[0].className.indexOf("ag-dob-day-label")).not.toBe(-1);
    expect(day.querySelectorAll("label")[0].innerHTML).toMatch("Day:");
    expect(day.querySelectorAll("label")[0].getAttribute("for")).toMatch("ag-dob-day");

    expect(day.querySelectorAll("input").length).not.toBe(0);
    expect(day.querySelectorAll("input")[0].id).toMatch("ag-dob-day");
    expect(day.querySelectorAll("input")[0].className.indexOf("ag-dob-day")).not.toBe(-1);
    expect(day.querySelectorAll("input")[0].innerHTML).toMatch("");
    expect(day.querySelectorAll("input")[0].getAttribute("name")).toMatch("ag-dob-day");
    expect(day.querySelectorAll("input")[0].getAttribute("placeholder")).toMatch("Day");
    expect(day.querySelectorAll("input")[0].getAttribute("type")).toMatch("text");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/14
  it("Should create a day input element with custom settings", () => {

    let day = modal.generateDay({
      label: {
        id: "dummyId",
        tagName: "random",
        content: "This is some test content",
        classes: [
          "testClassA",
          "testClassB"
        ],
        attributes: {
          testAttributeA: "testValueA",
          testAttributeB: "testValueB"
        }
      },
      input: {
        id: "dummyId",
        tagName: "random",
        content: "This is some test content",
        classes: [
          "testClassA",
          "testClassB"
        ],
        attributes: {
          testAttributeA: "testValueA",
          testAttributeB: "testValueB",
          placeholder: "TestPlaceHolder"
        }
      }
    });

    expect(day.className.indexOf("ag-modal-content-column")).not.toBe(-1);

    expect(day.querySelectorAll("random").length).toBe(0);

    expect(day.querySelectorAll("label").length).not.toBe(0);
    expect(day.querySelectorAll("label")[0].id).toMatch("ag-dob-day-label");
    expect(day.querySelectorAll("label")[0].className.indexOf("ag-dob-day-label")).not.toBe(-1);
    expect(day.querySelectorAll("label")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(day.querySelectorAll("label")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(day.querySelectorAll("label")[0].innerHTML).toMatch("This is some test content");
    expect(day.querySelectorAll("label")[0].getAttribute("for")).toMatch("ag-dob-day");
    expect(day.querySelectorAll("label")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(day.querySelectorAll("label")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(day.querySelectorAll("input").length).not.toBe(0);
    expect(day.querySelectorAll("input")[0].id).toMatch("ag-dob-day");
    expect(day.querySelectorAll("input")[0].className.indexOf("ag-dob-day")).not.toBe(-1);
    expect(day.querySelectorAll("input")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(day.querySelectorAll("input")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(day.querySelectorAll("input")[0].innerHTML).toMatch("");
    expect(day.querySelectorAll("input")[0].getAttribute("name")).toMatch("ag-dob-day");
    expect(day.querySelectorAll("input")[0].getAttribute("placeholder")).toMatch("TestPlaceHolder");
    expect(day.querySelectorAll("input")[0].getAttribute("type")).toMatch("text");
    expect(day.querySelectorAll("input")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(day.querySelectorAll("input")[0].getAttribute("testAttributeB")).toMatch("testValueB");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/15
  it("Should create a month input element with default settings", () => {

    let month = modal.generateMonth();

    expect(month.className.indexOf("ag-modal-content-column")).not.toBe(-1);

    expect(month.querySelectorAll("label").length).not.toBe(0);
    expect(month.querySelectorAll("label")[0].id).toMatch("ag-dob-month-label");
    expect(month.querySelectorAll("label")[0].className.indexOf("ag-dob-month-label")).not.toBe(-1);
    expect(month.querySelectorAll("label")[0].innerHTML).toMatch("Month:");
    expect(month.querySelectorAll("label")[0].getAttribute("for")).toMatch("ag-dob-month");

    expect(month.querySelectorAll("input").length).not.toBe(0);
    expect(month.querySelectorAll("input")[0].id).toMatch("ag-dob-month");
    expect(month.querySelectorAll("input")[0].className.indexOf("ag-dob-month")).not.toBe(-1);
    expect(month.querySelectorAll("input")[0].innerHTML).toMatch("");
    expect(month.querySelectorAll("input")[0].getAttribute("name")).toMatch("ag-dob-month");
    expect(month.querySelectorAll("input")[0].getAttribute("placeholder")).toMatch("Month");
    expect(month.querySelectorAll("input")[0].getAttribute("type")).toMatch("text");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/15
  it("Should create a month input element with custom settings", () => {

    let month = modal.generateMonth({
      label: {
        id: "dummyId",
        tagName: "random",
        content: "This is some test content",
        classes: [
          "testClassA",
          "testClassB"
        ],
        attributes: {
          testAttributeA: "testValueA",
          testAttributeB: "testValueB"
        }
      },
      input: {
        id: "dummyId",
        tagName: "random",
        content: "This is some test content",
        classes: [
          "testClassA",
          "testClassB"
        ],
        attributes: {
          testAttributeA: "testValueA",
          testAttributeB: "testValueB",
          placeholder: "TestPlaceHolder"
        }
      }
    });

    expect(month.className.indexOf("ag-modal-content-column")).not.toBe(-1);

    expect(month.querySelectorAll("random").length).toBe(0);

    expect(month.querySelectorAll("label").length).not.toBe(0);
    expect(month.querySelectorAll("label")[0].id).toMatch("ag-dob-month-label");
    expect(month.querySelectorAll("label")[0].className.indexOf("ag-dob-month-label")).not.toBe(-1);
    expect(month.querySelectorAll("label")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(month.querySelectorAll("label")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(month.querySelectorAll("label")[0].innerHTML).toMatch("This is some test content");
    expect(month.querySelectorAll("label")[0].getAttribute("for")).toMatch("ag-dob-month");
    expect(month.querySelectorAll("label")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(month.querySelectorAll("label")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(month.querySelectorAll("input").length).not.toBe(0);
    expect(month.querySelectorAll("input")[0].id).toMatch("ag-dob-month");
    expect(month.querySelectorAll("input")[0].className.indexOf("ag-dob-month")).not.toBe(-1);
    expect(month.querySelectorAll("input")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(month.querySelectorAll("input")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(month.querySelectorAll("input")[0].innerHTML).toMatch("");
    expect(month.querySelectorAll("input")[0].getAttribute("name")).toMatch("ag-dob-month");
    expect(month.querySelectorAll("input")[0].getAttribute("placeholder")).toMatch("TestPlaceHolder");
    expect(month.querySelectorAll("input")[0].getAttribute("type")).toMatch("text");
    expect(month.querySelectorAll("input")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(month.querySelectorAll("input")[0].getAttribute("testAttributeB")).toMatch("testValueB");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/16
  it("Should create a year input element with default settings", () => {

    let year = modal.generateYear();

    expect(year.className.indexOf("ag-modal-content-column")).not.toBe(-1);

    expect(year.querySelectorAll("label").length).not.toBe(0);
    expect(year.querySelectorAll("label")[0].id).toMatch("ag-dob-year-label");
    expect(year.querySelectorAll("label")[0].className.indexOf("ag-dob-year-label")).not.toBe(-1);
    expect(year.querySelectorAll("label")[0].innerHTML).toMatch("Year:");
    expect(year.querySelectorAll("label")[0].getAttribute("for")).toMatch("ag-dob-year");

    expect(year.querySelectorAll("input").length).not.toBe(0);
    expect(year.querySelectorAll("input")[0].id).toMatch("ag-dob-year");
    expect(year.querySelectorAll("input")[0].className.indexOf("ag-dob-year")).not.toBe(-1);
    expect(year.querySelectorAll("input")[0].innerHTML).toMatch("");
    expect(year.querySelectorAll("input")[0].getAttribute("name")).toMatch("ag-dob-year");
    expect(year.querySelectorAll("input")[0].getAttribute("placeholder")).toMatch("Year");
    expect(year.querySelectorAll("input")[0].getAttribute("type")).toMatch("text");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/16
  it("Should create a year input element with custom settings", () => {

    let year = modal.generateYear({
      label: {
        id: "dummyId",
        tagName: "random",
        content: "This is some test content",
        classes: [
          "testClassA",
          "testClassB"
        ],
        attributes: {
          testAttributeA: "testValueA",
          testAttributeB: "testValueB"
        }
      },
      input: {
        id: "dummyId",
        tagName: "random",
        content: "This is some test content",
        classes: [
          "testClassA",
          "testClassB"
        ],
        attributes: {
          testAttributeA: "testValueA",
          testAttributeB: "testValueB",
          placeholder: "TestPlaceHolder"
        }
      }
    });

    expect(year.className.indexOf("ag-modal-content-column")).not.toBe(-1);

    expect(year.querySelectorAll("random").length).toBe(0);

    expect(year.querySelectorAll("label").length).not.toBe(0);
    expect(year.querySelectorAll("label")[0].id).toMatch("ag-dob-year-label");
    expect(year.querySelectorAll("label")[0].className.indexOf("ag-dob-year-label")).not.toBe(-1);
    expect(year.querySelectorAll("label")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(year.querySelectorAll("label")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(year.querySelectorAll("label")[0].innerHTML).toMatch("This is some test content");
    expect(year.querySelectorAll("label")[0].getAttribute("for")).toMatch("ag-dob-year");
    expect(year.querySelectorAll("label")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(year.querySelectorAll("label")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(year.querySelectorAll("input").length).not.toBe(0);
    expect(year.querySelectorAll("input")[0].id).toMatch("ag-dob-year");
    expect(year.querySelectorAll("input")[0].className.indexOf("ag-dob-year")).not.toBe(-1);
    expect(year.querySelectorAll("input")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(year.querySelectorAll("input")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(year.querySelectorAll("input")[0].innerHTML).toMatch("");
    expect(year.querySelectorAll("input")[0].getAttribute("name")).toMatch("ag-dob-year");
    expect(year.querySelectorAll("input")[0].getAttribute("placeholder")).toMatch("TestPlaceHolder");
    expect(year.querySelectorAll("input")[0].getAttribute("type")).toMatch("text");
    expect(year.querySelectorAll("input")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(year.querySelectorAll("input")[0].getAttribute("testAttributeB")).toMatch("testValueB");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/11
  it("Should create a single checkbox element with default settings", () => {

    let checkbox = modal.generateCheckbox(
      {
        error: {},
        input: {},
        label: {}
      }
    , 0);

    expect(checkbox.tagName).toMatch("LABEL");
    expect(checkbox.children.length).toBe(3);
    expect(checkbox.className.indexOf("ag-checkbox-container")).not.toBe(-1);
    expect(checkbox.getAttribute("for")).toMatch("ag-checkbox-0");

    expect(checkbox.querySelectorAll("p")[0].id).toMatch("ag-checkbox-0-error");
    expect(checkbox.querySelectorAll("p")[0].innerHTML).toMatch("Sorry, you are required to check this checkbox.");

    expect(checkbox.querySelectorAll("input")[0].id).toMatch("ag-checkbox-0");
    expect(checkbox.querySelectorAll("input")[0].innerHTML).toMatch("");
    expect(checkbox.querySelectorAll("input")[0].getAttribute("name")).toMatch("ag-checkbox-0");
    expect(checkbox.querySelectorAll("input")[0].getAttribute("type")).toMatch("checkbox");

    expect(checkbox.querySelectorAll("span")[0].id).toMatch("ag-checkbox-0-label");
    expect(checkbox.querySelectorAll("span")[0].innerHTML).toMatch("Please check this");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/11
  it("Should create a single checkbox element with custom settings", () => {

    let checkbox = modal.generateCheckbox(
      {
        error: {
          id: "dummyId",
          tagName: "random",
          content: "This is some test content",
          classes: [
            "testClassA",
            "testClassB"
          ],
          attributes: {
            testAttributeA: "testValueA",
            testAttributeB: "testValueB",
            placeholder: "TestPlaceHolder"
          }
        },
        input: {
          id: "dummyId",
          tagName: "random",
          content: "This is some test content",
          classes: [
            "testClassA",
            "testClassB"
          ],
          attributes: {
            testAttributeA: "testValueA",
            testAttributeB: "testValueB",
            placeholder: "TestPlaceHolder"
          }
        },
        label: {
          id: "dummyId",
          tagName: "random",
          content: "This is some test content",
          classes: [
            "testClassA",
            "testClassB"
          ],
          attributes: {
            testAttributeA: "testValueA",
            testAttributeB: "testValueB",
            placeholder: "TestPlaceHolder"
          }
        }
      }
    , 0);

    expect(checkbox.tagName).toMatch("LABEL");
    expect(checkbox.children.length).toBe(3);
    expect(checkbox.className.indexOf("ag-checkbox-container")).not.toBe(-1);
    expect(checkbox.getAttribute("for")).toMatch("ag-checkbox-0");

    expect(checkbox.querySelectorAll("random").length).toBe(0);

    expect(checkbox.querySelectorAll("p")[0].id).toMatch("ag-checkbox-0-error");
    expect(checkbox.querySelectorAll("p")[0].innerHTML).toMatch("This is some test content");
    expect(checkbox.querySelectorAll("p")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(checkbox.querySelectorAll("p")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(checkbox.querySelectorAll("p")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(checkbox.querySelectorAll("p")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(checkbox.querySelectorAll("input")[0].id).toMatch("ag-checkbox-0");
    expect(checkbox.querySelectorAll("input")[0].innerHTML).toMatch("");
    expect(checkbox.querySelectorAll("input")[0].getAttribute("name")).toMatch("ag-checkbox-0");
    expect(checkbox.querySelectorAll("input")[0].getAttribute("type")).toMatch("checkbox");
    expect(checkbox.querySelectorAll("input")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(checkbox.querySelectorAll("input")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(checkbox.querySelectorAll("input")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(checkbox.querySelectorAll("input")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(checkbox.querySelectorAll("span")[0].id).toMatch("ag-checkbox-0-label");
    expect(checkbox.querySelectorAll("span")[0].innerHTML).toMatch("This is some test content");
    expect(checkbox.querySelectorAll("span")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(checkbox.querySelectorAll("span")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(checkbox.querySelectorAll("span")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(checkbox.querySelectorAll("span")[0].getAttribute("testAttributeB")).toMatch("testValueB");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/11
  it("Should create multiple checkbox elements with default settings", () => {

    let checkboxes = modal.generateCheckboxes([
      {
        error: {},
        input: {},
        label: {}
      },
      {
        error: {},
        input: {},
        label: {}
      },
      {
        error: {},
        input: {},
        label: {}
      }
    ]);

    expect(checkboxes.tagName).toMatch("DIV");
    expect(checkboxes.children.length).toBe(3);

    expect(checkboxes.children[0].tagName).toMatch("LABEL");
    expect(checkboxes.children[0].className.indexOf("ag-checkbox-container")).not.toBe(-1);
    expect(checkboxes.children[0].getAttribute("for")).toMatch("ag-checkbox-0");
    expect(checkboxes.children[0].children.length).toBe(3);

    expect(checkboxes.children[0].querySelectorAll("p")[0].id).toMatch("ag-checkbox-0-error");
    expect(checkboxes.children[0].querySelectorAll("p")[0].innerHTML).toMatch("Sorry, you are required to check this checkbox.");

    expect(checkboxes.children[0].querySelectorAll("input")[0].id).toMatch("ag-checkbox-0");
    expect(checkboxes.children[0].querySelectorAll("input")[0].innerHTML).toMatch("");
    expect(checkboxes.children[0].querySelectorAll("input")[0].getAttribute("name")).toMatch("ag-checkbox-0");
    expect(checkboxes.children[0].querySelectorAll("input")[0].getAttribute("type")).toMatch("checkbox");

    expect(checkboxes.children[0].querySelectorAll("span")[0].id).toMatch("ag-checkbox-0-label");
    expect(checkboxes.children[0].querySelectorAll("span")[0].innerHTML).toMatch("Please check this");

    expect(checkboxes.children[1].tagName).toMatch("LABEL");
    expect(checkboxes.children[1].className.indexOf("ag-checkbox-container")).not.toBe(-1);
    expect(checkboxes.children[1].getAttribute("for")).toMatch("ag-checkbox-1");
    expect(checkboxes.children[1].children.length).toBe(3);

    expect(checkboxes.children[1].querySelectorAll("p")[0].id).toMatch("ag-checkbox-1-error");
    expect(checkboxes.children[1].querySelectorAll("p")[0].innerHTML).toMatch("Sorry, you are required to check this checkbox.");

    expect(checkboxes.children[1].querySelectorAll("input")[0].id).toMatch("ag-checkbox-1");
    expect(checkboxes.children[1].querySelectorAll("input")[0].innerHTML).toMatch("");
    expect(checkboxes.children[1].querySelectorAll("input")[0].getAttribute("name")).toMatch("ag-checkbox-1");
    expect(checkboxes.children[1].querySelectorAll("input")[0].getAttribute("type")).toMatch("checkbox");

    expect(checkboxes.children[1].querySelectorAll("span")[0].id).toMatch("ag-checkbox-1-label");
    expect(checkboxes.children[1].querySelectorAll("span")[0].innerHTML).toMatch("Please check this");

    expect(checkboxes.children[2].tagName).toMatch("LABEL");
    expect(checkboxes.children[2].className.indexOf("ag-checkbox-container")).not.toBe(-1);
    expect(checkboxes.children[2].getAttribute("for")).toMatch("ag-checkbox-2");
    expect(checkboxes.children[2].children.length).toBe(3);

    expect(checkboxes.children[2].querySelectorAll("p")[0].id).toMatch("ag-checkbox-2-error");
    expect(checkboxes.children[2].querySelectorAll("p")[0].innerHTML).toMatch("Sorry, you are required to check this checkbox.");

    expect(checkboxes.children[2].querySelectorAll("input")[0].id).toMatch("ag-checkbox-2");
    expect(checkboxes.children[2].querySelectorAll("input")[0].innerHTML).toMatch("");
    expect(checkboxes.children[2].querySelectorAll("input")[0].getAttribute("name")).toMatch("ag-checkbox-2");
    expect(checkboxes.children[2].querySelectorAll("input")[0].getAttribute("type")).toMatch("checkbox");

    expect(checkboxes.children[2].querySelectorAll("span")[0].id).toMatch("ag-checkbox-2-label");
    expect(checkboxes.children[2].querySelectorAll("span")[0].innerHTML).toMatch("Please check this");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/11
  it("Should create multiple checkbox elements with custom settings", () => {

    let checkboxes = modal.generateCheckboxes([
      {
        error: {
          id: "dummyId",
          tagName: "random",
          content: "This is some test content",
          classes: [
            "testClassA",
            "testClassB"
          ],
          attributes: {
            testAttributeA: "testValueA",
            testAttributeB: "testValueB",
            placeholder: "TestPlaceHolder"
          }
        },
        input: {
          id: "dummyId",
          tagName: "random",
          content: "This is some test content",
          classes: [
            "testClassA",
            "testClassB"
          ],
          attributes: {
            testAttributeA: "testValueA",
            testAttributeB: "testValueB",
            placeholder: "TestPlaceHolder"
          }
        },
        label: {
          id: "dummyId",
          tagName: "random",
          content: "This is some test content",
          classes: [
            "testClassA",
            "testClassB"
          ],
          attributes: {
            testAttributeA: "testValueA",
            testAttributeB: "testValueB",
            placeholder: "TestPlaceHolder"
          }
        }
      },
      {
        error: {
          id: "dummyId",
          tagName: "random",
          content: "This is some test content",
          classes: [
            "testClassA",
            "testClassB"
          ],
          attributes: {
            testAttributeA: "testValueA",
            testAttributeB: "testValueB",
            placeholder: "TestPlaceHolder"
          }
        },
        input: {
          id: "dummyId",
          tagName: "random",
          content: "This is some test content",
          classes: [
            "testClassA",
            "testClassB"
          ],
          attributes: {
            testAttributeA: "testValueA",
            testAttributeB: "testValueB",
            placeholder: "TestPlaceHolder"
          }
        },
        label: {
          id: "dummyId",
          tagName: "random",
          content: "This is some test content",
          classes: [
            "testClassA",
            "testClassB"
          ],
          attributes: {
            testAttributeA: "testValueA",
            testAttributeB: "testValueB",
            placeholder: "TestPlaceHolder"
          }
        }
      },
      {
        error: {
          id: "dummyId",
          tagName: "random",
          content: "This is some test content",
          classes: [
            "testClassA",
            "testClassB"
          ],
          attributes: {
            testAttributeA: "testValueA",
            testAttributeB: "testValueB",
            placeholder: "TestPlaceHolder"
          }
        },
        input: {
          id: "dummyId",
          tagName: "random",
          content: "This is some test content",
          classes: [
            "testClassA",
            "testClassB"
          ],
          attributes: {
            testAttributeA: "testValueA",
            testAttributeB: "testValueB",
            placeholder: "TestPlaceHolder"
          }
        },
        label: {
          id: "dummyId",
          tagName: "random",
          content: "This is some test content",
          classes: [
            "testClassA",
            "testClassB"
          ],
          attributes: {
            testAttributeA: "testValueA",
            testAttributeB: "testValueB",
            placeholder: "TestPlaceHolder"
          }
        }
      }
    ]);

    expect(checkboxes.tagName).toMatch("DIV");
    expect(checkboxes.children.length).toBe(3);

    expect(checkboxes.children[0].tagName).toMatch("LABEL");
    expect(checkboxes.children[0].className.indexOf("ag-checkbox-container")).not.toBe(-1);
    expect(checkboxes.children[0].getAttribute("for")).toMatch("ag-checkbox-0");
    expect(checkboxes.children[0].children.length).toBe(3);
    expect(checkboxes.children[0].querySelectorAll("random").length).toBe(0);

    expect(checkboxes.children[0].querySelectorAll("p")[0].id).toMatch("ag-checkbox-0-error");
    expect(checkboxes.children[0].querySelectorAll("p")[0].innerHTML).toMatch("This is some test content");
    expect(checkboxes.children[0].querySelectorAll("p")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(checkboxes.children[0].querySelectorAll("p")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(checkboxes.children[0].querySelectorAll("p")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(checkboxes.children[0].querySelectorAll("p")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(checkboxes.children[0].querySelectorAll("input")[0].id).toMatch("ag-checkbox-0");
    expect(checkboxes.children[0].querySelectorAll("input")[0].innerHTML).toMatch("");
    expect(checkboxes.children[0].querySelectorAll("input")[0].getAttribute("name")).toMatch("ag-checkbox-0");
    expect(checkboxes.children[0].querySelectorAll("input")[0].getAttribute("type")).toMatch("checkbox");
    expect(checkboxes.children[0].querySelectorAll("input")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(checkboxes.children[0].querySelectorAll("input")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(checkboxes.children[0].querySelectorAll("input")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(checkboxes.children[0].querySelectorAll("input")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(checkboxes.children[0].querySelectorAll("span")[0].id).toMatch("ag-checkbox-0-label");
    expect(checkboxes.children[0].querySelectorAll("span")[0].innerHTML).toMatch("This is some test content");
    expect(checkboxes.children[0].querySelectorAll("span")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(checkboxes.children[0].querySelectorAll("span")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(checkboxes.children[0].querySelectorAll("span")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(checkboxes.children[0].querySelectorAll("span")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(checkboxes.children[1].tagName).toMatch("LABEL");
    expect(checkboxes.children[1].className.indexOf("ag-checkbox-container")).not.toBe(-1);
    expect(checkboxes.children[1].getAttribute("for")).toMatch("ag-checkbox-1");
    expect(checkboxes.children[1].children.length).toBe(3);
    expect(checkboxes.children[1].querySelectorAll("random").length).toBe(0);

    expect(checkboxes.children[1].querySelectorAll("p")[0].id).toMatch("ag-checkbox-1-error");
    expect(checkboxes.children[1].querySelectorAll("p")[0].innerHTML).toMatch("This is some test content");
    expect(checkboxes.children[1].querySelectorAll("p")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(checkboxes.children[1].querySelectorAll("p")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(checkboxes.children[1].querySelectorAll("p")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(checkboxes.children[1].querySelectorAll("p")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(checkboxes.children[1].querySelectorAll("input")[0].id).toMatch("ag-checkbox-1");
    expect(checkboxes.children[1].querySelectorAll("input")[0].innerHTML).toMatch("");
    expect(checkboxes.children[1].querySelectorAll("input")[0].getAttribute("name")).toMatch("ag-checkbox-1");
    expect(checkboxes.children[1].querySelectorAll("input")[0].getAttribute("type")).toMatch("checkbox");
    expect(checkboxes.children[1].querySelectorAll("input")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(checkboxes.children[1].querySelectorAll("input")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(checkboxes.children[1].querySelectorAll("input")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(checkboxes.children[1].querySelectorAll("input")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(checkboxes.children[1].querySelectorAll("span")[0].id).toMatch("ag-checkbox-1-label");
    expect(checkboxes.children[1].querySelectorAll("span")[0].innerHTML).toMatch("This is some test content");
    expect(checkboxes.children[1].querySelectorAll("span")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(checkboxes.children[1].querySelectorAll("span")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(checkboxes.children[1].querySelectorAll("span")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(checkboxes.children[1].querySelectorAll("span")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(checkboxes.children[2].tagName).toMatch("LABEL");
    expect(checkboxes.children[2].className.indexOf("ag-checkbox-container")).not.toBe(-1);
    expect(checkboxes.children[2].getAttribute("for")).toMatch("ag-checkbox-2");
    expect(checkboxes.children[2].children.length).toBe(3);
    expect(checkboxes.children[2].querySelectorAll("random").length).toBe(0);

    expect(checkboxes.children[2].querySelectorAll("p")[0].id).toMatch("ag-checkbox-2-error");
    expect(checkboxes.children[2].querySelectorAll("p")[0].innerHTML).toMatch("This is some test content");
    expect(checkboxes.children[2].querySelectorAll("p")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(checkboxes.children[2].querySelectorAll("p")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(checkboxes.children[2].querySelectorAll("p")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(checkboxes.children[2].querySelectorAll("p")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(checkboxes.children[2].querySelectorAll("input")[0].id).toMatch("ag-checkbox-2");
    expect(checkboxes.children[2].querySelectorAll("input")[0].innerHTML).toMatch("");
    expect(checkboxes.children[2].querySelectorAll("input")[0].getAttribute("name")).toMatch("ag-checkbox-2");
    expect(checkboxes.children[2].querySelectorAll("input")[0].getAttribute("type")).toMatch("checkbox");
    expect(checkboxes.children[2].querySelectorAll("input")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(checkboxes.children[2].querySelectorAll("input")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(checkboxes.children[2].querySelectorAll("input")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(checkboxes.children[2].querySelectorAll("input")[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(checkboxes.children[2].querySelectorAll("span")[0].id).toMatch("ag-checkbox-2-label");
    expect(checkboxes.children[2].querySelectorAll("span")[0].innerHTML).toMatch("This is some test content");
    expect(checkboxes.children[2].querySelectorAll("span")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(checkboxes.children[2].querySelectorAll("span")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(checkboxes.children[2].querySelectorAll("span")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(checkboxes.children[2].querySelectorAll("span")[0].getAttribute("testAttributeB")).toMatch("testValueB");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/17
  it("Should create a country element with default settings", () => {

    let country = modal.generateCountry();

    expect(country.className.indexOf("ag-modal-content-row")).not.toBe(-1);

    expect(country.querySelectorAll("p").length).not.toBe(0);
    expect(country.children[0].id).toMatch("ag-country-error");
    expect(country.children[0].className.indexOf("ag-country-error")).not.toBe(-1);
    expect(country.children[0].innerHTML).toMatch("Sorry, this site does not allow access from the country you have selected.");

    expect(country.querySelectorAll("label").length).not.toBe(0);
    expect(country.children[1].id).toMatch("ag-country-label");
    expect(country.children[1].className.indexOf("ag-country-label")).not.toBe(-1);
    expect(country.children[1].getAttribute("for")).toMatch("ag-country");
    expect(country.children[1].innerHTML).toMatch("Select the country you are in:");

    expect(country.querySelectorAll("select").length).not.toBe(0);
    expect(country.children[2].id).toMatch("ag-country");
    expect(country.children[2].className.indexOf("ag-country")).not.toBe(-1);
    expect(country.children[2].getAttribute("name")).toMatch("ag-country");
    expect(country.children[2].innerHTML.indexOf("<option")).not.toBe(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/17
  it("Should create a country element with custom settings", () => {

    let country = modal.generateCountry({
      error: {
        id: "dummyId",
        tagName: "random",
        content: "This is some test content",
        classes: [
          "testClassA",
          "testClassB"
        ],
        attributes: {
          testAttributeA: "testValueA",
          testAttributeB: "testValueB"
        }
      },
      label: {
        id: "dummyId",
        tagName: "random",
        content: "This is some test content",
        classes: [
          "testClassA",
          "testClassB"
        ],
        attributes: {
          testAttributeA: "testValueA",
          testAttributeB: "testValueB"
        }
      },
      input: {
        id: "dummyId",
        tagName: "random",
        content: "This is some test content",
        classes: [
          "testClassA",
          "testClassB"
        ],
        attributes: {
          testAttributeA: "testValueA",
          testAttributeB: "testValueB"
        }
      }
    });

    expect(country.className.indexOf("ag-modal-content-row")).not.toBe(-1);
    expect(country.querySelectorAll("random").length).toBe(0);

    expect(country.querySelectorAll("p").length).not.toBe(0);
    expect(country.children[0].id).toMatch("ag-country-error");
    expect(country.children[0].className.indexOf("ag-country-error")).not.toBe(-1);
    expect(country.children[0].innerHTML).toMatch("This is some test content");
    expect(country.children[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(country.children[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(country.children[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(country.children[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(country.querySelectorAll("label").length).not.toBe(0);
    expect(country.children[1].id).toMatch("ag-country-label");
    expect(country.children[1].className.indexOf("ag-country-label")).not.toBe(-1);
    expect(country.children[1].getAttribute("for")).toMatch("ag-country");
    expect(country.children[1].innerHTML).toMatch("This is some test content");
    expect(country.children[1].className.indexOf("testClassA")).not.toBe(-1);
    expect(country.children[1].className.indexOf("testClassB")).not.toBe(-1);
    expect(country.children[1].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(country.children[1].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(country.querySelectorAll("select").length).not.toBe(0);
    expect(country.children[2].id).toMatch("ag-country");
    expect(country.children[2].className.indexOf("ag-country")).not.toBe(-1);
    expect(country.children[2].getAttribute("name")).toMatch("ag-country");
    expect(country.children[2].innerHTML.indexOf("<option")).not.toBe(-1);
    expect(country.children[2].className.indexOf("testClassA")).not.toBe(-1);
    expect(country.children[2].className.indexOf("testClassB")).not.toBe(-1);
    expect(country.children[2].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(country.children[2].getAttribute("testAttributeB")).toMatch("testValueB");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/18
  it("Should create a language element with default settings", () => {

    let language = modal.generateLanguage();

    expect(language.className.indexOf("ag-modal-content-row")).not.toBe(-1);

    expect(language.querySelectorAll("p").length).not.toBe(0);
    expect(language.children[0].id).toMatch("ag-language-error");
    expect(language.children[0].className.indexOf("ag-language-error")).not.toBe(-1);
    expect(language.children[0].innerHTML).toMatch("Sorry, the language you have selected is not supported.");

    expect(language.querySelectorAll("label").length).not.toBe(0);
    expect(language.children[1].id).toMatch("ag-language-label");
    expect(language.children[1].className.indexOf("ag-language-label")).not.toBe(-1);
    expect(language.children[1].getAttribute("for")).toMatch("ag-language");
    expect(language.children[1].innerHTML).toMatch("Select your language:");

    expect(language.querySelectorAll("select").length).not.toBe(0);
    expect(language.children[2].id).toMatch("ag-language");
    expect(language.children[2].className.indexOf("ag-language")).not.toBe(-1);
    expect(language.children[2].getAttribute("name")).toMatch("ag-language");
    expect(language.children[2].innerHTML.indexOf("<option")).not.toBe(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/18
  it("Should create a language element with custom settings", () => {

    let language = modal.generateLanguage({
      error: {
        id: "dummyId",
        tagName: "random",
        content: "This is some test content",
        classes: [
          "testClassA",
          "testClassB"
        ],
        attributes: {
          testAttributeA: "testValueA",
          testAttributeB: "testValueB"
        }
      },
      label: {
        id: "dummyId",
        tagName: "random",
        content: "This is some test content",
        classes: [
          "testClassA",
          "testClassB"
        ],
        attributes: {
          testAttributeA: "testValueA",
          testAttributeB: "testValueB"
        }
      },
      input: {
        id: "dummyId",
        tagName: "random",
        content: "This is some test content",
        classes: [
          "testClassA",
          "testClassB"
        ],
        attributes: {
          testAttributeA: "testValueA",
          testAttributeB: "testValueB"
        }
      }
    });

    expect(language.className.indexOf("ag-modal-content-row")).not.toBe(-1);
    expect(language.querySelectorAll("random").length).toBe(0);

    expect(language.querySelectorAll("p").length).not.toBe(0);
    expect(language.children[0].id).toMatch("ag-language-error");
    expect(language.children[0].className.indexOf("ag-language-error")).not.toBe(-1);
    expect(language.children[0].innerHTML).toMatch("This is some test content");
    expect(language.children[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(language.children[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(language.children[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(language.children[0].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(language.querySelectorAll("label").length).not.toBe(0);
    expect(language.children[1].id).toMatch("ag-language-label");
    expect(language.children[1].className.indexOf("ag-language-label")).not.toBe(-1);
    expect(language.children[1].getAttribute("for")).toMatch("ag-language");
    expect(language.children[1].innerHTML).toMatch("This is some test content");
    expect(language.children[1].className.indexOf("testClassA")).not.toBe(-1);
    expect(language.children[1].className.indexOf("testClassB")).not.toBe(-1);
    expect(language.children[1].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(language.children[1].getAttribute("testAttributeB")).toMatch("testValueB");

    expect(language.querySelectorAll("select").length).not.toBe(0);
    expect(language.children[2].id).toMatch("ag-language");
    expect(language.children[2].className.indexOf("ag-language")).not.toBe(-1);
    expect(language.children[2].getAttribute("name")).toMatch("ag-language");
    expect(language.children[2].innerHTML.indexOf("<option")).not.toBe(-1);
    expect(language.children[2].className.indexOf("testClassA")).not.toBe(-1);
    expect(language.children[2].className.indexOf("testClassB")).not.toBe(-1);
    expect(language.children[2].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(language.children[2].getAttribute("testAttributeB")).toMatch("testValueB");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/19
  it("Should create a button element with default settings", () => {

    let button = modal.generateButton();

    expect(button.className.indexOf("ag-modal-content-row")).not.toBe(-1);
    expect(button.querySelectorAll("button").length).not.toBe(0);
    expect(button.querySelectorAll("button")[0].id).toMatch("ag-button");
    expect(button.querySelectorAll("button")[0].className.indexOf("ag-button")).not.toBe(-1);
    expect(button.querySelectorAll("button")[0].getAttribute("type")).toMatch("button");
    expect(button.querySelectorAll("button")[0].innerHTML).toMatch("Let me in");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/19
  it("Should create a button element with custom settings", () => {

    let button = modal.generateButton({
      id: "dummyId",
      tagName: "random",
      content: "This is some test content",
      classes: [
        "testClassA",
        "testClassB"
      ],
      attributes: {
        testAttributeA: "testValueA",
        testAttributeB: "testValueB"
      }
    });

    expect(button.className.indexOf("ag-modal-content-row")).not.toBe(-1);
    expect(button.querySelectorAll("button").length).not.toBe(0);
    expect(button.querySelectorAll("random").length).toBe(0);

    expect(button.querySelectorAll("button")[0].id).toMatch("ag-button");
    expect(button.querySelectorAll("button")[0].className.indexOf("ag-button")).not.toBe(-1);
    expect(button.querySelectorAll("button")[0].getAttribute("type")).toMatch("button");
    expect(button.querySelectorAll("button")[0].innerHTML).toMatch("This is some test content");
    expect(button.querySelectorAll("button")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(button.querySelectorAll("button")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(button.querySelectorAll("button")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(button.querySelectorAll("button")[0].getAttribute("testAttributeB")).toMatch("testValueB");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/20
  it("Should create a disclaimer element with default settings", () => {

    let disclaimer = modal.generateDisclaimer();

    expect(disclaimer.className.indexOf("ag-modal-content-row")).not.toBe(-1);
    expect(disclaimer.querySelectorAll("p").length).not.toBe(0);
    expect(disclaimer.querySelectorAll("p")[0].id).toMatch("ag-disclaimer");
    expect(disclaimer.querySelectorAll("p")[0].className.indexOf("ag-disclaimer")).not.toBe(-1);
    expect(disclaimer.querySelectorAll("p")[0].innerHTML).toMatch("Disclaimer text");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/20
  it("Should create a disclaimer element with custom settings", () => {

    let disclaimer = modal.generateDisclaimer({
      id: "dummyId",
      tagName: "random",
      content: "This is some test content",
      classes: [
        "testClassA",
        "testClassB"
      ],
      attributes: {
        testAttributeA: "testValueA",
        testAttributeB: "testValueB"
      }
    });

    expect(disclaimer.className.indexOf("ag-modal-content-row")).not.toBe(-1);
    expect(disclaimer.querySelectorAll("p").length).not.toBe(0);
    expect(disclaimer.querySelectorAll("random").length).toBe(0);

    expect(disclaimer.querySelectorAll("p")[0].id).toMatch("ag-disclaimer");
    expect(disclaimer.querySelectorAll("p")[0].className.indexOf("ag-disclaimer")).not.toBe(-1);
    expect(disclaimer.querySelectorAll("p")[0].innerHTML).toMatch("This is some test content");
    expect(disclaimer.querySelectorAll("p")[0].className.indexOf("testClassA")).not.toBe(-1);
    expect(disclaimer.querySelectorAll("p")[0].className.indexOf("testClassB")).not.toBe(-1);
    expect(disclaimer.querySelectorAll("p")[0].getAttribute("testAttributeA")).toMatch("testValueA");
    expect(disclaimer.querySelectorAll("p")[0].getAttribute("testAttributeB")).toMatch("testValueB");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it("Should create the elements in the correct order", () => {

    let contents = modal.generateContents({
      title: {},
      intro: {},
      image: {},
      radio: {},
      checkboxes: [{}],
      button: {},
      disclaimer: {}
    });

    expect(contents.children[0].children[0].id).toMatch("ag-title");
    expect(contents.children[contents.children.length - 1].children[0].id).toMatch("ag-disclaimer");

    contents = modal.generateContents({
      disclaimer: {},
      button: {},
      checkboxes: [{}],
      image: {},
      radio: {},
      intro: {},
      title: {}
    });

    expect(contents.children[0].children[0].id).toMatch("ag-title");
    expect(contents.children[contents.children.length - 1].children[0].id).toMatch("ag-disclaimer");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/17
  // https://github.com/darryl-snow/age-gate-js/issues/18
  it("Should generate a select list", () => {

    let list = {
      key1: "value1",
      key2: "value2",
      key3: "value3",
    };

    let options = modal.generateSelectList(list);

    expect(typeof(options)).toBe("string");
    expect(options.indexOf("<option value=\"key1\">value1</option>")).not.toBe(-1);
    expect(options.indexOf("<option value=\"key2\">value2</option>")).not.toBe(-1);
    expect(options.indexOf("<option value=\"key3\">value3</option>")).not.toBe(-1);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/17
  it("Should get a list of all countries (in English)", () => {

   let countries = modal.getCountryList();

   // Choose some countries at random...
   expect(countries["JE"]).toMatch("Jersey");
   expect(countries["CN"]).toMatch("China");
   expect(countries["GB"]).toMatch("United Kingdom");
   expect(countries["DE"]).toMatch("Germany");
   expect(countries["ZW"]).toMatch("Zimbabwe");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  // it(`Should retain focus inside the modal content element when it is
  //    displayed`, () => {
  //
  // });

  // https://github.com/darryl-snow/age-gate-js/issues/7
  it(`Should assign sequential tab index values to all focusable elements inside
     the modal content element`, () => {

    let contents = modal.generateContents({
      title: {},
      intro: {},
      image: {},
      radio: {},
      checkboxes: [{}, {}],
      button: {},
      disclaimer: {}
    });

    expect(contents.querySelectorAll("#ag-radio-yes")[0].getAttribute("tabindex")).toMatch("1");
    expect(contents.querySelectorAll("#ag-radio-no")[0].getAttribute("tabindex")).toMatch("2");
    expect(contents.querySelectorAll("#ag-checkbox-0")[0].getAttribute("tabindex")).toMatch("3");
    expect(contents.querySelectorAll("#ag-checkbox-1")[0].getAttribute("tabindex")).toMatch("4");
    expect(contents.querySelectorAll("#ag-button")[0].getAttribute("tabindex")).toMatch("5");

    contents = modal.generateContents({
      title: {},
      intro: {},
      image: {},
      dateOfBirth: {
        day: {},
        month: {},
        year: {}
      },
      button: {},
      disclaimer: {}
    });

    expect(contents.querySelectorAll("#ag-dob-day")[0].getAttribute("tabindex")).toMatch("1");
    expect(contents.querySelectorAll("#ag-dob-month")[0].getAttribute("tabindex")).toMatch("2");
    expect(contents.querySelectorAll("#ag-dob-year")[0].getAttribute("tabindex")).toMatch("3");
    expect(contents.querySelectorAll("#ag-button")[0].getAttribute("tabindex")).toMatch("4");

  });

});
