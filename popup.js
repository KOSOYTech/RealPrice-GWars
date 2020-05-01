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
			
			// Непосредственно сохраняем введённое значение курса EUN к гб в настройки
			chrome.storage.local.set({'GbEUNKurs': document.getElementById('eunkurs').value});
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
			
			// Устанавливаем, что при клике на кнопке изменить соответствующей валюты с соответствующим ID происходит сохранение соответствующего курса в настройки
			switch (vEKC.target.id) {
				case 'rubeunkurschange':
					var rubEUNKurs = Number(document.getElementById('rubeunkurs').value);
					if (rubEUNKurs > 0) {
						chrome.storage.local.set({'rubEUNKurs': rubEUNKurs});
					}
					else {
						alert('Вы уверены, что ввели число больше нуля? Курс не может равнняться нулю или быть отрицательным');
					}
				break;
				case 'griveunkurschange':
					var grivEUNKurs = Number(document.getElementById('griveunkurs').value);
					if (grivEUNKurs > 0) {
						chrome.storage.local.set({'grivEUNKurs': grivEUNKurs});
					}
					else {
						alert('Вы уверены, что ввели число больше нуля? Курс не может равнняться нулю или быть отрицательным');
					}
				break;
				case 'euroeunkurschange':
					var euroEUNKurs = Number(document.getElementById('euroeunkurs').value);
					if (euroEUNKurs > 0) {
						chrome.storage.local.set({'euroEUNKurs': euroEUNKurs});
					}
					else {
						alert('Вы уверены, что ввели число больше нуля? Курс не может равнняться нулю или быть отрицательным');
					}
				break;
				case 'doleunkurschange':
					var dolEUNKurs = Number(document.getElementById('doleunkurs').value);
					if (dolEUNKurs > 0) {
						chrome.storage.local.set({'dolEUNKurs': dolEUNKurs});
					}
					else {
						alert('Вы уверены, что ввели число больше нуля? Курс не может равнняться нулю или быть отрицательным');
					}
				break;
				case 'shekeunkurschange':
					var shekEUNKurs = Number(document.getElementById('shekeunkurs').value);
					if (shekEUNKurs > 0) {
						chrome.storage.local.set({'shekEUNKurs': shekEUNKurs});
					}
					else {
						alert('Вы уверены, что ввели число больше нуля? Курс не может равнняться нулю или быть отрицательным');
					}
				break;
				default:
					alert('Стряслась какая-то ошибка. Вы точно нажимаете на кнопку "Изменить"?');
			}
		});
		
		// Получаем текущее значение курса валюты к EUN из настроек, чтобы вписать его в качестве заполнителя в поле ввода курса
		chrome.storage.local.get({'rubEUNKurs' : {}, 'grivEUNKurs' : {}, 'euroEUNKurs' : {}, 'dolEUNKurs' : {}, 'shekEUNKurs' : {}}, function(result){
			
			// Если мы получаем значение курса валюты, то есть числовое значение, то мы вписываем его в качестве заполнителя в поле ввода курса
			if (isFinite(result.rubEUNKurs)) {
				
				// Вписываем полученный из настреок курс в качестве заполнителя в поле ввода курса
				document.getElementById('rubeunkurs').placeholder=result.rubEUNKurs;
			}
				
			// Если мы получаем значение курса валюты, то есть числовое значение, то мы вписываем его в качестве заполнителя в поле ввода курса
			if (isFinite(result.grivEUNKurs)) {
				
				// Вписываем полученный из настреок курс в качестве заполнителя в поле ввода курса
				document.getElementById('griveunkurs').placeholder=result.grivEUNKurs;
			}
				
			// Если мы получаем значение курса валюты, то есть числовое значение, то мы вписываем его в качестве заполнителя в поле ввода курса
			if (isFinite(result.euroEUNKurs)) {
				
				// Вписываем полученный из настреок курс в качестве заполнителя в поле ввода курса
				document.getElementById('euroeunkurs').placeholder=result.euroEUNKurs;
			}
				
			// Если мы получаем значение курса валюты, то есть числовое значение, то мы вписываем его в качестве заполнителя в поле ввода курса
			if (isFinite(result.dolEUNKurs)) {
				
				// Вписываем полученный из настреок курс в качестве заполнителя в поле ввода курса
				document.getElementById('doleunkurs').placeholder=result.dolEUNKurs;
			}
				
			// Если мы получаем значение курса валюты, то есть числовое значение, то мы вписываем его в качестве заполнителя в поле ввода курса
			if (isFinite(result.shekEUNKurs)) {
				
				// Вписываем полученный из настреок курс в качестве заполнителя в поле ввода курса
				document.getElementById('shekeunkurs').placeholder=result.shekEUNKurs;
			}
		});
		
	}
	
});