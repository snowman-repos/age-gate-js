import Intro from "./intro";

describe("Modal Content: Intro", () => {

  // https://github.com/darryl-snow/age-gate-js/issues/9
  it("Should return a paragraph element", () => {

    let intro = new Intro();

    expect(typeof(intro)).toBe("object");
    expect(intro.tagName).toBe("P");

  });

  // https://github.com/darryl-snow/age-gate-js/issues/9
  it("Should be able to set the text in the intro", () => {

    let intro = new Intro();
    expect(intro.textContent).toBe("undefined");

    let testPhrase = "Testing1 2 3";
    intro = new Intro({
      content: testPhrase
    });

    expect(intro.textContent).toMatch(testPhrase);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/9
  it("Should be able to add a single class to the intro", () => {

    let testClass = "testClass";
    let intro = new Intro({
      classes: testClass
    });

    expect(intro.classList.contains(testClass)).toBe(true);

  });

  // https://github.com/darryl-snow/age-gate-js/issues/9
  it("Should be able to parse HTML content", () => {

    let testContent = `This is <em>italic text</em> and this is <strong>bold
     text</strong> and this is <a href="http://google.com">a link</a>, while
      <span style="text-decoration: underline;">this is underlined</span>.`;

    let intro = new Intro({
      content: testContent
    });

    expect(intro.innerHTML).toMatch(testContent);
    expect(intro.querySelectorAll('em').length).toEqual(1);
    expect(intro.querySelectorAll('strong').length).toEqual(1);
    expect(intro.querySelectorAll('a').length).toEqual(1);

  });

});
