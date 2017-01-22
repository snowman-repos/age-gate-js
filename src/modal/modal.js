import styles from "./modal.css";

export default class Modal {

  constructor(parent) {

    this.el = {
      body: document.body,
      curtain: null,
      dialog: null,
      parent: parent
    };

    this.el.curtain = this.createElement("curtain");
    this.el.dialog = this.createElement("dialog");

    this.state = {
      shown: false
    };

  }

  createElement(element) {

    let el = document.createElement("div");
    el.id = "ag-" + element;
    el.classList.add(styles["ag" + element.charAt(0).toUpperCase() + element.slice(1)]);
    return(this.el.parent.appendChild(el));

  }

  hide() {

    this.el.curtain.classList.remove(styles.agCurtainIsShown);
    this.el.dialog.classList.remove(styles.agDialogIsShown);
    this.state.shown = false;
    this.toggleBodyLock();

  }

  toggleBodyLock() {

    let body = this.el.body;

    if(body.classList.contains(styles.agBodyIsLocked)) {
      this.el.body.classList.remove(styles.agBodyIsLocked);
    } else {
      this.el.body.classList.add(styles.agBodyIsLocked);
    }

  }

  show() {

    this.el.curtain.classList.add(styles.agCurtainIsShown);
    this.el.dialog.classList.add(styles.agDialogIsShown);
    this.state.shown = true;
    this.toggleBodyLock();

  }

}
