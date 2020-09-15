/**
 * Build styles
 */
require("./index.css").toString();

/**
 * Import Tool's icon
 */
import ToolboxIcon from "./svg/toolbox.svg";

/**
 * @class Spoiler
 * @classdesc Spoiler Tool for Editor.js
 * @property {SpoilerData} data - Spoiler Tool`s input and output data
 * @property {object} api - Editor.js API instance
 *
 * @typedef {object} SpoilerData
 * @description Spoiler Tool`s input and output data
 * @property {string} title - spoiler`s title
 * @property {string} text - spoiler`s text
 * @property {'default'|'simple'} spoiler_type - spoiler`s spoiler_type
 *
 * @typedef {object} SpoilerConfig
 * @description Spoiler Tool`s initial configuration
 * @property {string} titlePlaceholder - placeholder to show in spoiler`s title input
 * @property {string} textPlaceholder - placeholder to show in spoiler`s text input
 * @property {'default'|'simple'} default spoiler type
 */
export default class Spoiler {
  /**
   * Get Toolbox settings
   *
   * @public
   * @return {string}
   */
  static get toolbox() {
    return {
      icon: ToolboxIcon,
      title: "Spoiler",
    };
  }

  /**
   * Allow to press Enter inside the Spoiler
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Default placeholder for spoiler title
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_TITLE_PLACEHOLDER() {
    return "Title";
  }

  /**
   * Default placeholder for spoiler text
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_MESSAGE_PLACEHOLDER() {
    return "Message";
  }

  /**
   * Allowed spoiler spoiler_type
   *
   * @public
   * @returns {{default: string, simple: string}}
   */
  static get SPOILER_TYPE() {
    return {
      default: "default",
      simple: "simple",
    };
  }

  /**
   * Default spoiler spoiler_type
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_SPOILER_TYPE() {
    return Spoiler.SPOILER_TYPE.default;
  }

  /**
   * Spoiler Tool`s styles
   *
   * @returns {Object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: "cdx-spoiler",
      title: "cdx-spoiler__title",
      input: this.api.styles.input,
      text: "cdx-spoiler__text",
      settingsWrapper: "cdx-spoiler-settings",
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
    };
  }

  /**
   * Tool`s settings properties
   *
   * @returns {*[]}
   */
  get settings() {
    return [
      {
        name: "default",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g transform="translate(-919 -911)"><path d="M7.842,0a7.922,7.922,0,0,1,7.842,8,7.922,7.922,0,0,1-7.842,8A7.922,7.922,0,0,1,0,8,7.922,7.922,0,0,1,7.842,0Z" transform="translate(919.315 911)" fill="#e4e4e4"/><path d="M20.248,25l3.572,3.839L27.688,25" transform="translate(903.062 892.419)" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.9"/><path d="M0,0H16V16H0Z" transform="translate(919 911)" fill="none"/></g></svg>`,
      },
      {
        name: "simple",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16.013" height="16.03" viewBox="0 0 16.013 16.03"><g transform="translate(-939.987 -911)"><path d="M7.04,0A7.04,7.04,0,1,1,0,7.04,7.04,7.04,0,0,1,7.04,0Z" transform="translate(940.938 912)" fill="none" stroke="#e4e4e4" stroke-width="1.9"/><circle cx="6" cy="6" r="6" transform="translate(942 913)" fill="#fff"/><path d="M20.248,25l3.572,3.839L27.688,25" transform="translate(924.062 892.419)" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.9"/><path d="M0,0H16V16H0Z" transform="translate(940 911)" fill="none"/></g></svg>`,
      },
    ];
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {SpoilerData} data — previously saved data
   * @param {SpoilerConfig} config — user config for Tool
   * @param {Object} api - Editor.js API
   */
  constructor({ data, config, api }) {
    const { SPOILER_TYPE, DEFAULT_SPOILER_TYPE } = Spoiler;

    this.api = api;

    this.titlePlaceholder =
      config.titlePlaceholder || Spoiler.DEFAULT_TITLE_PLACEHOLDER;
    this.textPlaceholder =
      config.textPlaceholder || Spoiler.DEFAULT_MESSAGE_PLACEHOLDER;

    this.data = {
      title: data.title || "",
      text: data.text || "",
      spoiler_type:
        (Object.values(SPOILER_TYPE).includes(data.spoiler_type) &&
          data.spoiler_type) ||
        config.defaultSpoilerType ||
        DEFAULT_SPOILER_TYPE,
    };
  }

  /**
   * Create Spoiler Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make("div", [this.CSS.baseClass, this.CSS.wrapper]);
    const title = this._make("div", [this.CSS.input, this.CSS.title], {
      contentEditable: true,
      innerHTML: this.data.title,
    });
    const text = this._make("div", [this.CSS.input, this.CSS.text], {
      contentEditable: true,
      innerHTML: this.data.text,
    });

    title.dataset.placeholder = this.titlePlaceholder;
    text.dataset.placeholder = this.textPlaceholder;

    container.appendChild(title);
    container.appendChild(text);

    return container;
  }

  /**
   * Extract Spoiler data from Spoiler Tool element
   *
   * @param {HTMLDivElement} spoilerElement - element to save
   * @returns {SpoilerData}
   */
  save(spoilerElement) {
    const title = spoilerElement.querySelector(`.${this.CSS.title}`);
    const text = spoilerElement.querySelector(`.${this.CSS.text}`);

    return Object.assign(this.data, {
      title: title.innerHTML,
      text: text.innerHTML,
    });
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of CSS classname(s)
   * @param  {Object} attributes        - any attributes
   * @return {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    let el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (let attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  /**
   * Sanitizer config for Spoiler Tool saved data
   * @return {Object}
   */
  static get sanitize() {
    return {
      title: {},
      text: {},
      spoiler_type: {},
    };
  }

  /**
   * Create wrapper for Tool`s settings buttons:
   * 1. Default spoiler_type
   * 2. Simple spoiler_type
   *
   * @returns {HTMLDivElement}
   */
  renderSettings() {
    const wrapper = this._make("div", [this.CSS.settingsWrapper], {});
    const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

    this.settings
      .map((tune) => {
        const el = this._make("div", this.CSS.settingsButton, {
          innerHTML: tune.icon,
          title: `${capitalize(tune.name)} тип спойлера`,
        });

        el.classList.toggle(
          this.CSS.settingsButtonActive,
          tune.name === this.data.spoiler_type
        );

        wrapper.appendChild(el);

        return el;
      })
      .forEach((element, index, elements) => {
        element.addEventListener("click", () => {
          this._toggleTune(this.settings[index].name);

          elements.forEach((el, i) => {
            const { name } = this.settings[i];

            el.classList.toggle(
              this.CSS.settingsButtonActive,
              name === this.data.spoiler_type
            );
          });
        });
      });

    return wrapper;
  }

  /**
   * Toggle spoiler`s spoiler_type
   *
   * @param {string} tune - spoiler_type
   * @private
   */
  _toggleTune(tune) {
    this.data.spoiler_type = tune;
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of CSS classname(s)
   * @param  {Object} attributes        - any attributes
   * @return {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    let el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (let attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }
}
