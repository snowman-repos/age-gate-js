import Modal from "../src/modal/modal";

describe("Age Gate", () => {

  let ageGate, modal, body = null;

  beforeAll((done) => {

    ageGate = document.createElement("div");
    ageGate.id = "ag-root";

    document.addEventListener("DOMContentLoaded", (event) => {
      document.body.appendChild(ageGate);
      modal = new Modal(ageGate);
      body = document.body;
      done();
    });

  });

  it("should append the modal", () => {

    let el = document.querySelectorAll("#ag-curtain");
    expect(el.length).not.toBe(0);

    el = document.querySelectorAll("#ag-dialog");
    expect(el.length).not.toBe(0);

  });

  it("should be able to add elements to the modal", () => {

    let testPhrase = "testing123";

    modal.createElement(testPhrase);

    let el = document.querySelectorAll("#ag-" + testPhrase);
    expect(el.length).not.toBe(0);

  });

  it("should lock the body element to prevent scrolling", () => {

    // expect(window.getComputedStyle(body, null).overflow).toBe("visible");
    expect(body.className.indexOf("ag-body-is-locked")).toBe(-1);

    modal.toggleBodyLock();

    // expect(window.getComputedStyle(body, null).overflow).toBe("hidden");
    expect(body.className.indexOf("ag-body-is-locked")).not.toBe(-1);

  });

});
