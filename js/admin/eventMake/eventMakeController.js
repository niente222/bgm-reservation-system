import * as calendarController from '../../calendar.js';
import * as common from '../../common.js';
import * as validation from '../../validation.js';
import * as constants from '../../constants.js';
import * as eventFormController from './eventForm.js';
import * as reservationDataController from './reservationData.js';

// 画面モード
// mode = 'new' 登録画面
// mode = 'edit' 更新画面
var mode = '';
const currentUrl = window.location.pathname;
var beforeUpdateEventTitle;
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

    document.querySelector('.form.reservation-slot-time input').addEventListener('input', function(event) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    //一コマの時間に応じてinput type=timeのプルダウンの選択肢を変える
    //　いったん保留
    // document.querySelector('.form.reservation-slot-time input').addEventListener('change', function() {
    //     eventFormController.setReceptionTimeStep();
    // });

    //$('.lib-timepicker-default-start-reception-time').timepicker();

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

    // キャンセルボタン
    document.getElementById('cancel-button').addEventListener('click', () => {
        if(window.confirm('入力内容は破棄を破棄してイベント一覧画面に戻ります。\nよろしいですか？')){
            window.location.href = '/admin/eventList';
        }
    });

    //以下はイベント編集画面の処理
    if (mode === 'edit'){
        //タイトルとH1とボタンの文言を編集画面用に書き換え
        document.title = 'イベント編集ページ';
        document.getElementById('pege-headline').textContent = 'イベント編集ページ';
        document.getElementById('event-make-button').textContent = '予約を更新する';
        init(eventId_urlpram);
    }
}

function setReservationSlotBoard(cellId){
    
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

        // 予約データも取得
        beforeUpdateEventTitle = eventData.eventData[0].event_title;
        const reservedData = await getReserve(eventId);
        calendarController.setReservedData(reservedData);
        calendarController.setNotificationBadge();

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

async function clickMakeEventButton() {

    //入力チェック
    if(await hasErrorFormData()){
        alert("入力エラーがあります。\nご確認ください。");
        return;
    } 

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

async function hasErrorFormData(){
    let hasError = false
    
    //イベントタイトル
    if(await validateEventTitle()){
        hasError = true;
    }

    //期間
    if(validatePeriod()){
        hasError = true;
    }

    //一枠の時間
    if(validateReservationSlotTime()){
        hasError = true;
    }

    //受付時間
    if(validateReceptionTime()){
        hasError = true;
    }

    //受付時間
    if(validateReceptionTime()){
        hasError = true;
    }

    //個別の曜日に受付時間を指定
    if(validateDowReceptionTime()){
        hasError = true;
    }

    //特定の日に受付時間を指定
    if(validateDateReceptionTime()){
        hasError = true;
    }

    //特定の日を除外する
    if(validateExclusionDate()){
        hasError = true;
    }

    return hasError;
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
        window.location.href = '/admin/eventMake/completed/new/' + eventId;
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

async function getEventByTitle(eventTitle) {
    try {
        const response = await fetch(`/admin/getCountEventByEventTitle?eventTitle=${eventTitle}`);
        if (!response.ok) {
            throw new Error('ネットワークレスポンスが正常ではありません');
        }
        const data = await response.json();
        return data.count;
    } catch (error) {
        console.error('Error:', error);
        throw error; // エラーを呼び出し元に伝播させる
    }
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

//入力チェック イベントタイトル
async function validateEventTitle(){
    const errorMessageForm = document.querySelector('.form.event-title .error-message');
    const eventTitle = eventFormController.getEventTitle();
    let errorMessageList = [];

    //未入力チェック 文字数チェック
    if(validation.isInputEmpty(eventTitle)){
        errorMessageList.push(constants.createErrorMessageInputEmpty());
    }else if(validation.isWithoutLengthRange(eventTitle, 32)){
        errorMessageList.push(constants.createErrorMessageWithoutLengthRange(32));
    }

    //重複チェック 編集モードでイベントタイトルを変更していない場合はスキップ
    console.log("beforeUpdateEventTitle:" + beforeUpdateEventTitle)
    if(!(mode === 'edit' && beforeUpdateEventTitle === eventFormController.getEventTitle())){
        if(await getEventByTitle(eventFormController.getEventTitle()) > 0){
            errorMessageList.push(constants.createErrorMessageDuplication(eventFormController.getEventTitle()));
        };
    }

    //入力エラーがあるので、エラーメッセージを付与
    if(errorMessageList.length > 0){
        validation.addErrorMessageToForm(errorMessageForm, errorMessageList);
        return true;
    }

    //入力エラーがないので、エラーメッセージをなくす
    validation.removeErrorMessageToForm(errorMessageForm);

    return false;
}

//入力チェック 期間
function validatePeriod(){
    const errorMessageForm = document.querySelector('.form.period .error-message');
    const startPeriod = eventFormController.getPeriodStartDate();
    const endPeriod = eventFormController.getPeriodEndDate();
    let errorMessageList = [];

    //未入力チェック 日付フォーマットチェック
    if(validation.isInputEmpty(startPeriod) || validation.isInputEmpty(endPeriod)){
        errorMessageList.push(constants.createErrorMessageInputEmpty());
    }else if(validation.isInvalidDateFormat(startPeriod) || validation.isInvalidDateFormat(startPeriod)){
        errorMessageList.push(constants.createErrorMessageInvalidDateFormat());
    }

    //論理チェック
    if(validation.isEndDateBeforeStartDate(startPeriod, endPeriod)){
        errorMessageList.push(constants.createErrorMessageEndDateBeforeStartDate());
    }

    //入力エラーがあるので、エラーメッセージを付与
    if(errorMessageList.length > 0){
        validation.addErrorMessageToForm(errorMessageForm, errorMessageList);
        return true;
    }

    //入力エラーがないので、エラーメッセージをなくす
    validation.removeErrorMessageToForm(errorMessageForm);

    return false;
}

//入力チェック 一枠の時間
function validateReservationSlotTime(){
    const errorMessageForm = document.querySelector('.form.reservation-slot-time .error-message');
    const reservationSlotTime = eventFormController.getReservationSlotTime();
    let errorMessageList = [];

    //未入力チェック 数値フォーマットチェック 数値範囲チェック
    if(validation.isInputEmpty(reservationSlotTime)){
        errorMessageList.push(constants.createErrorMessageInputEmpty());
    }else if(validation.isInvalidNumberFormat(reservationSlotTime)){
        errorMessageList.push(constants.createErrorMessageInvalidNumberFormat());
    }else if(validation.isOutsideRange(reservationSlotTime, 3600, 1)){
        errorMessageList.push(constants.createErrorMessageOutsideRange(3600, 1));
    }

    //入力エラーがあるので、エラーメッセージを付与
    if(errorMessageList.length > 0){
        validation.addErrorMessageToForm(errorMessageForm, errorMessageList);
        return true;
    }

    //入力エラーがないので、エラーメッセージをなくす
    validation.removeErrorMessageToForm(errorMessageForm);

    return false;
}

//入力チェック 受付時間
function validateReceptionTime(){

    let errorCount = 0;

    //すべての受付時間を取得
    document.querySelectorAll('.form.default-reception-time .form-row-default-reception-time').forEach((row) => {

        // 行削除ボタンの行をスキップ
        if (row.classList.contains('only-add-button-row')) return;

        // 各行から開始時間と終了時間を取得
        const startTime = row.querySelector('.default-start-reception-time').value;
        const endTime = row.querySelector('.default-end-reception-time').value;
        const errorMessageForm = row.querySelector('.error-message') || row.nextElementSibling;
        let errorMessageList = [];

        //未入力チェック 時間フォーマットチェック
        if(validation.isInputEmpty(startTime) || validation.isInputEmpty(endTime)){
            errorMessageList.push(constants.createErrorMessageInputEmpty());
            errorCount++;
        }else if(validation.isInvalidTimeFormat(startTime) || validation.isInvalidTimeFormat(endTime)){
            errorMessageList.push(constants.createErrorMessageInvalidTimeFormat());
            errorCount++;
        }

        //論理チェック
        if(validation.isEndTimeBeforeStartTime(startTime, endTime)){
            errorMessageList.push(constants.createErrorMessageEndTimeBeforeStartTime());
            errorCount++;
        }

        //エラーメッセージをいったんリセット
        validation.removeErrorMessageToForm(errorMessageForm);

        //入力エラーがあれば、エラーメッセージを付与
        validation.addErrorMessageToForm(errorMessageForm, errorMessageList);
    });

    //入力エラーがある
    if(errorCount > 0){
        return true;
    }

    return false;
}

//入力チェック 個別の曜日に受付時間を指定
function validateDowReceptionTime(){

    let errorCount = 0;

    //すべての受付時間を取得
    document.querySelectorAll('.form.individual-day-of-week .form-row-individual-day-of-week').forEach((row) => {

        // 行削除ボタンの行をスキップ
        if (row.classList.contains('only-add-button-row')) return;

        // 各行から開始時間と終了時間を取得
        const dowId = row.querySelector('.individual-day-of-week-pulldown').value;
        const startTime = row.querySelector('.individual-day-of-week-start-reception-time').value;
        const endTime = row.querySelector('.individual-day-of-week-end-reception-time').value;
        const errorMessageForm = row.querySelector('.error-message') || row.nextElementSibling;
        let errorMessageList = [];

        //曜日Idチェック
        // 未入力チェック、曜日チェック
        if(validation.isInvalidDowId(dowId)){
            errorMessageList.push(constants.createErrorMessageInvalidDayOfWeekId());
            errorCount++;
        }

        //未入力チェック 時間フォーマットチェック
        // どちらか一方のみが入力されている場合エラーとする
        if(validation.isInputEmpty(startTime) && !validation.isInputEmpty(endTime) ||
                !validation.isInputEmpty(startTime) && validation.isInputEmpty(endTime)){
            errorMessageList.push(constants.createErrorMessageInputEmpty());
            errorCount++;
        }else if(validation.isInvalidTimeFormat(startTime) || validation.isInvalidTimeFormat(endTime)){
            errorMessageList.push(constants.createErrorMessageInvalidTimeFormat());
            errorCount++;
        }

        //論理チェック
        if(validation.isEndTimeBeforeStartTime(startTime, endTime)){
            errorMessageList.push(constants.createErrorMessageEndTimeBeforeStartTime());
            errorCount++;
        }

        //エラーメッセージをいったんリセット
        validation.removeErrorMessageToForm(errorMessageForm);

        //入力エラーがあれば、エラーメッセージを付与
        validation.addErrorMessageToForm(errorMessageForm, errorMessageList);
    });

    //入力エラーがある
    if(errorCount > 0){
        return true;
    }

    return false;
}

//入力チェック 特定の日に受付時間を指定
function validateDateReceptionTime(){

    let errorCount = 0;

    //すべての受付時間を取得
    document.querySelectorAll('.form.individual-date .form-row-individual-date').forEach((row) => {

        // 行削除ボタンの行をスキップ
        if (row.classList.contains('only-add-button-row')) return;

        // 各行から開始時間と終了時間を取得
        const date = row.querySelector('.input-individual-date').value;
        const startTime = row.querySelector('.individual-date-start-reception-time').value;
        const endTime = row.querySelector('.individual-date-end-reception-time').value;
        const errorMessageForm = row.querySelector('.error-message') || row.nextElementSibling;
        let errorMessageList = [];

        //未入力チェック 日付フォーマットチェック
        if(validation.isInputEmpty(date)){
            errorMessageList.push(constants.createErrorMessageInputEmpty());
            errorCount++;
        }else if(validation.isInvalidDateFormat(date)){
            errorMessageList.push(constants.createErrorMessageInvalidDateFormat());
            errorCount++;
        }

        //未入力チェック 時間フォーマットチェック
        // どちらか一方のみが入力されている場合エラーとする
        if(validation.isInputEmpty(startTime) && !validation.isInputEmpty(endTime) ||
                !validation.isInputEmpty(startTime) && validation.isInputEmpty(endTime)){
            errorMessageList.push(constants.createErrorMessageInputEmpty());
            errorCount++;
        }else if(validation.isInvalidTimeFormat(startTime) || validation.isInvalidTimeFormat(endTime)){
            errorMessageList.push(constants.createErrorMessageInvalidTimeFormat());
            errorCount++;
        }

        //論理チェック
        if(validation.isEndTimeBeforeStartTime(startTime, endTime)){
            errorMessageList.push(constants.createErrorMessageEndTimeBeforeStartTime());
            errorCount++;
        }

        //エラーメッセージをいったんリセット
        validation.removeErrorMessageToForm(errorMessageForm);

        //入力エラーがあれば、エラーメッセージを付与
        validation.addErrorMessageToForm(errorMessageForm, errorMessageList);
    });

    //入力エラーがある
    if(errorCount > 0){
        return true;
    }

    return false;
}

//入力チェック 特定の日を除外する
function validateExclusionDate(){

    let errorCount = 0;

    //すべての受付時間を取得
    document.querySelectorAll('.form.individual-exclusion-date .form-row-individual-exclusion-date').forEach((row) => {

        // 行削除ボタンの行をスキップ
        if (row.classList.contains('only-add-button-row')) return;

        // 各行から開始時間と終了時間を取得
        const date = row.querySelector('.input-individual-exclusion-date').value;
        const errorMessageForm = row.querySelector('.error-message') || row.nextElementSibling;
        let errorMessageList = [];

        //未入力チェック 日付フォーマットチェック
        if(validation.isInputEmpty(date)){
            errorMessageList.push(constants.createErrorMessageInputEmpty());
            errorCount++;
        }else if(validation.isInvalidDateFormat(date)){
            errorMessageList.push(constants.createErrorMessageInvalidDateFormat());
            errorCount++;
        }

        //エラーメッセージをいったんリセット
        validation.removeErrorMessageToForm(errorMessageForm);

        //入力エラーがあれば、エラーメッセージを付与
        validation.addErrorMessageToForm(errorMessageForm, errorMessageList);
    });

    //入力エラーがある
    if(errorCount > 0){
        return true;
    }

    return false;
}