/**
 * Build styles
 */
require('./index.css').toString();

/**
 * Import Tool's icon
 */
import ToolboxIcon from './svg/toolbox.svg';

/**
 * @class Spoiler
 * @classdesc Spoiler Tool for Editor.js
 * @property {SpoilerData} data - Spoiler Tool`s input and output data
 * @property {object} api - Editor.js API instance
 *
 * @typedef {object} SpoilerData
 * @description Spoiler Tool`s input and output data
 * @property {string} title - spoiler`s title
 * @property {string} message - spoiler`s message
 *
 * @typedef {object} SpoilerConfig
 * @description Spoiler Tool`s initial configuration
 * @property {string} titlePlaceholder - placeholder to show in spoiler`s title input
 * @property {string} messagePlaceholder - placeholder to show in spoiler`s message input
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
        title: 'Spoiler'
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
    return 'Title';
  }

  /**
   * Default placeholder for spoiler message
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_MESSAGE_PLACEHOLDER() {
    return 'Message';
  }

  /**
   * Spoiler Tool`s styles
   *
   * @returns {Object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-spoiler',
      title: 'cdx-spoiler__title',
      input: this.api.styles.input,
      message: 'cdx-spoiler__message'
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {SpoilerData} data — previously saved data
   * @param {SpoilerConfig} config — user config for Tool
   * @param {Object} api - Editor.js API
   */
  constructor({data, config, api}) {
    this.api = api;

    this.titlePlaceholder = config.titlePlaceholder || Spoiler.DEFAULT_TITLE_PLACEHOLDER;
    this.messagePlaceholder = config.messagePlaceholder || Spoiler.DEFAULT_MESSAGE_PLACEHOLDER;

    this.data = {
      title: data.title || '',
      message: data.message || ''
    };
  }

  /**
   * Create Spoiler Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make('div', [this.CSS.baseClass, this.CSS.wrapper]);
    const title = this._make('div', [this.CSS.input, this.CSS.title], {
      contentEditable: true,
      innerHTML: this.data.title
    });
    const message = this._make('div', [this.CSS.input, this.CSS.message], {
      contentEditable: true,
      innerHTML: this.data.message
    });

    title.dataset.placeholder = this.titlePlaceholder;
    message.dataset.placeholder = this.messagePlaceholder;

    container.appendChild(title);
    container.appendChild(message);

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
    const message = spoilerElement.querySelector(`.${this.CSS.message}`);

    return Object.assign(this.data, {
      title: title.innerHTML,
      message: message.innerHTML
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

    if ( Array.isArray(classNames) ) {
      el.classList.add(...classNames);
    } else if( classNames ) {
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
          message: {}
      };
  }
}

