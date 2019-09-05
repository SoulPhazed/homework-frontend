'use strict';

const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#x60;',
};

/**
 * Экранирование запрещенных символов
 *
 * @param {string} input - Входящая строка для экранирования
 * @returns {string} - Экранированная строка
 */
const escapeHTML = (input) => String(input).replace(/[&<>"'`]/g, (symbol) => escapeMap[symbol]);

/**
 * Фильтрует входящий HTML-код, оставляя разрешенные тэги
 *
 * @param {string} inputHTML - Входящий HTML
 * @param {string[]} validTags - Разрешенные тэги
 * @returns {string} - Отфильтрованный HTML
 */
const filter = (inputHTML, validTags) => {
    let outputHTML = '';

    if (!inputHTML) {
        return outputHTML;
    }

    const tags = inputHTML.match(new RegExp(`<\/?(${validTags.join('|')})(>| [^>]*>)`, 'g'));

    let startIterator = 0;
    let endIterator = 0;

    if (tags) {
        tags.forEach((tag) => {
            endIterator = inputHTML.indexOf(tag, startIterator);
            outputHTML += escapeHTML(inputHTML.slice(startIterator, endIterator));
            outputHTML += tag;
            startIterator = outputHTML.length;
        });
    }

    endIterator = inputHTML.length;
    outputHTML += escapeHTML(inputHTML.slice(startIterator, endIterator));

    return outputHTML;
};