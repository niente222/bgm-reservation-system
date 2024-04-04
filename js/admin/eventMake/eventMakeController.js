import * as calendarController from '../../calendar.js';
import * as common from '../../common.js';
import * as eventFormController from './eventForm.js';
import * as reservationDataController from './reservationData.js';

// 画面モード
// mode = 'new' 登録画面
// mode = 'edit' 更新画面
var mode = '';
const currentUrl = window.location.pathname;
// URLに含まれるパスによって条件分岐
if (currentUrl.includes('/admin/eventMake/new')) {
    mode = 'new';
} else if (currentUrl.includes('/admin/eventMake/edit')) {
    mode = 'edit';
}

// 更新画面用 パラメータ イベントID
var eventId_urlpram = new URL(window.location.href).pathname.split('/').pop();

//実施曜日
//bool配列 dayOfWeek
//要素 0=日 1=月 ... 6=土
//valid=true invalid=false
var isValidDayOfWeekList = new Array(true, true, true, true, true, true, true);

// 予約リスト
// プレビューカレンダーの通知設定に使う
var reservedList;

window.onload = function() {

    //イベントリスナー追加
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

    document.getElementById('event-make-button').addEventListener('click', function() {
        clickMakeEventButton();
    });

    calendarController.setHandleCellClick(setReservationSlotBoard);
    calendarController.createCalendar();

    calendarController.clickPrevMonthButton();
    calendarController.clickNextMonthButton();

    //以下はイベント編集画面の処理
    if (mode === 'edit'){
        init(eventId_urlpram);
    }
}

function setReservationSlotBoard(cellId){
    alert(cellId);
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

async function init(eventId) {
    try {
        // イベントの情報を取得
        const eventResponse = await fetch(`/admin/getEvent?eventId=${eventId}`);
        const eventData = await eventResponse.json();

        if (eventData.eventData.length === 0) {
            throw new Error('イベント情報の取得に失敗しました。');
        }

        setEventInfo(eventData);

        // 編集画面の場合は予約データも取得
        if (mode === 'edit') {
            const reservedData = await getReserve(eventId);
            calendarController.setReservedData(reservedData);
            calendarController.setNotificationBadge();
        }
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

function setEventInfo(data) {

    const eventData = data.eventData[0];
    const receptionTimeData = data.dowData.filter(item => item.day_of_week_id === 7);
    const dowReceptionTimeData = data.dowData.filter(item => item.day_of_week_id != 7);
    const dateData = data.dateData;
    const exclusionData = data.exclusionData;

    // イベントタイトルを設定
    eventFormController.setEventTitle(eventData.event_title);

    // 開始日、終了日を設定
    console.log("eventData.start_date:" + eventData.start_date);
    eventFormController.setPeriodStartDate(common.convertDBDateToYYYYMMDD(eventData.start_date));
    eventFormController.setPeriodEndDate(common.convertDBDateToYYYYMMDD(eventData.end_date));

    // 一枠の時間を設定
    eventFormController.setReservationSlotTime(eventData.reservation_slot_time);

    // 実施曜日を設定
    eventFormController.setDayToggle(eventData.off_day_toggles);

    // 受付時間を設定
    eventFormController.setDefaultReceptionTime(receptionTimeData);

    // 個別曜日の受付時間を設定
    eventFormController.setDowReceptionTimeRow(dowReceptionTimeData);

    //特定日の受付時間を設定
    eventFormController.setDateReceptionTimeRow(dateData);

    //除外日を設定
    eventFormController.setExclusionDateRow(exclusionData);
}

function clickMakeEventButton() {

    if(mode === 'new'){
        //イベントテーブル登録
        //個別曜日の受付時間登録
        //特定日の受付時間登録
        //除外日登録
        insertEvent();
    }else if(mode === 'edit'){
        //イベントテーブル更新
        //個別曜日の受付時間登録
        //特定日の受付時間登録
        //除外日登録
        updateEvent();
    }
    
}

function insertEvent() {
    fetch('/admin/insertEvent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event_title: eventFormController.getEventTitle(),
            start_date: eventFormController.getPeriodStartDate(),
            end_date: eventFormController.getPeriodEndDate(),
            reservation_slot_time: eventFormController.getReservationSlotTime(),
            off_day_toggles: eventFormController.getDayToggle(),
            ins_user: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const eventId = data.insertedId;

            // 全てのinsert処理を同時に開始
            return Promise.all([
                insertDowReceptionTime(eventId),
                insertDateReceptionTime(eventId),
                insertExclusionDate(eventId)
            ]).then(() => eventId);  // 全ての処理が成功したらeventIdを次に渡す
        } else {
            throw new Error('Event creation failed');
        }
    })
    .then(eventId => {
        // 全てのinsert処理が成功した後に実行される
        console.log(`All insert operations completed for event ID ${eventId}`);
        window.location.href = '/admin/eventMake/completed/new';
    })
    .catch(error => {
        console.error('Error:', error);
        // エラー処理をここに記述
    });
}

function updateEvent() {
    fetch('/admin/updateEvent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event_id: eventId_urlpram,
            event_title: eventFormController.getEventTitle(),
            start_date: eventFormController.getPeriodStartDate(),
            end_date: eventFormController.getPeriodEndDate(),
            reservation_slot_time: eventFormController.getReservationSlotTime(),
            off_day_toggles: eventFormController.getDayToggle()
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 全てのinsert処理を同時に開始
            return Promise.all([
                insertDowReceptionTime(eventId_urlpram),
                insertDateReceptionTime(eventId_urlpram),
                insertExclusionDate(eventId_urlpram)
            ]).then(() => eventId_urlpram);  // 全ての処理が成功したらeventIdを次に渡す
        } else {
            throw new Error('Event creation failed');
        }
    })
    .then(eventId => {
        // 全てのinsert処理が成功した後に実行される
        console.log(`All insert operations completed for event ID ${eventId_urlpram}`);
        window.location.href = '/admin/eventMake/completed/edit/' + eventId_urlpram;
    })
    .catch(error => {
        console.error('Error:', error);
        // エラー処理をここに記述
    });
}

function insertDowReceptionTime(eventId) {

    //受付時間の入力を配列に追加
    let dowReceptionTimes = eventFormController.getDefaultReceptionTime(eventId);

    //曜日別受付時間の入力を配列に追加
    dowReceptionTimes.push(...eventFormController.getDowReceptionTime(eventId));

    fetch('/admin/insertDowReceptionTime', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dowReceptionTimes)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
        } else {
            // エラー処理をここに記述
        }
    })
    .catch(error => console.error('Error:', error));
}

function insertDateReceptionTime(eventId) {

    //日付別受付時間の入力を配列に追加
    let dateReceptionTimes = eventFormController.getDateReceptionTime(eventId);

    fetch('/admin/insertDateReceptionTime', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dateReceptionTimes)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
        } else {
            // エラー処理をここに記述
        }
    })
    .catch(error => console.error('Error:', error));
}

function insertExclusionDate(eventId) {

    //除外日の入力を配列に追加
    let exclusionDates = eventFormController.getExclusionDate(eventId);

    fetch('/admin/insertExclusionDate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(exclusionDates)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
        } else {
            // エラー処理をここに記述
        }
    })
    .catch(error => console.error('Error:', error));
}

async function getReserve() {
    try {
        const response = await fetch(`/reservation/getReserve?eventId=${eventId_urlpram}`);
        if (!response.ok) {
            throw new Error('ネットワークレスポンスが正常ではありません');
        }
        const data = await response.json();
        console.log("data:" + JSON.stringify(data));  // レスポンスデータをログに出力
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error; // エラーを呼び出し元に伝播させる
    }
}