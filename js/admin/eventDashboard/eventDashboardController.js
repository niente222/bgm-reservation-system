
import * as calendarController from '../../calendar.js';
import * as reservationDataController from '../eventMake/reservationData.js';
import * as common from '../../common.js';


var eventId_urlpram = new URL(window.location.href).pathname.split('/').pop();

var reservationList;
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

function deleteReservation(reservationId) {
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
    const reservationListByDate = common.filterReservationsByDate(reservationList,cellId);
    targetReservationDate = cellId;

    //reservation-boardに予約リストをセットする
    setDashboard(reservationListByDate);
}

function setDashboard(reservations) {
    const reservationBoard = document.querySelector('.reservation-board');
  
    reservations.forEach(reservation => {
      const reservationData = document.createElement('div');
      reservationData.className = 'reservation-data';
      reservationData.id = reservation.reservation_id;  // 予約データごとに一意のIDを付与
  
      const deleteButtonArea = document.createElement('div');
      deleteButtonArea.className = 'delete-button-area';
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.textContent = '×';

      // イベントリスナーを追加
      deleteButton.addEventListener('click', function() {
        deleteReservation(reservation.reservation_id);  // 予約削除関数を呼び出す
        reservationData.parentNode.removeChild(reservationData);
      });

      deleteButtonArea.appendChild(deleteButton);
      reservationData.appendChild(deleteButtonArea);

      const startTime = common.convertHHmmToHHmm(common.convertDBTimeToHHMM(reservation.start_time));
      const endTime = common.convertHHmmToHHmm(common.convertDBTimeToHHMM(reservation.end_time));
  
      const reservationTimeArea = document.createElement('div');
      reservationTimeArea.className = 'reservation-time-area';
      const timeParagraph = document.createElement('p');
      timeParagraph.className = 'reservation-time';
      timeParagraph.textContent = `${startTime} ～ ${endTime}`;
      reservationTimeArea.appendChild(timeParagraph);
      reservationData.appendChild(reservationTimeArea);
  
      const reserverDataArea = document.createElement('div');
      reserverDataArea.className = 'reserver-data-area';
      const nameParagraph = document.createElement('p');
      nameParagraph.className = 'reserver-name';
      nameParagraph.textContent = reservation.reserver_name;
      reserverDataArea.appendChild(nameParagraph);
  
      const telParagraph = document.createElement('p');
      telParagraph.className = 'reserver-tel';
      telParagraph.textContent = reservation.reserver_contact_address;
      reserverDataArea.appendChild(telParagraph);
  
      const remarksParagraph = document.createElement('p');
      remarksParagraph.className = 'reserver-remarks';
      remarksParagraph.textContent = reservation.remarks;
      reserverDataArea.appendChild(remarksParagraph);
  
      reservationData.appendChild(reserverDataArea);
  
      reservationBoard.appendChild(reservationData);
    });
  }