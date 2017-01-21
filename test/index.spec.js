import Modal from "../src/modal/modal";

describe("Age Gate", () => {

  let ageGate = null;

  beforeAll(() => {

    ageGate = document.createElement("div");
    ageGate.id = "ag-root";

  });

  it("should append the modal", () => {

    document.addEventListener("DOMContentLoaded", (event) => {

      let modal = new Modal(ageGate);

      let el = document.querySelectorAll("#ag-curtain");
      expect(el.length).not.toBe(0);

      el = document.querySelectorAll("#ag-dialog");
      expect(el.length).not.toBe(0);

    });

  });

  it("should be able to add elements to the modal", () => {

    document.addEventListener("DOMContentLoaded", (event) => {

      let modal = new Modal(ageGate);
      let testPhrase = "testing123";

      modal.createElement(testPhrase);

      let el = document.querySelectorAll("#ag-" + testPhrase);
      expect(el.length).not.toBe(0);

    });

  });

});
