apikey = ''


//ADD PAGE URL TO INPUT FIELD
chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
  console.log(tabs[0].url);
  document.getElementById('pg_url').value = tabs[0].url;
  document.getElementById('pg_title').value = tabs[0].title;
});

//ADD SUBMIT DATA CLICK EVENT
document.getElementById('id_change').addEventListener('click', async function(){
  var url = document.getElementById('pg_url').value;
  var title = document.getElementById('pg_title').value;
  var val = document.getElementById('notes').value;
  //Add URL as header

  var skipnotes = document.getElementById('skipnotes');
  if(!skipnotes.checked){

    var header = '\n## ' + url + "\n" + title;

    var main_path = document.getElementById('main_path').getElementsByClassName('pathinput')[0].value;
    if(!main_path.endsWith('.md')){
      main_path += '.md'
    }

    var r = await fetch('http://127.0.0.1:27123/vault/' + main_path, {method: 'PATCH', headers: {'Heading': url, 'Content-Insertion-Position': 'end', 'Authorization': `Bearer ${apikey}`, 'Content-type': 'text/markdown; charset=UTF-8'}, body: val})
    if(!r.ok){
      var r2 = await fetch('http://127.0.0.1:27123/vault/' + main_path, {method: 'POST', headers: {'Authorization': `Bearer ${apikey}`, 'Content-type': 'text/markdown; charset=UTF-8'}, body: header + '\n' + val}) //.then(r => r.text()).then(console.log);
      var text = await r2.text();
      console.log(text);
    }
  }
  var toarchive = document.getElementById('toarchive');
  if(toarchive.checked){
    var ar = await fetch('http://127.0.0.1:27123/vault/archive.md', {method: 'POST', headers: {'Authorization': `Bearer ${apikey}`, 'Content-type': 'text/markdown; charset=UTF-8'}, body: url})
  }
  //for all keywords
  var kw_paths = document.getElementById('kw_paths').children;

  for(var i = 1;i<kw_paths.length;i++){
    var kw_path = kw_paths[i];
    var kwpath = kw_path.getElementsByClassName('pathinput')[0].value;
    kwpath += (kwpath.endsWith('/') ? kw_path.getElementsByTagName('h4')[0].innerText + '.md' : '');
    var kwtext = kw_path.getElementsByClassName('kw_text')[0].value;
    console.log(kwpath);
    console.log(kwtext);
    var kwr = await fetch('http://127.0.0.1:27123/vault/' + kwpath, {method: 'POST', headers: {'Authorization': `Bearer ${apikey}`, 'Content-type': 'text/markdown; charset=UTF-8'}, body: kwtext})
  }
})


window.addEventListener("keydown", function(e){
  var selectedText = getSelectionText();
  if(e.keyCode === 219 && selectedText != "") {
  	e.preventDefault();
    var html = `<div class='path'><h4>${selectedText}</h4><br><textarea class='kw_text' rows='4' cols='45'></textarea><br><input type='text' class='pathinput' size='40'><br><input type='button' value='select file' class='selectfile'><input type='button' value='remove' class='remove'><br><br></div>`;
    var kw_paths = document.getElementById('kw_paths');
    kw_paths.insertAdjacentHTML('beforeend', html);
    var els = kw_paths.getElementsByClassName('path');
    var el = els[els.length-1];
    el.getElementsByClassName('remove')[0].addEventListener('click', function(e){
      e.target.parentElement.parentElement.removeChild(e.target.parentElement);
    })
    fillPathSelect(el);
    replaceSelectedText(strcon(selectedText)); //CAN ADD SUPPORT FOR KEYWORDS IN KEYWORD TEXT
	}
});

function getSelectionText() {
	var text = "";
	if (window.getSelection) {
		text = window.getSelection().toString();
	} else if (document.selection && document.selection.type != "Control") {
		text = document.selection.createRange().text;
	}
	return text;
}

function strcon(givenString) {
	return `[[${givenString}]]`;
}

function replaceSelectedText(text) {
	var txtArea = document.getElementById('notes');
  if (txtArea.selectionStart != undefined) {
  	var startPos = txtArea.selectionStart;
    var endPos = txtArea.selectionEnd;
    selectedText = txtArea.value.substring(startPos, endPos);
    txtArea.value = txtArea.value.slice(0, startPos) + text + txtArea.value.slice(endPos);
    console.log('Moz ', selectedText);
  }
}

async function genMenu(dir, path){
  path.value = dir.join('');
  console.log("genMenu()" + dir);
  if(dir.join('').length > 0 && !dir.join('').endsWith('/')){
    return;
  }
  if(dir[0].length == 0 || dir[dir.length-1].endsWith('/')){
    var ls = await fetch('http://127.0.0.1:27123/vault/' + dir.join(''), {method: 'GET', headers: {'Authorization': `Bearer ${apikey}`, 'Content-type': 'application/*'}}) //.then(r => r.text()).then(console.log);
      if(ls.ok){
        if(dir.length == 1 && dir[0] == ''){
          var m = path.parentElement.getElementsByClassName('slicknav_menu')[0];
        }else{
          var xpath = `//span[text()='${dir[dir.length-1]}']`;
          var m = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentElement;
          if(m.children.length > 1){
            while(m.children.length > 1){
              m.removeChild(m.lastChild);
            }
            return;
          }
          console.log(m);
        }
        var ul = document.createElement('ul');
        ul.setAttribute('class', 'slicknav_nav');
        var lsj = await ls.json();
        console.log(lsj);
        for(var i = 0;i<lsj.files.length;i++){
          var li = document.createElement('li');
          var span = document.createElement('span');
          span.innerText = lsj.files[i];
          li.append(span);
          const temp = dir.concat([lsj.files[i]]);
          span.addEventListener("click", function(){
            return genMenu(temp, path);
          });
          ul.append(li);
        }
        m.append(ul);
    }
  }else{
    console.log('skipped: ' + dir);
  }
}

function fillPathSelect(el){
  const b = el.getElementsByClassName('selectfile')[0];
  b.addEventListener('click', function(e){
    var html = "<br><div class='slicknav_menu'></div><br><br><input type='button' class='select' value='select'>";
    if(e.target.parentElement.getElementsByClassName('menuanchor').length == 0){
      var mdiv = document.createElement('div');
      mdiv.setAttribute('class', 'menuanchor');
      e.target.parentElement.append(mdiv);
    }else{
      var mdiv = e.target.parentElement.getElementsByClassName('menuanchor')[0];
      if(mdiv.getElementsByClassName('slicknav_menu').length >= 1){
        return;
      }
    }
    e.target.parentElement.getElementsByClassName('menuanchor')[0].insertAdjacentHTML('beforeend', html);
    e.target.parentElement.getElementsByClassName('select')[0].addEventListener('click', function(e){
      var menuanchor = e.target.parentElement;
      while(menuanchor.firstChild){
        menuanchor.removeChild(menuanchor.lastChild);
      }
    })
    var pathEl = e.target.parentElement.getElementsByClassName('pathinput')[0];
    genMenu([''], pathEl);
  })
}

var ar = document.getElementsByClassName('path');
for(var i = 0;i<ar.length;i++){
  fillPathSelect(ar[i]);
}
