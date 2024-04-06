import * as common from '../common.js';

// パラメータ 予約ID
var reservedId_urlpram = new URL(window.location.href).pathname.split('/').pop();

window.onload = function() {
    getReserved(reservedId_urlpram);
}

async function getReserved(reservedId) {
    try {
        // イベントの情報を取得
        const response = await fetch(`/reservation/getReserveById?reservationId=${reservedId}`);

        if (!response.ok) {
            throw new Error('ネットワークレスポンスが正常ではありません');
        }
        
        const data = await response.json();

        setCompletedReservationInfo(data.reserveData[0]);

    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

function setCompletedReservationInfo(completedData){

    const eventTitle = document.querySelector('.completed-event-title');
    eventTitle.textContent  = completedData.event_title;

    const reservationDate = document.querySelector('.completed-reserve-date');
    reservationDate.textContent  = common.formatDateSlashNoPadding(completedData.reservation_date);

    const reservationTime = document.querySelector('.completed-reserve-time');
    reservationTime.textContent  = common.convertTimeToHM(completedData.start_time)
         + " ～ " + common.convertTimeToHM(completedData.end_time);

    const reserverName = document.querySelector('.completed-reserver-name');
    reserverName.textContent  = completedData.reserver_name;

    const reservationContactAddress = document.querySelector('.completed-reserve-contact-address');
    reservationContactAddress.textContent  = completedData.reserver_contact_address;
}