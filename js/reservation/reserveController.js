import * as calendarController from '../calendar.js';
import * as common from '../common.js';
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

    calendarController.setHandleCellClick(setReservationSlotBoard);
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

function setEventInfo(data){
    reservationDataController.setReservationDataForReservation(data);
    calendarController.updatePreviewCalendar();
}

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

function clickMakeReserveButton(){
    insertReservation();
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
    .then(eventId => {
        // 全てのinsert処理が成功した後に実行される
        console.log(`All insert operations completed for event ID ${eventId}`);
        window.location.href = '/reservation/reserve/completed/2';
    })
    .catch(error => {
        console.error('Error:', error);
        // エラー処理をここに記述
    });
}