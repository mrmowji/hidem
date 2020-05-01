document.addEventListener('DOMContentLoaded',function() {
  chrome.runtime.sendMessage({request: "get-marked-urls"}, function(response) {
    let list = document.getElementById("marked-urls");
    list.innerHTML = "";
    for (let markedUrl of response) {
      let listItem = document.createElement("li");
      listItem.textContent = markedUrl;
      listItem.setAttribute("title", markedUrl);
      list.appendChild(listItem);
    }
  });
}, false);