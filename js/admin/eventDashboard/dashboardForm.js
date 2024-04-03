import * as dashboardController from './eventDashboardController.js';
import * as common from '../../common.js';

export function setDashboard(reservations) {
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
        dashboardController.deleteReservation(reservation.reservation_id);  // 予約削除関数を呼び出す
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