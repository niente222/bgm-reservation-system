
import * as calendarController from '../../calendar.js';
import * as reservationDataController from '../eventMake/reservationData.js';
import * as dashboardFormController from './dashboardForm.js';
import * as common from '../../common.js';


var eventId_urlpram = new URL(window.location.href).pathname.split('/').pop();

// 予約リスト
// プレビューカレンダーの通知設定に使う
var reservedList;

var targetReservationDate;

window.onload = function() {
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
        } else {
            console.error('イベント情報の取得に失敗しました。');
        }

        reservedList = await getReserve();
        
        calendarController.setReservedData(reservedList);
        calendarController.setNotificationBadge();
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
        console.log('getEvent:', data);  // レスポンスデータをログに出力
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

export function deleteReservation(reservationId) {
    fetch('/admin/deleteReserve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            reservation_id: reservationId
        })
    })
    .then(response => response.json())
    .then(eventId => {
        // 全てのinsert処理が成功した後に実行される
        console.log(`All insert operations completed for event ID ${eventId}`);
    })
    .catch(error => {
        console.error('Error:', error);
        // エラー処理をここに記述
    });
}

function setEventInfo(data){
    reservationDataController.setReservationDataForReservation(data);
    calendarController.updatePreviewCalendar();
}

function setReservationSlotBoard(cellId){
    const reservationListByDate = common.filterReservationsByDate(reservedList,cellId);
    targetReservationDate = cellId;

    //reservation-boardに予約リストをセットする
    dashboardFormController.setDashboard(reservationListByDate);
}