let previousYear, nextYear, previousMonth, nextMonth;

// BRANCH FOR ROOMS UPDATE

let yearSelectedCont = {};
let monthSelectedCont = {};
let hourSelectedCont = {};
let $inputSelectorsCont = {};

let $CalendarName = '';//hidden for pass through query parameters.

const $cantAdults = {sel: 1, max: 3};
const $cantRooms = {sel: 1, max: 5};
const $maxAdultsCiudad = {barranquilla: 2, bogota: 3};

let arrRoomsSelected = [
  {rooms: 1, guests: 1}
];

let selectedDateArr = {};
let selectedHour = undefined;
const calendarPopup = document.getElementById('calendarioPopup');
const monthSelectedLabel = document.querySelector('.month-selected');
const yearSelectedLabel = document.querySelector('.year-selected');
const daysSelectorContainer = document.querySelector('.contenido-calendario .body-calendario .days-selector');
const daysNumber = document.querySelectorAll('.contenido-calendario .body-calendario .days-selector .days-num a');
const nextMonthBtn = document.querySelector('.nextMonth');
const prevMonthBtn = document.querySelector('.prevMonth');
const timeSelector = document.getElementById('selectTime');
const carruselTimeContainer = document.querySelector('.carrusel-vertical-horas');
const inputNumSelectors = document.querySelectorAll('.number-selector-container input');
const guestPicker = document.querySelector('.rooms-guests-picker input');

const allInputCalendars = document.querySelectorAll('input[data-type="calendar"]');
let arrAllInputCalendars = [];

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

function abrirCalendario(tiempo) {

  generarCalendario(yearSelectedCont[tiempo], monthSelectedCont[tiempo]);
  validateIfDateIsSelected(selectedDateArr, hourSelectedCont, tiempo)
  calendarPopup.style.display = "block";
}

function cerrarCalendario() {
  calendarPopup.setAttribute("data-opened", "false");
  calendarPopup.style.display = "none";
}

function generarCalendario($year, $month) {
  monthSelectedLabel.innerText = obtenerNombreMes($month);
  yearSelectedLabel.innerText = $year;

  previousYear = $year - 1;
  nextYear = $year + 1;
  previousMonth = $month === 0 ? 11 : $month - 1;
  nextMonth = $month === 11 ? 0 : $month + 1;

  const daysForMonth = obtenerDiasEnMes($year, $month);
  const firstDayWeekMonth = new Date(`${$year}-${$month + 1}-01`).getDay();
  const firstDayWeekMonthLetter = weekday.short[firstDayWeekMonth];
  
  const currentDate = new Date();
  let prevDateMonth = new Date(`${$month + 1}/01/${$year}`);
  //prevDateMonth.setMonth(prevDateMonth.getMonth() - 1);

  if (prevDateMonth <= currentDate) {
    prevMonthBtn.setAttribute('onclick', '');
  } else {
    prevMonthBtn.setAttribute('onclick', 'goToPrevMonth()');
  }

  let str = '';
  let daysBeforeNextMonth = firstDayWeekMonth === 0 ? 0 : obtenerDiasEnMes(($month === 0 ? previousYear : $year), previousMonth) - firstDayWeekMonth + 1;
  let daysLeft = firstDayWeekMonth;
  let daysCounter = 1;
  let daysAfter = 1;

  for (let i = 0; i < 42; i++) {
    if (daysLeft > 0) {

      const diasAntes = new Date(`${(previousMonth + 1)}/${daysBeforeNextMonth}/${(previousMonth === 11 ? previousYear : $year)}`);

      let dayIsAvaliable = ((diasAntes.getDate() === currentDate.getDate()) && (diasAntes.getMonth() === currentDate.getMonth()) && (diasAntes.getFullYear() === currentDate.getFullYear())) ? `onclick="selectThisDay(event, ${(previousMonth === 11 ? previousYear : $year)}, ${previousMonth}, ${daysBeforeNextMonth})"` : (currentDate < diasAntes) ? `onclick="selectThisDay(event, ${(previousMonth === 11 ? previousYear : $year)}, ${previousMonth}, ${daysBeforeNextMonth})"` : '';

      str += `<span class="days-num days-before-month" data-fecha="${(previousMonth === 11 ? previousYear : $year)}-${previousMonth}-${daysBeforeNextMonth}"><a href="#" ${dayIsAvaliable}>${daysBeforeNextMonth}</a></span>`;
      daysBeforeNextMonth++;
      daysLeft--;
    } else if (daysCounter <= daysForMonth) {

      const diasAntes = new Date(`${($month + 1)}/${daysCounter}/${$year}`);

      if (((diasAntes.getDate() === currentDate.getDate()) && (diasAntes.getMonth() === currentDate.getMonth()) && (diasAntes.getFullYear() === currentDate.getFullYear())) || (currentDate < diasAntes)) {
        str += `<span class="days-num days-in-month" data-fecha="${$year}-${$month}-${daysCounter}"><a href="#" onclick="selectThisDay(event, ${$year}, ${$month}, ${daysCounter})">${daysCounter}</a></span>`;
      } else {
        str += `<span class="days-num days-in-month cant-be-selected" data-fecha="${$year}-${$month}-${daysCounter}"><a href="#">${daysCounter}</a></span>`;
      }

      daysCounter++;
    } else {
      str += `<span class="days-num days-after-month" data-fecha="${(nextMonth === 0 ? nextYear : $year)}-${nextMonth}-${daysAfter}"><a href="#" onclick="selectThisDay(event, ${(nextMonth === 0 ? nextYear : $year)}, ${nextMonth}, ${daysAfter})">${daysAfter}</a></span>`;
      daysAfter++;
    }
  }

  daysSelectorContainer.innerHTML = str;

}

// allInputCalendars.forEach( el => {
//   el.addEventListener("click", (e) => {
    
//     if (el.getAttribute('data-opened') === 'true') {
//       el.setAttribute('data-opened', 'false')
//       cerrarCalendario();
      
//       return false;
//     }

//     const position = el.getBoundingClientRect();

//     calendarPopup.style.top = `${(position.bottom + 5)}px`;
    
//     calendarPopup.style.left = `${(position.left - 35)}px`;
//     el.setAttribute('data-opened', 'true')
//     calendarPopup.setAttribute('data-opened', 'true')
//     $CalendarName = el.getAttribute('data-calendar-name');
//     abrirCalendario(el.getAttribute('data-calendar-name'));
//   });
// })

window.onload = function () {
  detectAllCalendars();
  configSelectors();
  timeInitialConfig(encima, medio, debajo);
};

function detectAllCalendars() {
  allInputCalendars.forEach((el) => {
    arrAllInputCalendars.push(el.getAttribute('data-calendar-name'))

    yearSelectedCont[el.getAttribute('data-calendar-name')] = yearSelectedCont[el.getAttribute('data-calendar-name')] !== undefined ? yearSelectedCont[el.getAttribute('data-calendar-name')] : new Date().getFullYear();
    monthSelectedCont[el.getAttribute('data-calendar-name')] = monthSelectedCont[el.getAttribute('data-calendar-name')] !== undefined ? monthSelectedCont[el.getAttribute('data-calendar-name')] : new Date().getMonth();
    hourSelectedCont[el.getAttribute('data-calendar-name')] = undefined;
  })
}

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

  let ti = '';
  allInputCalendars.forEach((el) => {
    if (el.getAttribute('data-opened') === 'true') {
      monthSelectedCont[el.getAttribute('data-calendar-name')] = monthSelectedCont[el.getAttribute('data-calendar-name')] === 0 ? 11 : monthSelectedCont[el.getAttribute('data-calendar-name')] - 1;
      yearSelectedCont[el.getAttribute('data-calendar-name')] = monthSelectedCont[el.getAttribute('data-calendar-name')] === 11 ? previousYear : yearSelectedCont[el.getAttribute('data-calendar-name')];

      generarCalendario(yearSelectedCont[el.getAttribute('data-calendar-name')], monthSelectedCont[el.getAttribute('data-calendar-name')]);

      ti = el.getAttribute('data-calendar-name');
    }
  })

  validateIfDateIsSelected(selectedDateArr, hourSelectedCont, ti)
}

function goToNextMonth() {

  let ti = '';

  allInputCalendars.forEach((el) => {
    if (el.getAttribute('data-opened') === 'true') {

      monthSelectedCont[el.getAttribute('data-calendar-name')] = monthSelectedCont[el.getAttribute('data-calendar-name')] === 11 ? 0 : monthSelectedCont[el.getAttribute('data-calendar-name')] + 1;
      yearSelectedCont[el.getAttribute('data-calendar-name')] = monthSelectedCont[el.getAttribute('data-calendar-name')] === 0 ? nextYear : yearSelectedCont[el.getAttribute('data-calendar-name')];

      generarCalendario(yearSelectedCont[el.getAttribute('data-calendar-name')], monthSelectedCont[el.getAttribute('data-calendar-name')]);

      ti = el.getAttribute('data-calendar-name');
    }
  })

  validateIfDateIsSelected(selectedDateArr, hourSelectedCont, ti)
}

function selectThisDay(e, year, month, day) {

  e.preventDefault();

  uncheckAllDate();

  const selectedDate = document.querySelector(`[data-fecha="${year}-${month}-${day}"]`);
  selectedDate.classList.add('selected-date');
  selectedDateArr = {
    year: year,
    month: month,
    day: day
  }

  validarFechaHoraFinal(selectedDateArr, selectedHour);


}

const validateIfDateIsSelected = (date, dateAr, tiempo) => {

  if (dateAr[tiempo] !== undefined) {
    
      let fec = dateAr[tiempo].substring(0, 10)
      const fecha = new Date(fec);

      const selectedDate = document.querySelectorAll('.contenido-calendario .body-calendario .days-selector .days-num');
      fecha.setHours(fecha.getHours() + 5);
      console.log(fecha);
      selectedDate.forEach((el) => {
        if (el.getAttribute('data-fecha') === `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`) {
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

            $inputSelectorsCont[s.getAttribute("name")] = this.innerHTML;

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

    hourSelectedCont[$CalendarName] = `${year}-${month}-${day} ${hora}`;
    document.querySelector(`input[data-calendar-name='${$CalendarName}']`).value = `${year}-${month}-${day} ${hora}`;

    // userSelectedTime = `${year}-${month}-${day} ${hora}`
    // inputFecha.value = `${year}-${month}-${day} ${hora}`;

  }

}

function timeInitialConfig(encima, medio, debajo) {
  
  let str = '';

  str += `<li onclick="chooseHour('up')">${timeOptions[encima].f12h}</li>`;
  str += `<li class="selected">${timeOptions[medio].f12h}</li>`;
  str += `<li onclick="chooseHour('down')">${timeOptions[debajo].f12h}</li>`;

  carruselTimeContainer.querySelector('ul').innerHTML = str;
  selectedHour = timeOptions[medio].f12h;
  validarFechaHoraFinal(selectedDateArr, timeOptions[medio].f12h, null);
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
  const calendarIsOpened = calendarPopup.getAttribute("data-opened");
  const quantityBoxes = document.querySelectorAll('.selectQuantityBox');

  allInputCalendars.forEach(elmn => {

    if (elmn.contains(e.target)) {
      
      if (elmn.getAttribute('data-opened') === 'true') {
        elmn.setAttribute('data-opened', 'false')
        cerrarCalendario();
        
        return false;
      }
  
      const position = elmn.getBoundingClientRect();
  
      calendarPopup.style.top = `${(position.bottom + 5)}px`;
      
      calendarPopup.style.left = `${(position.left - 35)}px`;
      elmn.setAttribute('data-opened', 'true')
      calendarPopup.setAttribute('data-opened', 'true')
      $CalendarName = elmn.getAttribute('data-calendar-name');
      abrirCalendario(elmn.getAttribute('data-calendar-name'));
    } else if (elmn.getAttribute('data-opened') === 'true' && calendarIsOpened === 'true' && !calendarPopup.contains(e.target)) {
      elmn.setAttribute('data-opened', 'false')
      cerrarCalendario();
      
      return false;
      
    }

  })

  if (document.getElementsByClassName('select-arrow-active').length > 0) {
      closeAllSelect()
  }

  inputNumSelectors.forEach(selector => {
    if (quantityBoxes.length !== 0 && !selector.contains(e.target)) {
      quantityBoxes.forEach(box => {
        if (!box.contains(e.target)) {
          let tipo = box.getAttribute('data-type');
  
          if (tipo === selector.dataset.typename) {
            selector.dataset.opened = 'false';
            box.remove();
          }
  
        }
      })
    }

  })


});

function openRoomsPicker() {
  if (guestPicker.dataset.opened === 'false') {

    generateRoomsPicker()
    guestPicker.dataset.opened = 'true';
  }
}

function generateRoomsPicker() {
  let roomNumber = 1;
  let c = `<div class="selectRommsGuestsBox">`
    arrRoomsSelected.forEach(arr => {
      c += `<div class="roomContainer">
        <label>Habitación ${roomNumber}<label>
        <div class="numberPicker">
          <div class="minusOption">
            <button type="button" onclick="changeQuantityInput(false)">−</button>
          </div>
          <span class="selectedNumOption">${arr.guests}</span>
          <div class="addOption">
            <button type="button" onclick="changeQuantityInput(true)">+</button>
          </div>
        </div>
      </div>`;

      roomNumber++;
    })
  c += `</div>`

  guestPicker.insertAdjacentHTML('afterend', c);
}

inputNumSelectors.forEach(el => {
  el.addEventListener('click', () => {
    if (el.dataset.opened === 'false') {

      const itemValue = el.value.split(' ')[0];

      el.insertAdjacentHTML('afterend', `
      <div class="selectQuantityBox" data-type="${el.dataset.typename}">
      <div class="minusOption">
        <button type="button" onclick="changeQuantityInput('${el.dataset.typename}', false)">−</button>
      </div>
      <span class="selectedNumOption">${itemValue}</span>
      <div class="addOption">
        <button type="button" onclick="changeQuantityInput('${el.dataset.typename}', true)">+</button>
      </div>
    </div>
      `);
  
      el.dataset.opened = 'true';
    }
  
  })

})

function changeQuantityInput(tipo, sumar) {

  if (tipo === 'adults') {

    if (!sumar) {

      if ($cantAdults.sel === 1) {
        return false;
      }

      $cantAdults.sel --;

    } else {

      if ($cantAdults.sel >= $cantAdults.max) {
        return false;
      }

      $cantAdults.sel ++;

    }

    document.getElementById("adultsInput").value = $cantAdults.sel === 1 ? `1 huésped` : `${$cantAdults.sel} huéspedes`;
    document.querySelector('.number-selector-container .selectQuantityBox[data-type="adults"] .selectedNumOption').innerText = $cantAdults.sel;

  } else if (tipo === 'rooms') {
    if (!sumar) {

      if ($cantRooms.sel === 1) {
        return false;
      }

      $cantRooms.sel --;

    } else {

      if ($cantRooms.sel === $cantRooms.max) {
        return false;
      }

      $cantRooms.sel ++;

    }

    if ($cantAdults.sel > ($cantRooms.sel * $maxAdultsCiudad.bogota)) {
      $cantAdults.sel = $cantRooms.sel * $maxAdultsCiudad.bogota;
      document.getElementById("adultsInput").value = $cantAdults.sel === 1 ? `1 huésped` : `${$cantAdults.sel} huéspedes`;
    }

    $cantAdults.max = $cantRooms.sel * $maxAdultsCiudad.bogota;

    document.getElementById("roomsInput").value = $cantRooms.sel === 1 ? `1 habitación` : `${$cantRooms.sel} habitaciones`;
    document.querySelector('.number-selector-container .selectQuantityBox[data-type="rooms"] .selectedNumOption').innerText = $cantRooms.sel;
  }

}
 
function fixDate(str) {

  str = str.replaceAll(' ', '-')
  str = str.replaceAll(':', '-')
  let arr = str.split('-');

  arr[0] = parseInt(arr[0])
  arr[1] = parseInt(arr[1]) - 1
  arr[2] = parseInt(arr[2])

  if (arr[5] === 'a.m.') {
    if (parseInt(arr[3]) === 12) {
      arr[3] = 0;
    } else {
      arr[3] = parseInt(arr[3])
    }
  } else {
    if (parseInt(arr[3]) !== 12) {
      arr[3] = parseInt(arr[3]) + 12;
    } else {
      arr[3] = parseInt(arr[3])
    }
  }

  return new Date(arr[0], arr[1], arr[2], arr[3]);
}

function findBooking() {
// Send parameters to backend server:

if (hourSelectedCont.cuandoVienes === undefined) {
  console.error('No se ha seleccionado una fecha y hora de entrada');
  return false;
}

let CuandoVienes = fixDate(hourSelectedCont.cuandoVienes);

if (hourSelectedCont.cuandoTeVas === undefined) {
  console.error('No se ha seleccionado una fecha y hora de salida');
  return false;
}

let CuandoTeVas = fixDate(hourSelectedCont.cuandoTeVas);

if (CuandoTeVas <= CuandoVienes) {
  console.error('La hora de salida debe ser mayor a la hora de entrada');
  return false;
}

if ($inputSelectorsCont.selectedHotel === undefined) {
  console.error('No se ha seleccionado el hotel.');
  return false;
}

const data = {
  horaEntrada: hourSelectedCont.cuandoVienes,
  horaSalida: hourSelectedCont.cuandoTeVas,
  hotel: $inputSelectorsCont.selectedHotel,
  habitaciones: $cantRooms.sel,
  adultos: $cantAdults.sel,
}

console.log(data);
}