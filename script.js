let $yearSelected, $monthSelected, previousYear, nextYear, previousMonth, nextMonth;
let selectedDateArr = {};
let selectedHour = undefined;
let userSelectedTime = undefined; //hidden for pass through query parameters.
const monthSelectedLabel = document.querySelector('.month-selected');
const yearSelectedLabel = document.querySelector('.year-selected');
const daysSelectorContainer = document.querySelector('.contenido-calendario .body-calendario .days-selector');
const daysNumber = document.querySelectorAll('.contenido-calendario .body-calendario .days-selector .days-num a');
const nextMonthBtn = document.querySelector('.nextMonth');
const prevMonthBtn = document.querySelector('.prevMonth');
const timeSelector = document.getElementById('selectTime');
const inputFecha = document.getElementById('fechaInput');
const carruselTimeContainer = document.querySelector('.carrusel-vertical-horas');

const weekday = {
  full: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
  short: ["D", "L", "M", "M", "J", "V", "S"]
};

const timeOptions = [
  {f24h: "00:00", f12h: "12:00 a.m."},
  {f24h: "01:00", f12h: "1:00 a.m."},
  {f24h: "02:00", f12h: "2:00 a.m."},
  {f24h: "03:00", f12h: "3:00 a.m."},
  {f24h: "04:00", f12h: "4:00 a.m."},
  {f24h: "05:00", f12h: "5:00 a.m."},
  {f24h: "06:00", f12h: "6:00 a.m."},
  {f24h: "07:00", f12h: "7:00 a.m."},
  {f24h: "08:00", f12h: "8:00 a.m."},
  {f24h: "09:00", f12h: "9:00 a.m."},
  {f24h: "10:00", f12h: "10:00 a.m."},
  {f24h: "11:00", f12h: "11:00 a.m."},
  {f24h: "12:00", f12h: "12:00 p.m."},
  {f24h: "13:00", f12h: "1:00 p.m."},
  {f24h: "14:00", f12h: "2:00 p.m."},
  {f24h: "15:00", f12h: "3:00 p.m."},
  {f24h: "16:00", f12h: "4:00 p.m."},
  {f24h: "17:00", f12h: "5:00 p.m."},
  {f24h: "18:00", f12h: "6:00 p.m."},
  {f24h: "19:00", f12h: "7:00 p.m."},
  {f24h: "20:00", f12h: "8:00 p.m."},
  {f24h: "21:00", f12h: "9:00 p.m."},
  {f24h: "22:00", f12h: "10:00 p.m."},
  {f24h: "23:00", f12h: "11:00 p.m."},
]

let encima = timeOptions.length -1;
let medio = 0;
let debajo = 1;

function abrirCalendario() {
  generarCalendario();
  validateIfDateIsSelected(selectedDateArr)
  document.getElementById("calendarioPopup").setAttribute("data-opened", "true");
  document.getElementById("calendarioPopup").style.display = "block";
}


function cerrarCalendario() {
  document.getElementById("calendarioPopup").setAttribute("data-opened", "false");
  document.getElementById("calendarioPopup").style.display = "none";
}


function generarCalendario() {
  monthSelectedLabel.innerText = obtenerNombreMes($monthSelected);
  yearSelectedLabel.innerText = $yearSelected;

  previousYear = $yearSelected - 1;
  nextYear = $yearSelected + 1;
  previousMonth = $monthSelected === 0 ? 11 : $monthSelected - 1;
  nextMonth = $monthSelected === 11 ? 0 : $monthSelected + 1;

  const daysForMonth = obtenerDiasEnMes($yearSelected, $monthSelected);
  const firstDayWeekMonth = new Date(`${$yearSelected}-${$monthSelected + 1}-01`).getDay();
  const firstDayWeekMonthLetter = weekday.short[firstDayWeekMonth];

  let str = '';
  let daysBeforeNextMonth = firstDayWeekMonth === 0 ? 0 : obtenerDiasEnMes(($monthSelected === 0 ? previousYear : $yearSelected), previousMonth) - firstDayWeekMonth + 1;
  let daysLeft = firstDayWeekMonth;
  let daysCounter = 1;
  let daysAfter = 1;

  for (let i = 0; i < 42; i++) {
    if (daysLeft > 0) {
      str += `<span class="days-num days-before-month" data-fecha="${(previousMonth === 11 ? previousYear : $yearSelected)}-${previousMonth}-${daysBeforeNextMonth}"><a href="#" onclick="selectThisDay(${(previousMonth === 11 ? previousYear : $yearSelected)}, ${previousMonth}, ${daysBeforeNextMonth})">${daysBeforeNextMonth}</a></span>`;
      daysBeforeNextMonth++;
      daysLeft--;
    } else if (daysCounter <= daysForMonth) {
      str += `<span class="days-num days-in-month" data-fecha="${$yearSelected}-${$monthSelected}-${daysCounter}"><a href="#" onclick="selectThisDay(${$yearSelected}, ${$monthSelected}, ${daysCounter})">${daysCounter}</a></span>`;
      daysCounter++;
    } else {
      str += `<span class="days-num days-after-month" data-fecha="${(nextMonth === 0 ? nextYear : $yearSelected)}-${nextMonth}-${daysAfter}"><a href="#" onclick="selectThisDay(${(nextMonth === 0 ? nextYear : $yearSelected)}, ${nextMonth}, ${daysAfter})">${daysAfter}</a></span>`;
      daysAfter++;
    }
  }

  daysSelectorContainer.innerHTML = str;

}


window.onload = function () {
  document.getElementById("fechaInput").addEventListener("click", function () {
    abrirCalendario();
  });
  configSelectors();
  timeInitialConfig(encima, medio, debajo);
  $yearSelected = $yearSelected !== undefined ? $yearSelected : new Date().getFullYear();
  $monthSelected = $monthSelected !== undefined ? $monthSelected : new Date().getMonth();
};

const obtenerDiasEnMes = (year, month) => {

  const ultimoDia = new Date(year, month + 1, 0).getDate();
  return ultimoDia;
}

const obtenerNombreMes = (numeroMes) => {
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  return meses[numeroMes];
}

daysNumber.forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
  });
})

function goToPrevMonth() {
  $monthSelected = $monthSelected === 0 ? 11 : $monthSelected - 1;
  $yearSelected = $monthSelected === 11 ? previousYear : $yearSelected;

  generarCalendario();
  validateIfDateIsSelected(selectedDateArr)
}

function goToNextMonth() {
  $monthSelected = $monthSelected === 11 ? 0 : $monthSelected + 1;
  $yearSelected = $monthSelected === 0 ? nextYear : $yearSelected;

  generarCalendario();
  validateIfDateIsSelected(selectedDateArr)
}

function selectThisDay(year, month, day) {

  uncheckAllDate();

  const selectedDate = document.querySelector(`[data-fecha="${year}-${month}-${day}"]`);
  selectedDate.classList.add('selected-date');
  selectedDateArr = {
    year: year,
    month: month,
    day: day
  }

  validarFechaHoraFinal(selectedDateArr, selectedHour);

  const selectSelected = document.querySelector('.select-selected');
  if (!selectSelected.classList.contains('select-arrow-active')) {
    selectSelected.nextSibling.classList.toggle("select-hide");
    selectSelected.classList.toggle("select-arrow-active");

  }

}

const validateIfDateIsSelected = (date) => {

  if (Object.keys(date).length !== 0) {

    const { year, month, day } = date;

    const selectedDate = document.querySelectorAll('.contenido-calendario .body-calendario .days-selector .days-num');

    selectedDate.forEach((el) => {
      if (el.getAttribute('data-fecha') === `${year}-${month}-${day}`) {
        el.classList.add('selected-date');
        return true;
      }
    })

    return false;
  }

}

function uncheckAllDate() {
  const uncheckSelectedDate = document.querySelectorAll('.contenido-calendario .body-calendario .days-selector .days-num');

  uncheckSelectedDate.forEach((el) => {
    if (el.classList.contains('selected-date')) {
      el.classList.remove('selected-date');
    }
  })
}

function configSelectors() {
  
  let x, i, j, l, ll, selElmnt, a, b, c;
  /* Look for any elements with the class "custom-select": */
  x = document.getElementsByClassName("custom-select");
  l = x.length;
  for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
      /* For each option in the original select element,
      create a new DIV that will act as an option item: */
      c = document.createElement("DIV");
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener("click", function (e) {
        const calendarOpened = document.querySelector(".calendario-popup").getAttribute('data-opened');
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;

            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
      toggleSelecedSelect(e, this);

    });
  }

}

function toggleSelecedSelect(e, el) {

  /* When the select box is clicked, close any other select boxes,
  and open/cloelse the current select box: */
  e.stopPropagation();
  closeAllSelect(el);
  el.nextSibling.classList.toggle("select-hide");
  el.classList.toggle("select-arrow-active");


}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  let x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

function validarFechaHoraFinal(fecha, hora) {

  if ((Object.keys(fecha).length !== 0) && (hora !== undefined)) {

    let { year, month, day } = fecha;

    month = month < 9 ? '0' + (month + 1).toString() : (month + 1).toString();
    day = day < 10 ? '0' + day.toString() : day.toString();

    userSelectedTime = `${year}-${month}-${day} ${hora}`
    inputFecha.value = `${year}-${month}-${day} ${hora}`;

  }

}

function timeInitialConfig(encima, medio, debajo) {
  
  let str = '';

  str += `<li onclick="chooseHour('up')">${timeOptions[encima].f12h}</li>`;
  str += `<li class="selected">${timeOptions[medio].f12h}</li>`;
  str += `<li onclick="chooseHour('down')">${timeOptions[debajo].f12h}</li>`;

  carruselTimeContainer.querySelector('ul').innerHTML = str;
  validarFechaHoraFinal(selectedDateArr, timeOptions[medio].f12h);
}

function chooseHour(direction) {

  if (direction === 'up') {

    encima = encima != 0 ? encima - 1 : timeOptions.length - 1;
    medio = medio != 0 ? medio - 1 : timeOptions.length - 1;
    debajo = debajo != 0 ? debajo - 1 : timeOptions.length - 1;

  } else if (direction === 'down') {

    encima = encima != timeOptions.length - 1 ? encima +1 : 0;
    medio = medio != timeOptions.length - 1 ? medio +1 : 0;
    debajo = debajo != timeOptions.length - 1 ? debajo +1 : 0;

  }

  timeInitialConfig(encima, medio, debajo);

}

carruselTimeContainer.addEventListener('wheel', (el) => {
  el.preventDefault();
  if (el.deltaY > 0) {
    chooseHour('down');
  } else {
    chooseHour('up');
  }
})

document.body.addEventListener("click", (e) => {
  const calendar = document.getElementById("calendarioPopup");
  const closeCalendar = calendar.getAttribute("data-opened");

  if (!inputFecha.contains(e.target)) {
    if (closeCalendar === 'true' && !calendar.contains(e.target)) {
      cerrarCalendario()
      closeAllSelect()
    } else if (document.getElementsByClassName('select-arrow-active').length > 0) {
      closeAllSelect()
    }
  
    
  }
});