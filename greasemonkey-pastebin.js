// ==UserScript==
// @name     Add <noscript> to Pastebin embed JS
// @author Adam Brandizzi <adam@brandizzi.com.br>
// @version  1
// @grant    none
// @namespace  http://adam.brandizzi.com.br
// @version    0.0.1
// @description  Get the content of a paste, add it to a "noscript" element and append the element to the snippet for embedding pastes via JS.
// @include    /^https?:\/\/pastebin.com\/embed\//
// ==/UserScript==

(() => {
  const codeBoxes = [...document.getElementsByClassName('code_box')]
  .filter(
    codeBox => codeBox.textContent.includes('pastebin.com/embed_js')
  ).forEach(
    (codeBox) => {
      const pasteURL = /"(https?:\/\/pastebin.com\/embed_js\/.+)"/
      .exec(codeBox.textContent)[1]
      .replace('embed_js', 'raw');

      fetch(pasteURL).then(
        r => r.text()
      ).then(
        t => {
          const content = codeBox.textContent + `<noscript><code>${t}</code></noscript>`;

          const textarea = document.createElement('textarea');
          textarea.textContent = content;
          textarea.cols = 120;
          textarea.style = 'height:auto;'

          var count = 0;
          for (var i = 0; i < content.length; i++) {
            if ((content[i] === '\n') || (content[i] === '\r')) {
              count++;
            }
          }
          textarea.rows = count / 2 + 1;

          const button = document.createElement('button');
          button.textContent = 'Copy';
          const buttonClickHandler = () => {
            textarea.select();
            document.execCommand("copy");
          };
          button.onclick = buttonClickHandler;
          const bottomButton = button.cloneNode(1);
          bottomButton.onclick = buttonClickHandler;

          const div = document.createElement('div');
          div.appendChild(button);
          div.appendChild(document.createElement('br'));
          div.appendChild(textarea);
          div.appendChild(document.createElement('br'));
          div.appendChild(bottomButton);

          codeBox.parentNode.insertBefore(div, codeBox.nextSibling);
          codeBox.parentNode.removeChild(codeBox);
        }
      );
    }
  );
})();
