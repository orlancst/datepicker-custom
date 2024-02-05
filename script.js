    let $yearSelected, $monthSelected, previousYear, nextYear, previousMonth, nextMonth;
    const monthSelectedLabel = document.querySelector('.month-selected');
    const yearSelectedLabel = document.querySelector('.year-selected');
    const daysSelectorContainer = document.querySelector('.contenido-calendario .body-calendario .days-selector');
    const daysNumber = document.querySelectorAll('.contenido-calendario .body-calendario .days-selector .days-num a');
    const nextMonthBtn = document.querySelector('.nextMonth');
    const prevMonthBtn = document.querySelector('.prevMonth');

    const weekday = ["D", "L", "M", "M", "J", "V", "S"];

  // Función para abrir el calendario
  function abrirCalendario() {
    generarCalendario();
    document.getElementById("calendarioPopup").style.display = "block";
  }

  // Función para cerrar el calendario
  function cerrarCalendario() {
    document.getElementById("calendarioPopup").style.display = "none";
  }

  // Función para generar el contenido del calendario
  function generarCalendario() {
    monthSelectedLabel.innerText = obtenerNombreMes($monthSelected);
    yearSelectedLabel.innerText = $yearSelected;

    previousYear = $yearSelected - 1;
    nextYear = $yearSelected + 1;
    previousMonth = $monthSelected === 0 ? 11 : $monthSelected - 1;
    nextMonth = $monthSelected === 11 ? 0 : $monthSelected + 1;

    const daysForMonth = obtenerDiasEnMes($yearSelected, $monthSelected);
    const firstDayWeekMonth = new Date(`${$yearSelected}-${$monthSelected + 1}-01`).getDay();
    const firstDayWeekMonthLetter = weekday[firstDayWeekMonth];

    let str = '';
    let daysBeforeNextMonth = firstDayWeekMonth === 0 ? 0 : obtenerDiasEnMes(($monthSelected === 0 ? previousYear : $yearSelected), previousMonth) - firstDayWeekMonth + 1;
    let daysLeft = firstDayWeekMonth;
    let daysCounter = 1;
    let daysAfter = 1;

    for (let i = 0; i < 42; i++) {
        if (daysLeft > 0) {
            str += `<span class="days-num days-before-month" data-fecha="${(previousMonth === 11 ? previousYear : $yearSelected)}-${previousMonth}-${daysBeforeNextMonth}"><a href="#" onclick="selectThisDay(${(previousMonth === 11 ? previousYear : $yearSelected)}, ${previousMonth}, ${daysBeforeNextMonth})">${daysBeforeNextMonth}</a></span>`;
            daysBeforeNextMonth ++;
            daysLeft -- ;
        } else if (daysCounter <= daysForMonth) {
            str += `<span class="days-num days-in-month" data-fecha="${$yearSelected}-${$monthSelected}-${daysCounter}"><a href="#" onclick="selectThisDay(${$yearSelected}, ${$monthSelected}, ${daysCounter})">${daysCounter}</a></span>`;
            daysCounter ++ ;
        } else {
            str += `<span class="days-num days-after-month" data-fecha="${(nextMonth === 0 ? nextYear : $yearSelected)}-${nextMonth}-${daysAfter}"><a href="#" onclick="selectThisDay(${(nextMonth === 0 ? nextYear : $yearSelected)}, ${nextMonth}, ${daysAfter})">${daysAfter}</a></span>`;
            daysAfter ++ ;
        }
    }

    daysSelectorContainer.innerHTML = str;

  }

  // Asignar la función de generación del calendario al cargar la página
  window.onload = function() {
    document.getElementById("fechaInput").addEventListener("click", function() {
      abrirCalendario();
      
    });

    $yearSelected = $yearSelected !== undefined ? $yearSelected : new Date().getFullYear();
    $monthSelected = $monthSelected !== undefined ? $monthSelected : new Date().getMonth();
  };

  const obtenerDiasEnMes = (year, month) => {
    // Crear un objeto Date con el primer día del mes siguiente
    // Restar un día para obtener el último día del mes actual
    const ultimoDia = new Date(year, month + 1, 0).getDate();
    return ultimoDia;
  }
  
  const obtenerNombreMes = (numeroMes) => {
    const meses = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return meses[numeroMes];
  }

  daysNumber.forEach((el) => {
    el.addEventListener('click', (e)=> {
      e.preventDefault();
      console.log('a');
    });
  })

  function goToPrevMonth() {
    $monthSelected = $monthSelected === 0 ? 11 : $monthSelected - 1;
    $yearSelected = $monthSelected === 11 ? previousYear : $yearSelected;

    generarCalendario();
  }

  function goToNextMonth() {
    $monthSelected = $monthSelected === 11 ? 0 : $monthSelected + 1;
    $yearSelected = $monthSelected === 0 ? nextYear : $yearSelected;

    generarCalendario();
  }

  function selectThisDay(year, month, day) {

    const uncheckSelectedDate = document.querySelectorAll('.contenido-calendario .body-calendario .days-selector .days-num');

    uncheckSelectedDate.forEach((el) => {
      if (el.classList.contains('selected-date')) {
        el.classList.remove('selected-date');
      }
    })

    const selectedDate = document.querySelector(`[data-fecha="${year}-${month}-${day}"]`);
    selectedDate.classList.add('selected-date');
    console.log(year, month, day);
  }