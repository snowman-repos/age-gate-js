import Modal from "./modal";

describe("Age Gate", () => {

  let ageGate, modal, body, curtain, dialog = null;

  beforeAll((done) => {

    // Before all tests, create a container element for the age gate
    // that we can append the modal to
    ageGate = document.createElement("div");
    ageGate.id = "ag-root";

    // We have to wait until there is a body before we
    // can append anything to it :)
    document.addEventListener("DOMContentLoaded", () => {

      // Append some dummy page content
      // NOTE: we give the container an arbitrary z-index value
      // so we can test against this later
      document.body.innerHTML = `
        <div class="container" style="z-index: 10;">
          <h1>Hello World</h1>
          <p>This is a test</p>
        </div>
      `;

      document.body.appendChild(ageGate);
      body = document.body;

      // Continue with the tests
      done();

    });

  });

  // Setup a fresh modal before each test and save references
  // to the curtain and dialog elements
  beforeEach(() => {

    modal = new Modal(ageGate);
    curtain = document.getElementById("ag-curtain");
    dialog = document.getElementById("ag-dialog");

  });

  // Reset the modal after each test
  afterEach(() => {

    ageGate.innerHTML = "";
    modal = null;

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

    // 12 because we gave the page content a z-index of 10
    // (see beforeAll), then the curtain and dialog should each
    // be 1 level up: 10 + 1 + 1 = 12 = the dialog z-index
    expect(modal.getHighestZIndex()).toEqual(12);

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
    modal = new Modal(ageGate);

    // Now the highest z-index should be the same as it was
    // at the start: original dummy content z-index (10) + curtain
    // z-index increment (1) + dialog z-index increment (1) = 12
    expect(modal.getHighestZIndex()).toEqual(12);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/5
  it("Should place the curtain element above anything else on the page", () => {

    expect(Number(curtain.style.zIndex)).toEqual(modal.getHighestZIndex() - 1);

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

  it(`Should only be able to place curtain or dialog elements
     to the modal`, () => {

    let el, result = null;

    // Try to append an element other than curtain or dialog
    // It should **not** be able to append such an element
    let testPhrase = "testing123";
    result = modal.createElement(testPhrase);
    el = document.querySelectorAll("#ag-" + testPhrase);
    expect(el.length).toBe(0);
    expect(result).toBe(false);

    // First remove the modal's reference to the curtain and try
    // to append a curtain element
    // It should be able to append a curtain element
    modal.el.curtain = null;
    result = modal.createElement("curtain");
    curtain = document.querySelectorAll("#ag-curtain");
    expect(curtain.length).not.toBe(0);
    expect(result).not.toBe(false);

    // First remove the modal's reference to the dialog and try
    // to append a dialog element
    // It should be able to append a dialog element
    modal.el.dialog = null;
    result = modal.createElement("dialog");
    dialog = document.querySelectorAll("#ag-dialog");
    expect(dialog.length).not.toBe(0);
    expect(result).not.toBe(false);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/5
  it("Should not add a curtain element if there is one already", () => {

    let result = modal.createElement("curtain");
    expect(result).toBe(false);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/6
  it("Should not add a dialog element if there is one already", () => {

    let result = modal.createElement("dialog");
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
  it(`Should be able to toggle the control classes on the body,
    and the curtain and dialog elements`, () => {

    // State control classes are applied to the body, the
    // curtain, and the dialog elements
    // The modal is not shown by default so these state
    // control classes should not be applied
    expect(body.className.indexOf("is-locked")).toEqual(-1);
    expect(curtain.className.indexOf("is-shown")).toEqual(-1);
    expect(dialog.className.indexOf("is-shown")).toEqual(-1);

    modal.toggleClasses();

    // After calling the toggleClasses function, the state
    // control classes should be applied
    expect(body.className.indexOf("is-locked")).not.toEqual(-1);
    expect(curtain.className.indexOf("is-shown")).not.toEqual(-1);
    expect(dialog.className.indexOf("is-shown")).not.toEqual(-1);

    modal.toggleClasses();

    // After calling the toggleClasses function again, the state
    // control classes __should__ be applied
    expect(body.className.indexOf("is-locked")).toEqual(-1);
    expect(curtain.className.indexOf("is-shown")).toEqual(-1);
    expect(dialog.className.indexOf("is-shown")).toEqual(-1);

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

  it(`Should be able to toggle the aria-hidden attribute on the curtain
     and the dialog elements`, () => {

    // Expect it to be true because the dialog is hiden by default
    expect(curtain.getAttribute("aria-hidden")).toBe("true");
    expect(dialog.getAttribute("aria-hidden")).toBe("true");

    modal.state.shown = true;
    modal.toggleAriaHidden();

    expect(curtain.getAttribute("aria-hidden")).toBe("false");
    expect(dialog.getAttribute("aria-hidden")).toBe("false");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/5
  // https://github.com/darryl-snow/age-gate-js/issues/6
  it(`Should set aria-hidden='true' when the curtain is hidden and
   aria-hidden='false' when the curtain is shown`, () => {

    // Expect it to be true because the curtain is hiden by default
    expect(curtain.getAttribute('aria-hidden')).toBe("true");

    modal.show();

    expect(curtain.getAttribute('aria-hidden')).toBe("false");

    modal.hide();

    expect(curtain.getAttribute('aria-hidden')).toBe("true");

  });

  it(`Should set aria-hidden='true' when the dialog is hidden and
   aria-hidden='false' when the dialog is shown`, () => {

    // Expect it to be true because the dialog is hiden by default
    expect(dialog.getAttribute('aria-hidden')).toBe("true");

    modal.show();

    expect(dialog.getAttribute('aria-hidden')).toBe("false");

    modal.hide();

    expect(dialog.getAttribute('aria-hidden')).toBe("true");

  });

});
