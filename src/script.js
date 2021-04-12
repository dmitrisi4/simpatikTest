let fullCircleDeg = 360;
let minuteTODegK = 6;
let hourTODegK = 30;
let transitionDuration = 1000; // in ms

let hourTimeout;
let minuteTimeout;
let inputs = document.querySelectorAll('.input-hour,.input-minute');

function setTime() {
	let hourFirstSymbol = document.getElementById('hour-1')?.value || 0;
	let hourSecondSymbol = document.getElementById('hour-2')?.value || 0;
	let minuteFirstSymbol = document.getElementById('minute-1')?.value || 0;
	let minuteSecondSymbol = document.getElementById('minute-2')?.value || 0;

	let hour = +`${hourFirstSymbol}${hourSecondSymbol}`;
	let minute = +`${minuteFirstSymbol}${minuteSecondSymbol}`;


	if (isNaN(hour) && isNaN(minute)) {
		return;
	}

	let arrowMinutes = document.querySelector('.arrow-minutes');
	let arrowHours = document.querySelector('.arrow-hours');
	let currentMinuteDeg = getRotateValue(arrowMinutes);
	let currentHourDeg = getRotateValue(arrowHours);
	let nextMinuteDeg = minute * minuteTODegK;
	let nextHourDeg = hour * hourTODegK;

	nextHourDeg = removeExtraDegs(nextHourDeg);

	let degsCount = nextHourDeg - currentHourDeg;
	let hoursCount = Math.floor((degsCount) / hourTODegK);

	nextMinuteDeg += hoursCount * fullCircleDeg;

	let rotateElem = (arrow, nextDeg) => {
		arrow.style.transitionDuration = `${transitionDuration}ms`;
		arrow.style.transform = `rotate(${nextDeg}deg)`;
		return setTimeout(() => {
			nextDeg = removeExtraDegs(nextDeg);
			arrow.style.transitionDuration = `0ms`;
			arrow.style.transform = `rotate(${nextDeg}deg)`;
		}, transitionDuration);
	}
	clearTimeout(minuteTimeout);
	clearTimeout(hourTimeout);

	minuteTimeout = rotateElem(arrowMinutes, nextMinuteDeg);
	hourTimeout = rotateElem(arrowHours, nextHourDeg);


	console.log(hour, minute);
}

inputs.forEach(input => {
	let regexHour = /[3-9]/g;
	let regexMinute = /[7-9]/g;
	input.oninput = function(){
		console.log('l')
		if (this.value.length > this.maxLength) {
			this.value = this.value.slice(0, this.maxLength)
		}
		if (input.classList.contains('input-hour-1')) {
			this.value = this.value.replace(regexHour, '');
		}
		if (input.classList.contains('input-minute-1')) {
			this.value = this.value.replace(regexMinute, '');
		}


	}
	input.addEventListener('input', setTime);
});


function removeExtraDegs(value) {
	return value - Math.floor(value / fullCircleDeg) * fullCircleDeg;
}

function getRotateValue(element) {
	const style = window.getComputedStyle(element)
	const matrix = style['transform'] || style.webkitTransform || style.mozTransform

	if (matrix === 'none' || typeof matrix === 'undefined') {
		return 0;
	}

	const matrixType = matrix.includes('3d') ? '3d' : '2d';
	const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');

	if (matrixType === '3d') {
		return 0;
	}

	const angle = Math.round(Math.atan2(+matrixValues[1], +matrixValues[0]) / (Math.PI / 180));

	return angle >= 0 ? angle : fullCircleDeg + angle;
}
