/* eslint-disable class-methods-use-this  */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */

export default class TwoColumns {

    static get toolbox() {
        return {
            title: 'two-columns',
            icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
        };
    }

    constructor({ data, config, api }) {
        this.api = api;

        this._CSS = {
            block: this.api.styles.block,
            wrapper: 'two-columns',
        };

        this._data = this._normalizeData(data);

        this._wrapper = document.createElement('div');
        this._wrapper.classList.add(this._CSS.wrapper);
    }

    render() {
        const firstP = this._createInnerDiv(this._data.firstP);
        const secondP = this._createInnerDiv(this._data.secondP);
        this._wrapper.appendChild(firstP);
        this._wrapper.appendChild(secondP);
        this._hangEvents();
        return this._wrapper;
    }

    save(blockContent) {
        return {
            firstP: blockContent.childNodes[0].innerHTML,
            secondP: blockContent.childNodes[1].innerHTML,
        };
    }

    _normalizeData(data) {
        const newData = {};

        if (typeof data !== 'object') {
            data = {};
        }

        newData.firstP = data.firstP || '';
        newData.secondP = data.secondP || '';

        return newData;
    }

    _createInnerDiv(innerHtml) {
        const div = document.createElement('div');
        div.contentEditable = 'true';
        div.innerHTML = innerHtml || '';
        div.classList.add(this._CSS.block);
        return div;
    }

    _hangEvents() {
        // this.api.listeners.on(this._wrapper, 'keydown', (e) => {
        //     const nextBlock = e.target.nextSibling;
        //     if (e.code === 'Enter') {
        //         if (!e.shiftKey && nextBlock) {
        //             nextBlock.click();
        //             nextBlock.focus();
        //             e.preventDefault();
        //             e.stopPropagation();
        //         }
        //     }
        // });
        this._wrapper.addEventListener('keydown', (e) => {
            const nextBlock = e.target.nextSibling;
            console.log(nextBlock);
            if (e.code === 'Enter') {
                if (!e.shiftKey && nextBlock) {
                    nextBlock.click();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                }
            }
        });
    }
}
