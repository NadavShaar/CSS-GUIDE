function compileHTML(html){
    let output = '';

    for (let i = 0; i < html.length; i++) {
        const char = html[i];

        if(char === '<'){
            let closeCharIndex;
            for (let j = i + 1; j < html.length; j++) {
                if(html[j] === '>'){
                    closeCharIndex = j;
                    break;
                }
            }
            if(!closeCharIndex) return output;

            // inside opening/closing tag

            i++;
            if(html[i] !== '/'){
                // inside opening tag

                // skip tag name
                let tagName = '';
                while (i < closeCharIndex && (html[i] !== ' ' && html[i] !== '>')) {
                    tagName += html[i];
                    i++;
                }

                output += `<span class="html_tag">&lt;${tagName}</span>`;
                let tagAttributes = '';
                while (i < closeCharIndex){

                    // skip spaces
                    while (i < closeCharIndex && html[i] === ' ') {
                        tagAttributes += html[i];
                        i++;
                    }

                    if(i === closeCharIndex) break;
        
                    // get attribute name
                    let attributeName = '';
                    while (i < closeCharIndex && html[i] !== '=') {
                        attributeName += html[i]
                        i++;
                    }
    
                    tagAttributes += `<span class="attribute_name">${attributeName}</span>`;
                    
                    if(i === closeCharIndex) break;

                    // skip "="
                    while (i < closeCharIndex && html[i] === '=') {
                        tagAttributes += html[i];
                        i++;
                    }

                    // get attribute value
                    let attributeValue = '';
                    while (i < closeCharIndex && html[i - 1] + html[i] !== '" ') {
                        attributeValue += html[i];
                        i++;
                    }

                    tagAttributes += `<span class="attribute_value">${attributeValue}</span>`
                }
                output += tagAttributes + `<span class="html_tag">&gt;</span>`;
            }
            else{
                output += `<span class="html_tag">&lt;${html.substring(i, closeCharIndex)}&gt;</span>`;
            }

            i = closeCharIndex;
            continue;
        }

        output += char;
    }

    // rows numbers
    let rowsNumbers = generateRows(html, output);
    
    return `<span class="code_block_title">HTML</span><div class="code_block_row_numbers">${rowsNumbers}</div><pre><code>${output}</code></pre>`;
};

function compileCSS(css) {
    let output = '';

    let selector = '';
    for (let i = 0; i < css.length; i++) {
        const char = css[i];

        if(char === '{'){
            output += `<span class="selector_name">${selector}</span>{`;
            selector = '';

            let closeCharIndex;
            for (let j = i + 1; j < css.length; j++) {
                if(css[j] === '}'){
                    closeCharIndex = j;
                    break;
                }
            }
            if(!closeCharIndex) return output;

            // inside opening/closing tag

            i++;

            let cssProperties = '';
            while (i < closeCharIndex){

                // skip spaces
                while (i < closeCharIndex && css[i] === ' ') {
                    cssProperties += css[i];
                    i++;
                }

                if(i === closeCharIndex) break;
    
                // get property name
                let cssPropertyName = '';
                while (i < closeCharIndex && css[i] !== ':') {
                    cssPropertyName += css[i]
                    i++;
                }

                cssProperties += `<span class="property_name">${cssPropertyName}</span>`;

                if(i === closeCharIndex) break;

                // skip ":"
                while (i < closeCharIndex && css[i] === ':') {
                    cssProperties += css[i];
                    i++;
                }

                // get property value
                let propertyValue = '';
                while (i < closeCharIndex && css[i] !== ';') {
                    propertyValue += css[i];
                    i++;
                }

                cssProperties += `<span class="property_value">${propertyValue}</span>;`;
                i++;
            }
            output += cssProperties + `}`;

            i = closeCharIndex;
            continue;
        }

        selector += char;
        if(css.charCodeAt(i) === 10) {
            output += selector;
            selector = '';
        }
    }

    output += selector;

    let rowsNumbers = generateRows(css, output);

    return `<span class="code_block_title">CSS</span><div class="code_block_row_numbers">${rowsNumbers}</div><pre><code>${output}</code></pre>`;
};

function generateHTML(id) {
    let element = document.querySelector(`#${id} .code_block_example`);
    if(!element) return;
    let html = element.innerHTML;
    let compiledHTML = compileHTML(html);
    document.querySelector(`#${id} .code_block_html`).innerHTML = compiledHTML;
};

function generateCSS(id) {
    let element = document.querySelector(`#${id} .code_block_css`);
    if(!element) return;
    let css = element.innerHTML;
    let compiledCSS = compileCSS(css);
    document.querySelector(`#${id} .code_block_css`).innerHTML = compiledCSS;
};

function generateRows(html, output) {
    let numberOfRows = 0;
    let rowsHTML = '';
    for (let i = 0; i < output.length; i++) {
        if(html.charCodeAt(i) === 10) numberOfRows++;
    }
    for (let i = 1; i < numberOfRows; i++) {
        rowsHTML += `<span>${i}</span>`;
    }
    return rowsHTML;
};

let ids = [
    'selectorElement',
    'selectorClass',
    'selectorID',
    'selectorDescendant',
    'selectorDirectChild',
    'selectorGeneralSibling',
    'selectorAdjacentSibling',
    'selectorAttributePresent',
    'selectorAttributeEquals',
    'selectorAttributeContains',
    'selectorAttributeBeginsWith',
    'selectorAttributeEndsWith',
    'selectorAttributeSpaced',
    'selectorAttributeHyphenated',
    'selectorPseudoClassHover',
    'selectorPseudoClassActive',
    'selectorPseudoClassFocus',
    'selectorPseudoClassEnabled',
    'selectorPseudoClassDisabled'
];

ids.forEach(generateHTML);
ids.forEach(generateCSS);