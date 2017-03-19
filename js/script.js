var start = document.querySelector('.start'); //кнопка старта игры
var restart = document.querySelector('.restart');
var wrapperTable = document.querySelector('.wrapper'); //обертка игрового поля (таблицы)
var timerDisplay = document.querySelector('.timer'); //таймер
var score = document.querySelector('.score'); //очки
var myAlert = document.querySelector('.window-alert');
var newArray = []; //массив из которого вставлять изображения в поле;
var simile = []; //массив для сравнения двух картинок
var allShow = []; //массив с совпавшими изображениями
var rows; //количество строк таблицы
var columns; //количество столбцов таблицы
var myTimeout; // setTimeout
var timeValue = 200;

start.addEventListener('click', createGameField);getFieldSize();
start.addEventListener('click', myTimer);
wrapperTable.addEventListener('click', open);

function getFieldSize(){ //обрабатываю данные с сервера
	var request = new XMLHttpRequest();
	var url = 'https://kde.link/test/get_field_size.php';

	request.onreadystatechange = function(){
		if (request.readyState == 4 && request.status == 200) {
			var myObj = JSON.parse(request.responseText);
			rows = myObj.width;
			columns = myObj.height;
		}
		getImages();
	};
	request.open('GET', url);
	request.send();
};

function createGameField(){ //создаю поле для игры
	start.style.display = 'none';
	var table = document.createElement('table');
	var counterIMG = 0;
	for (var i = 0; i < rows; i++) {
		var tr = document.createElement('tr');
		for (var k = 0; k < columns; k++) {
			var td = document.createElement('td');
			tr.appendChild(td);
			td.classList.add('hiden');
			td.innerHTML = '<img src="' + newArray[counterIMG] + '" alt="picture">';
			counterIMG++;
		}
		table.appendChild(tr);
	}
	wrapperTable.appendChild(table);
};

function myTimer(){
	timerDisplay.style.cssText += 'display: inline-block';
	score.style.cssText += 'display: inline-block';
	timerDisplay.innerText = 'Time left: ' + timeValue;
	score.innerText = 'Your score: ' + timeValue;
	if (timeValue === 0){
		/*clearTimeout(myTimeout);*/
		message('YOU LOSE!', null);
	} else {
		myTimeout = setTimeout(myTimer, 1000);
		timeValue -= 1;
	}
};

function getImages(){
	var baseArray = ['https://kde.link/test/1.png',
					 'https://kde.link/test/2.png',
					 'https://kde.link/test/9.png',
					 'https://kde.link/test/7.png',
					 'https://kde.link/test/6.png',
					 'https://kde.link/test/3.png',
					 'https://kde.link/test/4.png',
					 'https://kde.link/test/0.png',
					 'https://kde.link/test/5.png',
					 'https://kde.link/test/8.png'];
	var baseArrayLength = baseArray.length;
	var sumImage = rows * columns/2; //количество картинок в одном экземпляре для текущей игры
	var randomIndex;
	var	temp;
	for (var i = 0, j; i < sumImage; i++) {
		j = (i % baseArrayLength);
		newArray.push(baseArray[j]);
	}
	newArray = newArray.concat(newArray);

	for (var k = 0, currentIndex = newArray.length - 1; k <= currentIndex; k++) { //перемешиваю картинки
		randomIndex = Math.floor(Math.random() * currentIndex);
		temp = newArray[currentIndex];
		newArray[currentIndex] = newArray[randomIndex];
		newArray[randomIndex] = temp;
	}
};

function open(e){
	var target = e.target;
	if (target.tagName == "TD") { //проверяю на клик по нужному элементу
		var childrenImg = target.firstElementChild;
		target.classList.remove('hiden');
		simile.push(childrenImg);
		if (simile.length == 2) { //если мы открыли 2 элемента...
			if (simile[0].src !== simile[1].src) { // если src не совпадают - скрываю картинки и очищаю массив
				setTimeout(function(){
					simile.forEach( function(imgSimile) {
						imgSimile.parentNode.classList.add('hiden');
					});
					simile = [];
				}, 500);
			} else { // если совпадают - картинки остаются открытыми и очищаю массив
				simile.forEach( function(imgSimile) {
					allShow.push(imgSimile);
				});
				simile = [];
				if (rows * columns == allShow.length){
					/*clearTimeout(myTimeout);*/
					message('YOU WIN! SCORE: ', timeValue);
				}
			}
		}
		if (simile.length > 2) {
			simile.forEach( function(imgSimile) {
				imgSimile.parentNode.classList.add('hiden');
			});
			simile = [];
		}
	}
};

function reload(){
	restart.style.visibility = 'hidden';
	myAlert.style.visibility = 'hidden';
	wrapperTable.addEventListener('click', open);
	restart.removeEventListener('click', reload, false);
	location.reload(true);
};

function message(text, timeValue){
	clearTimeout(myTimeout);
	myAlert.firstElementChild.innerText = timeValue ? text + timeValue : text;
	myAlert.style.display = 'inline-block';
	myAlert.style.visibility = 'visible';
	restart.style.visibility = 'visible';
	wrapperTable.removeEventListener('click', open, false);
	restart.addEventListener('click', reload);
};