import * as calendarController from '../calendar.js';
import * as common from '../common.js';
import * as validation from '../validation.js';
import * as constants from '../constants.js';
import * as reservationDataController from '../admin/eventMake/reservationData.js';
import * as reservationFormController from './reservationForm.js';

// パラメータ イベントID
var eventId_urlpram = new URL(window.location.href).pathname.split('/').pop();

var reservationList;
var targetReservationDate;
var reservationSlotTime;

window.onload = function() {

    document.getElementById('reserve-make-button').addEventListener('click', function() {
        clickMakeReserveButton();
    });

    calendarController.setHandleCellClick(setClickCalendarCell);
    calendarController.setHandleCellHover(setMouseoverCalendarCell,setMouseoutCalendarCell);
    calendarController.createCalendar();

    calendarController.clickPrevMonthButton();
    calendarController.clickNextMonthButton();

    init();
}

async function init() {
    try {
        const data = await getEvent();
        
        if (data && data.eventData.length > 0) {
            setEventInfo(data);
            reservationSlotTime = data.eventData[0].reservation_slot_time;
            reservationFormController.setPreviewCalendarHeader(data.eventData[0]);
        } else {
            console.error('イベント情報の取得に失敗しました。');
        }

        reservationList = await getReserve(eventId_urlpram);

    } catch (error) {
        console.error('Error:', error);
    }
}

async function getEvent() {
    try {
        const response = await fetch(`/reservation/getEvent?eventId=${eventId_urlpram}`);
        if (!response.ok) {
            throw new Error('ネットワークレスポンスが正常ではありません');
        }
        const data = await response.json();
        console.log('getEvent data:', data);  // レスポンスデータをログに出力
        return data;
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

// 排他チェック用
async function getReserveForExclusion(reserveDate,startTime,endTime) {
    try {
        const response = await fetch(`/reservation/getReserveForExclusion?eventId=${eventId_urlpram}&reserveDate=${reserveDate}&startTime=${startTime}&endTime=${endTime}`);
        if (!response.ok) {
            throw new Error('ネットワークレスポンスが正常ではありません');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error; // エラーを呼び出し元に伝播させる
    }
}

function setEventInfo(data){
    reservationDataController.setReservationDataForReservation(data);
    calendarController.updatePreviewCalendar();
}

async function clickMakeReserveButton(){

    //入力チェック
    if(await hasErrorFormData()){
        alert("入力エラーがあります。\nご確認ください。");
        return;
    } 

    insertReservation();
}

async function hasErrorFormData(){
    let hasError = false
    
    //氏名
    if(await validateReserveName()){
        hasError = true;
    }

    //連絡先
    if(validateReserverContactAddress()){
        hasError = true;
    }

    //備考
    if(validateRemark()){
        hasError = true;
    }

    //予約時間
    if(await validateReceptionTime()){
        hasError = true;
    }

    return hasError;
}

function insertReservation() {
    fetch('/reservation/insertReserve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event_id: eventId_urlpram,
            reservation_date: common.convertYYYYMMDDtoISO(targetReservationDate),
            start_time: reservationFormController.getSelectedStartTime(),
            end_time: reservationFormController.getSelectedEndTime(),
            reserver_name: reservationFormController.getReserveName(),
            reserver_contact_address: reservationFormController.getReserveContactAddress(),
            remarks: reservationFormController.getRemark()
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const reserveId = data.insertedId;

            // 全てのinsert処理が成功した後に実行される
            console.log(`All insert operations completed for event ID ${reserveId}`);
            window.location.href = '/reservation/reserve/completed/' + reserveId;
        } else {
            throw new Error('Event creation failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // エラー処理をここに記述
    });
}

//入力チェック 氏名
async function validateReserveName(){
    const errorMessageForm = document.querySelector('.form.reserve-name .error-message');
    const reserverName = reservationFormController.getReserveName();
    let errorMessageList = [];

    //未入力チェック 文字数チェック
    if(validation.isInputEmpty(reserverName)){
        errorMessageList.push(constants.createErrorMessageInputEmpty());
    }else if(validation.isWithoutLengthRange(reserverName, 32)){
        errorMessageList.push(constants.createErrorMessageWithoutLengthRange(32));
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

//入力チェック 連絡先
function validateReserverContactAddress(){
    const errorMessageForm = document.querySelector('.form.reserver_contact_address .error-message');
    const reserverContactAddress = reservationFormController.getReserveContactAddress();
    let errorMessageList = [];

    //未入力チェック 文字数チェック
    if(validation.isInputEmpty(reserverContactAddress)){
        errorMessageList.push(constants.createErrorMessageInputEmpty());
    }else if(validation.isWithoutLengthRange(reserverContactAddress, 256)){
        errorMessageList.push(constants.createErrorMessageWithoutLengthRange(256));
    }

    //入力エラーがあるので、エラーメッセージを付与
    if(errorMessageList.length > 0){
        validation.addErrorMessageToForm(errorMessageForm, errorMessageList);
        return true;
    }
    console.log(errorMessageList);

    //入力エラーがないので、エラーメッセージをなくす
    validation.removeErrorMessageToForm(errorMessageForm);

    return false;
}

//入力チェック 備考
function validateRemark(){
    const errorMessageForm = document.querySelector('.form.remark .error-message');
    const remark = reservationFormController.getRemark();
    let errorMessageList = [];

    //文字数チェック
    if(validation.isWithoutLengthRange(remark, 256,0)){
        errorMessageList.push(constants.createErrorMessageWithoutLengthRange(256,0));
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

//入力チェック 予約時間
async function validateReceptionTime(){

    const reserveDate = common.convertYYYYMMDDtoISO(targetReservationDate) || '';
    const startTime = reservationFormController.getSelectedStartTime();
    const endTime = reservationFormController.getSelectedEndTime();
    const errorMessageForm = document.querySelector('.form.remark .error-message');
    let errorMessageList = [];

    //選択されているかチェック
    if(validation.isInputEmpty(reserveDate) || validation.isInputEmpty(startTime) || validation.isInputEmpty(endTime)){
        errorMessageList.push(constants.createErrorMessageWithoutLengthRange(256,0));
    }

    //整合性チェック
    // if(validateConsistencyReceptionTime()){
        // errorMessageList.push(constants.createErrorMessageWithoutLengthRange(256,0));
    // }

    //排他チェック ほかの項目にエラーがある場合は行わない
    if(errorMessageList.length == 0){
        if(await CheckExclusionReceptionTime(reserveDate,startTime,endTime)){
            errorMessageList.push(constants.createErrorMessageExclusion());
        }
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

//整合性チェック 予約時間
function validateConsistencyReceptionTime(){
    //登録している予約の予約日、開始時間、終了時間を取得
}

//排他チェック 予約時間
async function CheckExclusionReceptionTime(reserveDate,startTime,endTime){
    const dataCount = await getReserveForExclusion(reserveDate,startTime,endTime);
    return dataCount.count > 0;
}

//カレンダーセルクリック、ホバー時のイベントハンドラーをcalendarControllerにセット
function setClickCalendarCell(cellId){
    calendarController.clickCell(cellId);
    setReservationSlotBoard(cellId);
}

function setMouseoverCalendarCell(cellId){
    calendarController.mouseoverCell(cellId);
}

function setMouseoutCalendarCell(cellId){
    calendarController.mouseoutCell(cellId);
}

// カレンダーセルクリック時、左の予約枠リストをクリックした日付に更新する
function setReservationSlotBoard(cellId){
    const reservationData = reservationDataController.getReservationById(cellId);
    targetReservationDate = cellId;

    reservationFormController.setDashboardHeader(cellId);
    reservationFormController.setReservationSlotBoard(reservationData,reservationSlotTime);

    const reservedTimes = common.filterReservationsByDate(reservationList,cellId).map(event => {
        return { start_time: event.start_time, end_time: event.end_time };
      });

    reservationFormController.setReservedTimes(reservedTimes);
}