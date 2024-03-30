import * as calendarController from '../../calendar.js';
import * as common from '../../common.js';
import * as eventFormController from './eventForm.js';
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
        changePeriodStartDate();
    });

    document.getElementById('input-period-end-date').addEventListener('change', function() {
        changePeriodEndDate();
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
            calendarController.updatePreviewCalendar();
        });
    });

    document.querySelectorAll('.default-start-reception-time').forEach(function(button) {
        button.addEventListener('change', function() {
            //プレビューカレンダーを更新
            reservationDataController.updateReservationData();
            calendarController.updatePreviewCalendar();
        });
    });

    document.querySelectorAll('.default-end-reception-time').forEach(function(button) {
        button.addEventListener('change', function() {
            //プレビューカレンダーを更新
            reservationDataController.updateReservationData();
            calendarController.updatePreviewCalendar();
        });
    });

    document.getElementById('add-row-default-reception-time-button').addEventListener('click', function() {
        eventFormController.addFormRowReceptionTime();
    });

    //曜日別受付時間
    document.querySelector('.individual-day-of-week-pulldown').addEventListener('change', function() {
        // selectの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.updatePreviewCalendar();
    });

    document.querySelector('.individual-day-of-week-start-reception-time').addEventListener('change', function() {
        // 開始時間のinputの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.updatePreviewCalendar();
    });

    document.querySelector('.individual-day-of-week-end-reception-time').addEventListener('change', function() {
        // 終了時間のinputの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.updatePreviewCalendar();
    });

    document.getElementById('add-row-individual-day-of-week-button').addEventListener('click', function() {
        eventFormController.addFormRowIndividualDayOfWeek();
    });

    //特定指定日受付時間
    document.querySelector('.input-individual-date').addEventListener('change', function() {
        // selectの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.updatePreviewCalendar();
    });

    document.querySelector('.individual-date-start-reception-time').addEventListener('change', function() {
        // 開始時間のinputの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.updatePreviewCalendar();
    });

    document.querySelector('.individual-date-end-reception-time').addEventListener('change', function() {
        // 終了時間のinputの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.updatePreviewCalendar();
    });

    document.getElementById('add-row-individual-date-button').addEventListener('click', function() {
        eventFormController.addFormRowIndividualDate();
    });

    //除外日
    document.querySelector('.input-individual-exclusion-date').addEventListener('change', function() {
        // 終了時間のinputの値が変更されたときの処理

        //プレビューカレンダーを更新
        reservationDataController.updateReservationData();
        calendarController.updatePreviewCalendar();
    });

    document.getElementById('add-row-individual-exclusion-date-button').addEventListener('click', function() {
        eventFormController.addFormRowIndividualExclusionDate();
    });

    calendarController.createCalendar();

    //以下はイベント編集画面の処理
    //デバッグ時のみイベント作成画面で試す
    const eventId = '2';
    init(eventId);
}

function changePeriodStartDate(){
    const periodStartDate = document.getElementById('input-period-start-date').value.replace(/-/g, "");
    reservationDataController.setPropertyPeriodStartDate(periodStartDate);

    //プレビューカレンダーを更新
    reservationDataController.updateReservationData();
    calendarController.updatePreviewCalendar();
}

function changePeriodEndDate(){
    const periodEndDate = document.getElementById('input-period-end-date').value.replace(/-/g, "");
    reservationDataController.setPropertyPeriodEndDate(periodEndDate);

    //プレビューカレンダーを更新
    reservationDataController.updateReservationData();
    calendarController.updatePreviewCalendar();
}

function init(eventId) {
    fetch(`/admin/getEvent?eventId=${eventId}`)
      .then(response => response.json())
      .then(data => {

        if (data.eventData.length == 0) {
            throw new Error('イベント情報の取得に失敗しました。');
        }
          
        const eventData = data.eventData;
        const dowData = data.dowData;
        const dateData = data.dateData;

        // イベント情報の取得に成功した場合の処理
        // setEventInfo(eventData[0], dowData.filter(item => item.day_of_week_id === 7));
        // setWodReceptionTimeRow(dowData.filter(item => item.day_of_week_id != 7));


        setEventInfo(data);

        //setDateDataInfo(dateData);

      })
      .catch(error => console.error('Error:', error));
}

function setEventInfo(data) {

    const eventData = data.eventData[0];
    const receptionTimeData = data.dowData.filter(item => item.day_of_week_id === 7);
    const dowReceptionTimeData = data.dowData.filter(item => item.day_of_week_id != 7);


    const dowData = data.dowData;
    const dateData = data.dateData;

    // イベントタイトルを設定
    eventFormController.setEventTitle(eventData.event_title);

    // 開始日、終了日を設定
    eventFormController.setPeriodStartDate(common.convertDBDateToYYYYMMDD(eventData.start_date));
    eventFormController.setPeriodEndDate(common.convertDBDateToYYYYMMDD(eventData.end_date));

    // 一枠の時間を設定
    eventFormController.setReservationSlotTime(eventData.reservation_slot_time);

    // 実施曜日を設定
    eventFormController.setDayToggle(eventData.off_day_toggles);

    // 受付時間を設定
    eventFormController.setDefaultReceptionTime(receptionTimeData);

    // 個別曜日の受付時間を設定
    eventFormController.setWodReceptionTimeRow(dowReceptionTimeData);
}

function setWodReceptionTimeRow() {
    //個別曜日の受付時間を設定
    dowData.filter(item => item.is_default_row === 0)
}

//特定日の受付時間を設定
    //除外日を設定