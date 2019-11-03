// Дожидаемся загрузки нашей страницы расширения с настройками (popup.html), чтобы выполнить действия с данными этой страницы
document.addEventListener('DOMContentLoaded', function() {
	
	// ДЛЯ ОТЛАДКИ. Очистка настроек
	// chrome.storage.local.clear()
	
	// Привязываем переменные валют к radio-кнопкам с соответствующим ID
    var rub = document.getElementById('rub');
	var griv = document.getElementById('griv');
	var euro = document.getElementById('euro');
	var dol = document.getElementById('dol');
	var shek = document.getElementById('shek');
	
	// Устанавливаем сохранение выбранной валюты в настройки при клике на соответствующую валюту
    rub.addEventListener('click', function() {
		chrome.storage.local.set({'valuta': 'rub'});
    });
	griv.addEventListener('click', function() {
		chrome.storage.local.set({'valuta': 'griv'});
    });
	euro.addEventListener('click', function() {
 		chrome.storage.local.set({'valuta': 'euro'});
    });
	dol.addEventListener('click', function() {
 		chrome.storage.local.set({'valuta': 'dol'});
    });
	shek.addEventListener('click', function() {
		chrome.storage.local.set({'valuta': 'shek'});
    });
	
	// Получаем текущее значение валюты из настроек, чтобы поставить флажок в соответствующем месте
	chrome.storage.local.get({'valuta' : {}}, function(result){
		
		// Если мы получаем значение валюты, то есть строковое значение, то мы отмечаем соответствующий флажок
		if (typeof result.valuta === "string") {
			
			// Отмечаем radio-кнопку с соответствующим ID
			document.getElementById(result.valuta).checked=true;
		}
	});
	
	// Привязываем переменную курса EUN к гб к полю ввода текста с соответствующим ID
	var eunKursChange = document.getElementById('eunkurschange');
	
	// Устанавливаем, что при клике на кнопку изменения курса EUN к гб происходит сохранение курса в настройки
	eunKursChange.addEventListener('click', function() {
		
		// Проверяем, содержит ли поле ввода курса EUN ненулевое значение (чтобы избежать надписи Infinity)
		if (document.getElementById('eunkurs').value !== 0) {
			
			// 
			var eunkurs = document.getElementById('eunkurs').value;
			chrome.storage.local.set({'GbEUNKurs': eunkurs});
		}
    });
	
	// Получаем текущее значение курса EUN к гб из настроек, чтобы вписать его в качестве заполнителя в поле ввода курса
	chrome.storage.local.get({'GbEUNKurs' : {}}, function(result){
		
		// Если мы получаем значение курса валюты, то есть числовое значение, то мы вписываем его в качестве заполнителя в поле ввода курса
		if (isFinite(result.GbEUNKurs)) {
			
			// Вписываем полученный из настреок курс в качестве заполнителя в поле ввода курса
			document.getElementById('eunkurs').placeholder=result.GbEUNKurs;
		}
	});
	
	// Привязываем переменную курса валюты по отношению к курсу EUN к полю ввода текста с соответствующим классом
	var valutaEUNKursChange = document.getElementsByClassName('valutaeunkurschange');
	
	// Устанавливаем, что при клике на кнопку изменения курса валюты по отношению к EUN происходит сохранение курса в настройки
	// Задаём цикл, который будет отслеживать каждый элемент в массиве отобранных кнопок
	for (var i = 0; i < valutaEUNKursChange.length; i++) {
		
		// Устанавливаем, что при клике на кнопку изменения курса валюты к EUN происходит сохранение курса в настройки
		valutaEUNKursChange[i].addEventListener("click", function (vEKC) {
			
			switch (vEKC.target.id) {
				case 'rubeunkurschange':
					alert('Работает');
				break;
				case 'griveunkurschange':
					alert('Работает');
				break;
				case 'euroeunkurschange':
					alert('Работает');
				break;
				case 'doleunkurschange':
					alert('Работает');
				break;
				case 'shekeunkurschange':
					alert('Работает');
				break;
				default:
					alert('Стряслась какая-то ошибка. Вы точно нажимаете на кнопку "Изменить"?');
			}
		});
	}
	
});