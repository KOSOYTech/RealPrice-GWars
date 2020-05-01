// Инициализируем переменную, в которой будем хранить указанную в настройках валюту
var valutaVar;

// Инициализируем переменную, в которой будем хранить указанный в настройках курс EUN к гб
var eunKursVar;

// Инициализируем переменные, в которых будем хранить указанные в настройках курсы валюты к EUN
var rubKursVar;
var grivKursVar;
var euroKursVar;
var dolKursVar;
var shekKursVar;

// Асинхронная функция, с которой всё начинается. Происходит получения настроек валюты и курса и затем выполняется скрипт
// Получаем значение валюты из настроек
chrome.storage.local.get({'valuta' : {}}, function(result){
	
	// Записываем значение валюты из настроек в постоянную переменную
	valutaVar = result.valuta;
	
	// Получаем значение курса EUN к гб из настроек
	chrome.storage.local.get({'GbEUNKurs' : {}}, function(result){
		
		// Если мы получаем цифру в качестве настройки курса EUN к гб, то мы её сохраняем
		if (isFinite(result.GbEUNKurs)) {
			
			// Записываем значение курса EUN к гб из настроек в постоянную переменную
			eunKursVar = result.GbEUNKurs;
		}
			
		// В ином случае, в качестве значения курса EUN к гб мы устанавливаем значение по умолчанию
		else {
			
			// Устанавливаем значение курса EUN к гб по умолчанию
			eunKursVar = 130000;						
		}
		
		// Получаем значения курсов валют к EUN из настроек
		chrome.storage.local.get({'rubEUNKurs' : {}, 'grivEUNKurs' : {}, 'euroEUNKurs' : {}, 'dolEUNKurs' : {}, 'shekEUNKurs' : {}}, function(result){
			
			isFinite(result.rubEUNKurs) ? rubKursVar = result.rubEUNKurs : rubKursVar = 57.2;
			isFinite(result.grivEUNKurs) ? grivKursVar = result.grivEUNKurs : grivKursVar = 22.37;
			isFinite(result.euroEUNKurs) ? eurpKursVar = result.euroEUNKurs : euroKursVar = 0.8;
			isFinite(result.dolEUNKurs) ? dolKursVar = result.dolEUNKurs : dolKursVar = 0.9;
			isFinite(result.shekEUNKurs) ? shekKursVar = result.shekEUNKurs : shekKursVar = 3.17;
			
			// После того, как мы получили и записали в переменнные настройки расширения, приступаем к выполнению функции, которая непосредственно знаимается конвертированием
			convert();
		
			// Повторный запуск функции конвертирования в тех случаях, когда мы находимся на странице с картой острова и переключаемся между типами объектов недвижимости, так как происходит подгрузка информации
			if (window.location.pathname == '/map.php') {
			
				// При нажатии на любое место на странице (то есть в пределах тега body) мы перезапускаем функцию конкертирования
				$( "body" ).click(function() {
				
					// Перезапуск функции конвертирования через 300 миллисекунд после нажатия в любое место страницы
					setTimeout(convert, 300);
				});
			}
		});
	});
});

// Непосредственно основная функция, которая занимается конвертацией игровой валюты в реальную
function convert()
{		

	// Устанавливаем текущий курс одного EUN в рублях
	// var kursRubEUN = 59.57;
	
	// Подсчитываем основной множитель (в рублях), на который мы будем перемножать значение ГБ, разделив текущий курс одного EUN в рублях на курс EUN в ГБ, получив таким образом, чему равен 1 рубль в ГБ
	var mnozRub = rubKursVar / eunKursVar;

	
	// Подсчитываем множитель для гривен, скорректировав его на указанный курс
	var mnozGriv = grivKursVar / eunKursVar;
	
	// Подсчитываем множитель для евро, скорректировав его на указанный курс
	var mnozEuro = euroKursVar / eunKursVar;
	
	// Подсчитываем множитель для долларов, скорректировав его на указанный курс
	var mnozDol = dolKursVar / eunKursVar;
	
	// Подсчитываем множитель для шекелей, скорректировав его на указанный курс
	var mnozShek = shekKursVar/ eunKursVar;
	
	// Инициализируем переменную, в которой будем хранить нужный множитель с зависимоти от выбранной валюты и присваиваем ему значение по умолчанию, равное 1 (то есть 1 рубль равен 1 гб)
	var mnozValuta = 1;
	
	// Инициализируем переменную, в которой будем хранить текстовую приставку, в зависимости от выбранной валюты
	var pristavka;
	
	// Запускаем функцию Switch, которая установит нужные значения приставки и множителя в зависимости от выбранной валюты
	switch (valutaVar) {
		case 'rub':
			mnozValuta = mnozRub;
			pristavka = ' руб.';
		break;
		case 'griv':
			mnozValuta = mnozGriv;
			pristavka = ' гр.';
		break;
		case 'euro':
			mnozValuta = mnozEuro;
			pristavka = ' евро';
		break;
		case 'dol':
			mnozValuta = mnozDol;
			pristavka = ' дол.';
		break;
		case 'shek':
			mnozValuta = mnozShek;
			pristavka = ' шек.';
		break;
		default:
			mnozValuta = mnozRub;
			pristavka = ' руб.';
	}
	
	// Записываем в переменную HTML-код текущей страницы
	var markup = document.documentElement.outerHTML;

	// Блок, где мы указываем различные регулярные выражения, которые нам могут понадобиться для поиска нужных значений на странице. Во всех регулярных выражениях мы указываем флаг /g , что означает, что мы ищем все совпадения.
	// Реглярное выражения для поиска суммы в ГБ, где знак доллара указан до цифр
	reDo = /\$[0-9,]+/g;
	
	// Реглярное выражения для поиска суммы в ГБ, где знак доллара указан после цифр
	rePosle = /[0-9,]+\$/g;
	
	// Реглярное выражения для поиска суммы в EUN
	reEUN = /[0-9]+\sEUN/g;
	
	// Запускаем поиск регулярного выражения для поиска суммы в ГБ, где знак доллара указан до цифр на записанной ранее странице
	foundDo = markup.match(reDo);
	
	// Запускаем поиск регулярного выражения для поиска суммы в ГБ, где знак доллара указан после цифр на записанной ранее странице
	foundPosle = markup.match(rePosle);
	
	// Запускаем поиск регулярного выражения для поиска суммы в EUN на записанной ранее странице
	foundEUN = markup.match(reEUN);

	// Составляем ряд регулярных выражений, которые могут помочь нам в дальнейшей работе
	// Регулярное выражение для поиска запятых
	regZap = /,/g;
	
	// Регулярное выражение для поиска знака доллара
	regDol = /\$/g;
	
	// Регулярное выражение для поиска знака пробела
	regProb = /\s/g;
	
	// Регулярное выражение для поиска слова EUN
	regEUN = /EUN/g;
	
	// Регулярное выражение для поиска точки
	regToch = /\./g;

	// Если на странице найдена сумма в ГБ, где знак доллара указан до цифр, то выполняем преобразование
	if (foundDo !== null) {
		
		// Инициализируем массив, в который будем сохранять обработанные значения сумм
		var cifDo = new Array();
		
		// Инициализируем массив, в который будем сохранять суммы в реальной валюте
		var realPriceDo = new Array();
		
		// Инициализиурем массив, в который будем сохранять готовые строковые значения со вставками сумм
		var togetherDo = new Array();
		
		// Запускаем цикл, который пройдётся по всем найденным на странице суммам и заменит их
		for (var index = 0; index < foundDo.length; ++index) {
			
			// Убираем из найденного значения запятую и сохраняем его
			cifDo[index] = foundDo[index].replace(regZap, '');
			
			// Убираем из найденного значения знак доллара и сохраняем его, получая чистые цифры
			cifDo[index] = cifDo[index].replace(regDol, '');
			
			// Подсчитываем сумму в реальной валюте, умножив суммы на множитель текущей валюты
			realPriceDo[index] = cifDo[index]*mnozValuta;
			
			// Округляем полученные сумму в реальной валюте до 2 знаков после запятой
			realPriceDo[index] = realPriceDo[index].toFixed(2);
			
			// Собираем строку с суммами воедино, указываю сумму, а также значение этой суммы в реальной валюте
			togetherDo[index] = "<b>" + foundDo[index] + " ~ </b><b style='color: red;'>" + realPriceDo[index] + pristavka;
			
			// Инициализируем jQuery переменную, в которой будем хранить текущие теги, в которых нужно заменить сумму на реальную, а именно ищем выделение жирным в таблице, которое содержит наше начальное значение, соответствующее регулярному выражению.
			var $resultsDo = $('td b:contains(' + foundDo[index] + ')').filter(function() {
				
				// Поскольку наше начальное значение текущего тега может также содержать в себе цифры, содержащиеся в других, не текущих тегах (например $1, также содержащийся в $123456), то отфильтровываем только теги, которые ПОЛНОСТЬЮ соответствуют нашему начальному значению, от начала и до конца, а не просто содержат его
				return $(this).text() === foundDo[index];
			});
			
			// Заменяем в отобранных текущих тегах значения сумм на реальные
			$resultsDo.html(togetherDo[index]);
		}
	}

	// Если на странице найдена сумма в ГБ, где знак доллара указан после цифр, то выполняем преобразование
	if (foundPosle !== null) {
		
		// Инициализируем массив, в который будем сохранять обработанные значения сумм
		var cifPosle = new Array();
		
		// Инициализируем массив, в который будем сохранять суммы в реальной валюте
		var realPricePosle = new Array();
		
		// Инициализиурем массив, в который будем сохранять готовые строковые значения со вставками сумм
		var togetherPosle = new Array();
		
		// Запускаем цикл, который пройдётся по всем найденным на странице суммам и заменит их
		for (var index = 0; index < foundPosle.length; ++index) {
			
			// Убираем из найденного значения запятую и сохраняем его
			cifPosle[index] = foundPosle[index].replace(regZap, '');
			
			// Убираем из найденного значения знак доллара и сохраняем его, получая чистые цифры
			cifPosle[index] = cifPosle[index].replace(regDol, '');
			
			// Подсчитываем сумму в реальной валюте, умножив суммы на множитель текущей валюты
			realPricePosle[index] = cifPosle[index]*mnozValuta;
			
			// Округляем полученные сумму в реальной валюте до 2 знаков после запятой
			realPricePosle[index] = realPricePosle[index].toFixed(2);
			
			// Собираем строку с суммами воедино, указываю сумму, а также значение этой суммы в реальной валюте
			togetherPosle[index] = foundPosle[index] + " ~ </b><b style='color: red'>" + realPricePosle[index] + pristavka;
			
			// Инициализируем jQuery переменную, в которой будем хранить текущие теги, в которых нужно заменить сумму на реальную, а именно ищем выделение жирным в таблице, которое содержит наше начальное значение, соответствующее регулярному выражению.
			var $resultsPosle = $('td b:contains(' + foundPosle[index] + ')').filter(function() {
				
				// Поскольку наше начальное значение текущего тега может также содержать в себе цифры, содержащиеся в других, не текущих тегах (например 1$, также содержащийся в 654321$), то отфильтровываем только теги, которые ПОЛНОСТЬЮ соответствуют нашему начальному значению, от начала и до конца, а не просто содержат его
				return $(this).text() === foundPosle[index];
			});
			
			// Заменяем в отобранных текущих тегах значения сумм на реальные
			$resultsPosle.html(togetherPosle[index]);
		}
	}

	// Если на странице найдена сумма в EUN, то выполняем преобразование
	if (foundEUN !== null) {
		
		// Инициализируем массив, в который будем сохранять обработанные значения сумм
		var cifEUN = new Array();
		
		// Инициализируем массив, в который будем сохранять суммы в реальной валюте
		var realPriceEUN = new Array();
		
		// Инициализиурем массив, в который будем сохранять готовые строковые значения со вставками сумм
		var togetherEUN = new Array();
		
		// Запускаем цикл, который пройдётся по всем найденным на странице суммам и заменит их
		for (var index = 0; index < foundEUN.length; ++index) {	
		
			// Убираем из найденного значения пробелы и сохраняем его
			cifEUN[index] = foundEUN[index].replace(regProb, '');
			
			// Убираем из найденного значения слово EUN и сохраняем его
			cifEUN[index] = cifEUN[index].replace(regEUN, '');
			
			// Убираем из найденного значения точку и сохраняем его
			cifEUN[index] = cifEUN[index].replace(regToch, '');
			
			// Подсчитываем сумму в реальной валюте, умножив суммы на курс EUN к гб и на множитель текущей валюты
			realPriceEUN[index] = cifEUN[index]*eunKursVar*mnozValuta;
			
			// Округляем полученные сумму в реальной валюте до 2 знаков после запятой
			realPriceEUN[index] = realPriceEUN[index].toFixed(2);
			
			// Собираем строку с суммами воедино, указываю сумму, а также значение этой суммы в реальной валюте
			togetherEUN[index] = "<b>" + foundEUN[index] + " ~ </b><b style='color: red;'>" + realPriceEUN[index] + pristavka;
			
			// Инициализируем jQuery переменную, в которой будем хранить текущие теги, в которых нужно заменить сумму на реальную, а именно ищем выделение жирным в таблице, которое содержит наше начальное значение, соответствующее регулярному выражению.
			var $resultsEUN = $('td b:contains(' + foundEUN[index] + ')').filter(function() {
				
				// Поскольку наше начальное значение текущего тега может также содержать в себе цифры, содержащиеся в других, не текущих тегах (например 1 EUN, также содержащийся в 654321 EUN), то отфильтровываем только теги, которые ПОЛНОСТЬЮ соответствуют нашему начальному значению, от начала и до конца, а не просто содержат его
				return $(this).text() === foundEUN[index];
			});
			
			// Заменяем в отобранных текущих тегах значения сумм на реальные
			$resultsEUN.html(togetherEUN[index]);
		}
	}
	
	// Если мы находимся на странице государственного или синдикатного магазина, то требуется дополнительное преобразование, так как на этих страницах сумма указана в отдельном от знака доллара теге
	if (window.location.pathname == '/shop.php' || window.location.pathname == '/sshop.php') {
		
		// Инициализируем массив, в который будем сохранять обработанные значения сумм
		var cifGos = new Array();
		
		// Инициализируем массив, в который будем сохранять суммы в реальной валюте
		var realPriceGos = new Array();
		
		// Инициализиурем массив, в который будем сохранять готовые строковые значения со вставками сумм
		var togetherGos = new Array();
		
		// Так как мы выискиваем значения, которые не смогли найти регулярные выражения, то мы записываем объект jQuery с подходящими тегами
		var foundGos = $('.gw-container > table table > tbody > tr > td > table > tbody > tr > td > b:nth-child(2), table + center > table > tbody > tr > td > b:nth-child(2)');

		for (var index = 0; index < foundGos.length + 1; ++index) {

			// Убираем из найденного значения точку и сохраняем его
			cifGos[index] = foundGos[index].innerHTML.replace(regZap, '');
			
			// Подсчитываем сумму в реальной валюте, умножив суммы на множитель текущей валюты
			realPriceGos[index] = cifGos[index]*mnozValuta;
			
			// Округляем полученные сумму в реальной валюте до 2 знаков после запятой
			realPriceGos[index] = realPriceGos[index].toFixed(2);
			
			// Собираем строку с суммами воедино, указываю сумму, а также значение этой суммы в реальной валюте
			togetherGos[index] = foundGos[index].innerHTML + " ~ </b><b style='color: red;'>" + realPriceGos[index] + pristavka;
			
			// Заменяем в отобранных текущих тегах значения сумм на реальные
			foundGos[index].innerHTML=(togetherGos[index]);
		}
	}
};