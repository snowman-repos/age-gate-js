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

  // it(`Should retain focus inside the modal content element when it is
  //    displayed`, () => {
  //
  // });
  //
  // it(`Should assign sequential tab index values to all focusable elements inside
  //    the modal content element`, () => {
  //
  // });

});
