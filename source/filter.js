'use strict';

let escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#x60;',
};

const escapeHTML = (input) => String(input).replace(/[&<>"'`]/g, (symbol) => escapeMap[symbol]);

const filter = function(inputHTML, validTags) {
    let outputHTML = '';

    if (!inputHTML) {
        return outputHTML;
    }

    let firstIterator = 0;
    let lastIterator = firstIterator;
    while (firstIterator <= inputHTML.length) {

        // Экранирование текста
        lastIterator = inputHTML.indexOf('<', firstIterator);
        lastIterator = lastIterator >= 0 ? lastIterator : outputHTML.length + 1;
        outputHTML += escapeHTML(inputHTML.slice(firstIterator, lastIterator));
        firstIterator = lastIterator;

        // Проверяем - есть ли валидные тэги в угловых скобках
        lastIterator = inputHTML.indexOf('>', firstIterator);
        if (lastIterator >= 0) {
            let isMatch = false;
            // Дополнительные итераторы для выделения чистого названия тэга внутри скобок
            let firstTagIterator = inputHTML[firstIterator + 1] === '/' ? firstIterator + 2 : firstIterator + 1;
            let lastTagIterator = inputHTML.slice(0, lastIterator).indexOf(' ', firstTagIterator);
            lastTagIterator = lastTagIterator >= 0 ? lastTagIterator : lastIterator;

            for (let tag of validTags) {
                if (inputHTML.slice(firstTagIterator, lastTagIterator) === tag) {
                    outputHTML += inputHTML.slice(firstIterator, lastIterator + 1);
                    isMatch = true;
                    break;
                }
            }
            // Если не нашли валидные тэги, то все экранируем
            if (!isMatch) {
                outputHTML += escapeHTML(inputHTML.slice(firstIterator, lastIterator + 1));
            }
            firstIterator = ++lastIterator;
        } else {
            // Если угловых скобок (пары) вообще не осталось
            lastIterator = outputHTML.length + 1;
            outputHTML += escapeHTML(inputHTML.slice(firstIterator, lastIterator));
            firstIterator = lastIterator;
        }
    }
    return outputHTML;
};