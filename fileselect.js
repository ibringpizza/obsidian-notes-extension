async function genMenu(dir){
  if(dir.length == 1 && dir[0] == ''){
    var m = document.getElementsByClassName('slicknav_menu')[0];
  }else{
    var xpath = `//li[text()='${dir[dir.length-1]}']`;
    var m = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if(m.children.length > 0){
      return;
    }
    console.log(m);
  }
  document.getElementById('path').value = dir.join('');
  console.log("genMenu()" + dir);
  if(dir.join('').length > 0 && !dir.join('').endsWith('/')){
    return;
  }
  if(dir[0].length == 0 || dir[dir.length-1].endsWith('/')){
    var ls = await fetch('http://127.0.0.1:27123/vault/' + dir.join(''), {method: 'GET', headers: {'Authorization': 'Bearer API_KEY', 'Content-type': 'application/*'}}) //.then(r => r.text()).then(console.log);
      if(ls.ok){
        var ul = document.createElement('ul');
        ul.setAttribute('class', 'slicknav_nav');
        var lsj = await ls.json();
        console.log(lsj);
        for(var i = 0;i<lsj.files.length;i++){
          var li = document.createElement('li');
          li.innerText = lsj.files[i];
          const temp = dir.concat([lsj.files[i]]);
          li.addEventListener("click", function(){
            return genMenu(temp);
          });
          ul.append(li);
        }
        m.append(ul);
    }
  }else{
    console.log('skipped: ' + dir);
  }
}

genMenu(['']);

document.getElementById('select').addEventListener('click', function(){
  if(window.opener != null && !window.opener.closed){
    window.opener.document.getElementById('main_path').value = document.getElementById('path').value;
    window.close();
    window.opener.focus();
  }
})
