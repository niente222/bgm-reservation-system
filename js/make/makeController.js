import * as calendarController from '../calendar.js';
import * as formController from './form.js';
import * as reservationDataController from './reservationData.js';



//実施曜日
//bool配列 dayOfWeek
//要素 0=日 1=月 ... 6=土
//valid=true invalid=false
var isValidDayOfWeekList = new Array(true, true, true, true, true, true, true);

window.onload = function() {

    //イベントリスナー追加
    document.querySelector('.previous-month-button').addEventListener('click', function() {
        calendarController.showPrevMonth();
    });

    document.querySelector('.next-month-button').addEventListener('click', function() {
        calendarController.showNextMonth();
    });

    document.getElementById('input-period-start-date').addEventListener('change', function() {
        setPeriodStartDate();
    });

    document.getElementById('input-period-end-date').addEventListener('change', function() {
        setPeriodEndDate();
    });

    document.querySelectorAll('.day-toggle').forEach(function(button) {
        button.addEventListener('click', function() {
            const id = this.id.replace(/day-toggle-/g, "");
            isValidDayOfWeekList[id] = !isValidDayOfWeekList[id];
            if(isValidDayOfWeekList[id]){
                this.classList.remove('day-toggle-off');
            }else{
                this.classList.add('day-toggle-off');
            }
            reservationDataController.setIsValidDayOfWeekList(id, !this.classList.contains('day-toggle-off'));

            //プレビューカレンダーを更新
            reservationDataController.updateReservationData();
            calendarController.pudatePreviewCalendar();
        });
    });

    document.querySelectorAll('.default-start-reception-time').forEach(function(button) {
        button.addEventListener('change', function() {
            //reservationDataController.setDefaultStartReceptionTime(this.value.replace(/:/g, ""));
            //プレビューカレンダーを更新
            reservationDataController.updateReservationData();
            calendarController.pudatePreviewCalendar();
        });
    });

    document.querySelectorAll('.default-end-reception-time').forEach(function(button) {
        button.addEventListener('change', function() {
            //reservationDataController.setDefaultEndReceptionTime(this.value.replace(/:/g, ""));
            //プレビューカレンダーを更新
            reservationDataController.updateReservationData();
            calendarController.pudatePreviewCalendar();
        });
    });

    document.getElementById('add-row-default-reception-time-button').addEventListener('click', function() {
        formController.addFormRowReceptionTime();
    });

    //曜日別受付時間
    document.querySelector('.individual-day-of-week-pulldown').addEventListener('change', function() {
        // selectの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.pudatePreviewCalendar();
    });

    document.querySelector('.individual-day-of-week-start-reception-time').addEventListener('change', function() {
        // 開始時間のinputの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.pudatePreviewCalendar();
    });

    document.querySelector('.individual-day-of-week-end-reception-time').addEventListener('change', function() {
        // 終了時間のinputの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.pudatePreviewCalendar();
    });

    document.getElementById('add-row-individual-day-of-week-button').addEventListener('click', function() {
        formController.addFormRowIndividualDayOfWeek();
    });

    //特定指定日受付時間
    document.querySelector('.input-individual-date').addEventListener('change', function() {
        // selectの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.pudatePreviewCalendar();
    });

    document.querySelector('.individual-date-start-reception-time').addEventListener('change', function() {
        // 開始時間のinputの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.pudatePreviewCalendar();
    });

    document.querySelector('.individual-date-end-reception-time').addEventListener('change', function() {
        // 終了時間のinputの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.pudatePreviewCalendar();
    });

    document.getElementById('add-row-individual-date-button').addEventListener('click', function() {
        formController.addFormRowIndividualDate();
    });

    //除外日
    document.querySelector('.input-individual-exclusion-date').addEventListener('change', function() {
        // 終了時間のinputの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.pudatePreviewCalendar();
    });

    document.getElementById('add-row-individual-exclusion-date-button').addEventListener('click', function() {
        formController.addFormRowIndividualExclusionDate();
    });

    calendarController.createCalendar();
}





function setPeriodStartDate(){
    const periodStartDate = document.getElementById('input-period-start-date').value.replace(/-/g, "");
    reservationDataController.setPeriodStartDate(periodStartDate);

    //プレビューカレンダーを更新
    reservationDataController.updateReservationData();
    calendarController.pudatePreviewCalendar();
}

function setPeriodEndDate(){
    const periodEndDate = document.getElementById('input-period-end-date').value.replace(/-/g, "");
    reservationDataController.setPeriodEndDate(periodEndDate);

    //プレビューカレンダーを更新
    reservationDataController.updateReservationData();
    calendarController.pudatePreviewCalendar();
}