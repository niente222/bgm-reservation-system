import * as calendarController from '../calendar.js';
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
    const eventId = '1';
    setFormInit(eventId);
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

function setFormInit(eventId){

    fetch(`https://niente0520.xsrv.jp/data?eventId=${eventId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

      
    const eventInfo = [
        {
            event_id: '1',
            event_title: '第五回キャリアコンサルタント',
            reservation_slot_time: '15',
            start_day: '2024-03-19',
            end_day: '2024-04-10'
        }
    ];

    //イベント情報取得
    //イベントTとイベント詳細Tを結合してデータ取得
    // データが取得できない場合はエラー
    if ( eventInfo.length != 1) {
        return;
    }

    //取得出来たらほかの3テーブルも取得 それぞれwhere=イベントidで取得

    //イベントタイトルを設定
    eventFormController.setEventTitle(eventInfo[0].event_title);
    
    //開始日、終了日を設定
    eventFormController.setPeriodStartDate(eventInfo[0].start_day);
    eventFormController.setPeriodEndDate(eventInfo[0].end_day);

    //一枠の時間を設定
    eventFormController.setReservationSlotTime(eventInfo[0].reservation_slot_time);
}