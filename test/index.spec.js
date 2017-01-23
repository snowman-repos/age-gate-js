import Modal from "../src/modal/modal";

describe("Age Gate", () => {

  let ageGate, modal, body = null;

  beforeAll((done) => {

    console.log(typeof window.callPhantom === 'function');

    ageGate = document.createElement("div");
    ageGate.id = "ag-root";

    document.addEventListener("DOMContentLoaded", (event) => {
      document.body.appendChild(ageGate);
      modal = new Modal(ageGate);
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

  it("Should place the curtain element above anything else on the page", () => {

    //get the highest z-index - 1, check it's the curtain, check it's not 0
    //get a list of all z-indexes on the page that aren't auto
    //if the list length is more than 2, check that the 2nd from last is curtain
    //otherwise check that the 1st is curtain

    expect(true).toBe(true);

  });

  it("Should place the dialog element above the curtain", () => {

    //get the highest z-index, check it's the dialog
    //check that the dialog zindex is higher than the curtain zindex

    expect(true).toBe(true);

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
