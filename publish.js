/* global result */
/* global MINIFY */
/* global ABBRIVIATE */

ABBRIVIATE = ABBRIVIATE.split('\n')                  // Split into lines
 .map(l=>l.trim())                                   // Trim the lines
 .filter(l=>l.length>0)                              // Remove empty lines
 .map((t,i)=>{ return { abbr:getId(i), text:t}; } ); // Determine the replacement id for the text based on the index (no specific order)

function getId(i) {
  let a = i%26;
  let b = Math.floor(i/26);
  return String.fromCharCode(a+65) + String.fromCharCode(b+97);
}

function convertFiles(files) {

  if (files.length === 0) {
    // Just setting innerHTML assumes HTML so does not handle < > correctly
    document.getElementById('result').appendChild(document.createTextNode(result));
    return;
  }

  let fileUrl = files.shift();
  fetch(fileUrl)
    .then(function(response) {
          // The call was successful!
          return response.text();
       })
     .then(function (source) {
          source = source.replace(/(\/\*\s*global(.|\r|\n)*?\*\/)/gm, '')      // Remove /* global ... */ comments
                         .trim() + '\r\n'; 

          if (fileUrl.endsWith('.js')) {
            source = source.replace(/\"use strict\";/gm, '')                     // Remove "use strict" lines
          }

          if (MINIFY) { 
            source = source.replace(/[ \t]*([+=*/%(){}:,.])[ \t]*/gm, '$1')    // Remove extra spaces
                           .replace(/(?<!((data:image|https:).*))(\/\/.*)$/gm, '')      // Remove all comments except in base64 image lines
                           .replace(/^[ \t]*(.*)[ \t]*$/gm, '$1')              // Trim all lines   
                           .replace(/^[ ]*\r?\n/gm, '');                       // Remove empty lines
            
            if (fileUrl.endsWith('.js')) {
              for (let a=0; a<ABBRIVIATE.length;a++) {
                let item = ABBRIVIATE[a];
                source = source.replace(new RegExp(`\\b(${item.text})\\b`,'gm'), item.abbr);  
              }
            }
          }
    
          result += `\r\n` +
                    `// =====================================================\r\n` +
                    `// ${fileUrl}\r\n`                                            +
                    `// =====================================================\r\n` +
                    `\r\n` + source; 
                    

         // Convert the rest of the files
         convertFiles(files);

      })
    .catch(function (err) {
      // There was an error
      console.warn('Something went wrong reading ' + fileUrl, err);
    });
}  


