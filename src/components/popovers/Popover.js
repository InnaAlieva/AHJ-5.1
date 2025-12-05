import './popover.css';

export default class Popover {
  constructor(popoverToggle, id) {
    if (typeof id !== 'number') {
      throw new Error('The `id` parameter must be a number');
    }

    this.id = id;
    this.popoverToggle = popoverToggle;
    this.title = this.popoverToggle.dataset.title;
    this.info = this.popoverToggle.dataset.info;

    this.onClick = this.onClick.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  static markup(id, title, info) {
    return `
      <div class="popover" data-id="${id}">
        <title class="popover__title">${title}</title>
        <div class="popover__info">${info}</div>
        <div class="popover__arrow"></div>
      </div>
    `;
  }

  get selector() {
    return `.popover[data-id="${this.id}"]`;
  }

  bindToDOM() {
    this.popoverToggle.addEventListener('click', this.onClick);
  }

  onClick() {
    this.element = document.querySelector(this.selector);

    if (this.element) {
      window.removeEventListener('resize', this.onResize);
      this.element.remove();
    } else {
      document.body.insertAdjacentHTML('beforeEnd', Popover.markup(this.id, this.title, this.info));
      this.element = document.querySelector(this.selector);
      this.elementPositioning();

      window.addEventListener('resize', this.onResize);
    }
  }

  onResize() {
    if (this.element) this.elementPositioning();
  }

  elementPositioning() {
    const { top, left } = this.popoverToggle.getBoundingClientRect();
    const arrow = this.element.querySelector('.popover__arrow');

    this.element.style.top = `${top - this.element.offsetHeight - arrow.offsetHeight + 1}px`;
    this.element.style.left = `${left + this.popoverToggle.offsetWidth / 2 - this.element.offsetWidth / 2}px`;
  }
}
