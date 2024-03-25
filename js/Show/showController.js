import * as calendarController from '../calendar.js';

window.onload = function() {

    //イベントリスナー追加
    document.querySelector('.previous-month-button').addEventListener('click', function() {
        calendarController.showPrevMonth();
    });

    document.querySelector('.next-month-button').addEventListener('click', function() {
        calendarController.showNextMonth();
    });

    calendarController.createCalendar();
}