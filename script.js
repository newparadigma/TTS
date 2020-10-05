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
      // тут мы получили 100% результат

      let rows = content.match(
        /<tr bgcolor="#ccffcc"><td>\d+\.<\/td><td>\d+<\/td><td>раздел: \d+, сложность: \d+<\/td><td>\d+<\/td><td>\d+<\/td><\/tr>/gui,
      )

      rows = shuffle(rows);

      const randomInt = getRandomIntInclusive(2, 6)
      let badPoints = 0;
      for (var i = 0; i < randomInt; i++) {
        let row = rows[i];
        // <tr bgcolor="#ccffcc"><td>22.
        // let matches = rows[i].match(
        //   /<tr bgcolor="#ccffcc"><td>(\d+)\.<\/td><td>(\d+)<\/td><td>раздел: (\d+), сложность: (\d+)<\/td><td>(\d+)<\/td><td>(\d+)<\/td><\/tr>/gui,
        // )
        let rowNumber = row.match(/<tr bgcolor="#ccffcc"><td>(\d+)\./ui)[1];
        let answer = row.match(/<td>(\d+)<\/td><td>\d+<\/td><\/tr>/ui)[1];
        let wrongAnswer = getRandomIntInclusive(1, 4)
        while (wrongAnswer == answer) {
          wrongAnswer = getRandomIntInclusive(1, 4)
        }

        // console.log(row);
        const regex = new RegExp(`<tr bgcolor="#ccffcc"><td>${rowNumber}\.<\/td><td>(\\d+)<\/td><td>раздел: (\\d+), сложность: (\\d+)<\/td><td>(\\d+)<\/td><td>(\\d+)<\/td><\/tr>`, 'ui');
        // console.log(regex);
        // console.log(content.search(regex));
        content = content.replace(regex,
          `<tr bgcolor="#ffcccc"><td>${rowNumber}.</td><td>$1</td><td>раздел: $2, сложность: $3</td><td>${wrongAnswer}</td><td>$5</td></tr>`
        );
      }

      const questionsCount = content.match(/Всего вопросов: (\d+)/u)[1];
      content = content.replace(/правильных: \d+/u, 'правильных: ' + questionsCount);
      content = content.replace(/неправильных: \d+/u, 'неправильных: 0');
      content = content.replace(/без ответа: \d+/u, 'без ответа: 0');
      const pointsCount = content.match(/баллов (\d+) из (\d+)/u)[2];
      content = content.replace(/баллов (\d+) из (\d+) \(\d+%\)/u, `баллов ${pointsCount} из ${pointsCount} (100%)`);

      console.log(content);

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

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}
