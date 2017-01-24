import Modal from "./modal";

describe("Age Gate", () => {

  let ageGate, modal, body = null;

  beforeAll((done) => {

    ageGate = document.createElement("div");
    ageGate.id = "ag-root";

    document.addEventListener("DOMContentLoaded", (event) => {

      document.body.innerHTML = `
        <div class="container" style="z-index: 10;">
          <h1>Hello World</h1>
          <p>This is a test</p>
        </div>
      `;

      document.body.appendChild(ageGate);
      body = document.body;

      done();
    });

  });

  beforeEach(() => {

    modal = new Modal(ageGate);

  });

  afterEach(() => {

    ageGate.innerHTML = "";

  });

  it("Should add a curtain element to the age gate", () => {

    let el = document.querySelectorAll("#ag-curtain");
    expect(el.length).not.toBe(0);
    expect(el[0].parentElement.id).toBe("ag-root");

  });

  it("Should add a dialog element to the age gate", () => {

    let el = document.querySelectorAll("#ag-dialog");
    expect(el.length).not.toBe(0);
    expect(el[0].parentElement.id).toBe("ag-root");

  });

  it("Should find the highest z-index on the page", () => {


    expect(modal.getHighestZIndex()).toEqual(12);
    ageGate.innerHTML = "";
    expect(modal.getHighestZIndex()).toEqual(10);
    let el = document.createElement("div");
    el.style.zIndex = 5;
    document.body.appendChild(el);
    expect(modal.getHighestZIndex()).toEqual(10);
    el.style.zIndex = 100;
    expect(modal.getHighestZIndex()).toEqual(100);
    el.parentElement.removeChild(el);
    modal = new Modal(ageGate);
    expect(modal.getHighestZIndex()).toEqual(12);

  });

  it("Should place the curtain element above anything else on the page", () => {

    let curtain = document.getElementById("ag-curtain");
    expect(Number(curtain.style.zIndex)).toEqual(modal.getHighestZIndex() - 1);

  });

  it("Should place the dialog element above the curtain", () => {

    let curtain = document.getElementById("ag-curtain");
    let dialog = document.getElementById("ag-dialog");
    expect(dialog.style.zIndex).toBeGreaterThan(curtain.style.zIndex);

  });

  it("Should stretch the curtain element to the entire viewport width, minus the scrollbar", () => {

    let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    let curtain = document.querySelectorAll("#ag-curtain");
    let curtainWidth = window.getComputedStyle(curtain[0], null).width;

    expect(Number(curtainWidth.substr(0, curtainWidth.length-2))).toEqual(viewportWidth - 16);


  });

  it("Should only be able to place curtain or dialog elements to the modal", () => {

    let el, result = null;

    let testPhrase = "testing123";
    result = modal.createElement(testPhrase);
    el = document.querySelectorAll("#ag-" + testPhrase);
    expect(el.length).toBe(0);
    expect(result).toBe(false);

    modal.el.curtain = null;
    result = modal.createElement("curtain");
    expect(result).not.toBe(false);

    modal.el.dialog = null;
    result = modal.createElement("dialog");
    expect(result).not.toBe(false);

  });

  it("Should not add a curtain element if there is one already", () => {

    let result = modal.createElement("curtain");
    expect(result).toBe(false);

  });

  it("Should not add a dialog element if there is one already", () => {

    let result = modal.createElement("dialog");
    expect(result).toBe(false);

  });

  it("Should add a class to the body element to prevent scrolling", () => {

    expect(body.className.indexOf("ag-body-is-locked")).toBe(-1);

    modal.toggleBodyLock();

    expect(body.className.indexOf("ag-body-is-locked")).not.toBe(-1);

  });

});
