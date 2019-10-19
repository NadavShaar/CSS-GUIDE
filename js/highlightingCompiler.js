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
    let tabLevel = 0;
    let numberOfRows = 0;
    let rowsNumbers = '';
    let isSelector = true;
    let lines = css.split(/\r\n|\r|\n/g);

    function getPart(line, char) {
        return line.substring(0, line.indexOf(char)).trim();
    }
    function updateLine(line, char) {
        return line.substring(line.indexOf(char)+2, line.length).trim();
    }
    function indent(tabLevel, data) {
        for (let k = 0; k < tabLevel; k++) {
            data = "  ".concat(data);
        }
        this.indented = true;
        return data;
    }
    
    // output += '<br>';

    lines.forEach((l) => {
        let part = '';
        l = l.trim();

        let line = l;
        if(!line) {
            numberOfRows += 1;
            output += "<br>";
            return;
        }
        this.indented = false;
        let lineProcessed = false;
        
        for (let i = 0; i < l.length; i++) {

            const char = l[i];

            if(char === '/' && line[i-1] === '/'){
                if(!this.indented) line = indent(tabLevel, line);
                output += `<span class="code_comment">${line}</span><br>`;
                numberOfRows += 1;
                lineProcessed = true;
                continue;
            }
            if(isSelector) {
                if(char === '{') {
                    part = getPart(line, char);
                    line = updateLine(line, char);
                    output += `<span class="selector_name">${part}</span> {<br>`;
                    tabLevel += 1;
                    isSelector = false;
                    numberOfRows += 1;
                    lineProcessed = true;
                    continue;
                }
                if(char === ',') {
                    part = getPart(line, char);
                    line = updateLine(line, char);
                    output += `<span class="selector_name">${part}</span>, `;
                    lineProcessed = true;
                    numberOfRows += 1;
                    continue;
                }
            } else {
                if(char === '{'){ 
                    part = getPart(line, char);
                    line = updateLine(line, char);
                    if(!this.indented) part = indent(tabLevel, part);
                    output += `<span class="selector_name2">${part}</span> {<br>`;
                    tabLevel += 1;
                    numberOfRows += 1;
                    lineProcessed = true;
                    continue;
                }
                if(char === ':'){
                    part = getPart(line, char);
                    line = updateLine(line, char);
                    if(!this.indented) part = indent(tabLevel, part);
                    output += `<span class="property_name">${part}</span>: `;
                    lineProcessed = true;
                    continue;
                }
                if(char === ';'){
                    part = getPart(line, char);
                    line = updateLine(line, char);
                    output += `<span class="property_value">${part}</span>;<br>`;
                    numberOfRows += 1;
                    lineProcessed = true;
                    continue;
                }
                if(char === ','){
                    part = getPart(line, char);
                    line = updateLine(line, char);
                    if(!this.indented) part = indent(tabLevel, part);
                    if((line[line.length-1]) === '{') {
                        output += `<span class="selector_name2">${part}</span>, `;
                    }
                    else output += `<span class="property_value">${part}</span>, `;
                    lineProcessed = true;
                    continue;
                }
                if(char === '}'){
                    tabLevel -= 1;
                    if(!this.indented) part = indent(tabLevel, char);
                    output += `<span>${part}</span><br>`;
                    if(tabLevel === 0) {
                        isSelector = true;
                    };
                    numberOfRows += 1;
                    lineProcessed = true;
                    continue;
                }
            }
        }
        if(!lineProcessed) {
            output += `<span>${line}</span><br>`;
            numberOfRows += 1;
            lineProcessed = true;
        };
    })

    for (let t = 1; t < numberOfRows-1; t++) {
        rowsNumbers += `<span>${t}</span>`;
    }

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
    let elements = document.querySelectorAll(`#${id} .code_block_css`);
    if(!elements) return;
    elements.forEach((el, idx) => {
        let css = el.innerHTML;
        let compiledCSS = compileCSS(css);
        el.innerHTML = compiledCSS;
    });
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
    'selectorPseudoClassDisabled',
    'selectorPseudoClassChecked',
    'selectorPseudoClassFirstChild',
    'selectorPseudoClassLastChild',
    'selectorPseudoClassFirstOfType',
    'selectorPseudoClassLastOfType',
    'selectorPseudoClassNTHChild',
    'selectorPseudoClassNTHLastChild',
    'selectorPseudoClassNTHOfType',
    'selectorPseudoClassNTHLastOfType',
    'selectorPseudoClassTarget',
    'selectorPseudoClassNot',
    'selectorPseudoClassRoot',
    'selectorPseudoElementBefore',
    'selectorPseudoElementAfter',
    'selectorPseudoElementSelection',
    'animation',
    'animationKeyframes',
    'boxLoader',
    'liquidButton',
    'cardClipPath',
    'shiningText',
];

ids.forEach(generateHTML);
ids.forEach(generateCSS);