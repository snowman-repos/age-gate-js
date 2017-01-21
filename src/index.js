import Modal from "./modal/modal";

let ageGate = document.createElement("div");
ageGate.id = "ag-root";

document.addEventListener("DOMContentLoaded", (event) => {
   document.body.appendChild(ageGate);
   let modal = new Modal(ageGate);
   modal.show();
});
