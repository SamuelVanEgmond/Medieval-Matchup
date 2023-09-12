/* global THREE */
/* global AFRAME */

/* Helper functions */

// Render a dom element
function render(parent, elTag, elAttributes, elText) {
 
    let element = document.createElement(elTag);
  
    if (elText !== null && elText !== undefined && elText !== '') {
      element.innerHTML += elText;
    }
    
    for (let attrName in elAttributes) {
        element.setAttribute(attrName, elAttributes[attrName]);
    };
 
    if (parent !== undefined) 
      return parent.appendChild(element);
    else
      return element;
}

/*

// Render a dom element using another element as a template
function renderCopy(parent, elTag, elTemplate, elAttributes) {
    let element = document.createElement(elTag);
    for (let attrName in elTemplate) {
        element.setAttribute(attrName, elTemplate[attrName]);
    };
    for (let attrName in elAttributes) {
        element.setAttribute(attrName, elAttributes[attrName]);
    };

    if (parent !== undefined) 
      return parent.appendChild(element);
    else
      return element;
}

*/