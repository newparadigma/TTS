document.getElementById("button").addEventListener("click", processFile, false);

function processFile() {
  const file = document.getElementById("fileForUpload").files[0];
  if (file) {
    var reader = new FileReader();
    reader.readAsText(file, "WINDOWS-1251");
    reader.onload = function (evt) {
      let content = evt.target.result;

      const questionsCount = content.match(/Всего вопросов: (\d+)/u)[1];
      content = content.replace(/правильных: \d+/u, 'правильных: ' + questionsCount);
      content = content.replace(/неправильных: \d+/u, 'неправильных: 0');
      content = content.replace(/без ответа: \d+/u, 'без ответа: 0');
      const pointsCount = content.match(/баллов (\d+) из (\d+)/u)[2];
      content = content.replace(/баллов (\d+) из (\d+) \(\d+%\)/u, `баллов ${pointsCount} из ${pointsCount} (100%)`);

      content = content.replace(
        /<tr bgcolor="#([^c]\w+)"><td>(\d+)\.<\/td><td>(\d+)<\/td><td>раздел: (\d+), сложность: (\d+)<\/td><td>([а-яА-Я\d\s,-]+)<\/td><td>([а-яА-Я\d\s,-]+)<\/td><\/tr>/gui,
        '<tr bgcolor="#$1"><td>$2.</td><td>$3</td><td>раздел: $4, сложность: $5</td><td>$7</td><td>$7</td></tr>'
      );

      content = content.replace(/<tr bgcolor="#[^c]\w+">/gui, '<tr bgcolor="#ccffcc">');
      download("result.html", content);
    }
    reader.onerror = function (evt) {
      alert('error');
      console.log(evt);
    }
  }
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
