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

    if(element != "curtain" && element != "dialog") return false;
    if(this.el.curtain != null && element == "curtain") return false;
    if(this.el.dialog != null && element == "dialog") return false;

    let el = document.createElement("div");
    let zindex = this.getHighestZIndex();
    el.id = "ag-" + element;
    el.classList.add(styles["ag" + element.charAt(0).toUpperCase() + element.slice(1)]);
    el.style.zIndex = zindex + 1;
    return(this.el.parent.appendChild(el));

  }

  getHighestZIndex() {

    let elements = document.getElementsByTagName("*");
    let highest = 0;

    for(let i = 0; i < elements.length; i++) {

      let computedStyle = document.defaultView.getComputedStyle(elements[i], null).getPropertyValue("z-index");
      let zindex = Number(!isNaN(computedStyle) || elements[i].style.zIndex == "" ? 0 : elements[i].style.zIndex);

      if(zindex > highest && zindex != 'auto') {
        highest = zindex
      }

    }

    return highest;

  }

  hide() {

    if(!this.state.shown) return false;

    this.el.curtain.classList.remove(styles.agCurtainIsShown);
    this.el.dialog.classList.remove(styles.agDialogIsShown);
    this.state.shown = false;
    this.toggleBodyLock();
    return true;

  }

  toggleBodyLock() {

    let body = this.el.body;

    if(body.classList.contains(styles.agBodyIsLocked)) {
      this.el.body.classList.remove(styles.agBodyIsLocked);
    } else {
      this.el.body.classList.add(styles.agBodyIsLocked);
    }

    return true;

  }

  show() {

    if(this.state.shown) return false;

    this.el.curtain.classList.add(styles.agCurtainIsShown);
    this.el.dialog.classList.add(styles.agDialogIsShown);
    this.state.shown = true;
    this.toggleBodyLock();
    return true;

  }

}
