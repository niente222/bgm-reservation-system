import * as common from '../common.js';

//値設定系
export function setReservationSlotBoard(reserveData, reservationSlotTime) {
    const reservationSlotList = document.querySelector('.reservation-slot-list');

    // 既存のリスト内容をクリア
    reservationSlotList.innerHTML = '';
    console.log("reserveData:" + JSON.stringify(reserveData));
    reserveData.forEach(data => {
        // 開始時間と終了時間をHHmm形式から分単位に変換
        let startTime = common.convertHHmmToMinutes(data.start);
        let endTime = common.convertHHmmToMinutes(data.end);

        // 指定された一コマの時間で分割
        while (startTime <= endTime) {
            const nextTime = startTime + reservationSlotTime;

            // 終了時間を一回だけ超えるまでループ 
            if (nextTime > endTime + reservationSlotTime) {
                break;
            }

            // HH:mm形式に変換
            const startHHmm = common.convertMinutesToHHmm(startTime);
            const endHHmm = common.convertMinutesToHHmm(nextTime);

            // ラジオボタンと時間ラベルを作成
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'reservation-time';
            input.value = `${startHHmm} - ${endHHmm}`;

            const startTimeSpan = document.createElement('span');
            startTimeSpan.className = 'reserve_start_time';
            startTimeSpan.textContent = startHHmm;
            const endTimeSpan = document.createElement('span');
            endTimeSpan.className = 'reserve_end_time';
            endTimeSpan.textContent = endHHmm;
            const dashSpan = document.createElement('span');
            dashSpan.textContent = ' ～ ';

            // ラベルに要素を追加
            label.appendChild(input);
            label.appendChild(startTimeSpan);
            label.appendChild(dashSpan);
            label.appendChild(endTimeSpan);

            reservationSlotList.appendChild(label);

            // 次の時間帯のために更新
            startTime = nextTime;
        }
    });
}

export function setReservedTimes(reservedTimes){
    // すべてのラジオボタン要素を取得
    const allRadioButtons = document.querySelectorAll('.reservation-slot-list input[type="radio"]');

    // 各ラジオボタンに対して、予約済みの時間帯であれば無効化する
    allRadioButtons.forEach(radio => {
        const startTime = radio.nextElementSibling.textContent;
        const endTime = radio.nextElementSibling.nextElementSibling.nextElementSibling.textContent;

        // 予約済み時間帯に含まれているか確認
        const isReserved = reservedTimes.some(reserved => {
            return isTimeRangeOverlap(startTime, endTime, reserved.start_time, reserved.end_time);
        });

        // 予約済みであれば無効化
        if (isReserved) {
            radio.disabled = true;
            // 予約済みであることを示すためのクラスも追加することができる
            radio.parentElement.classList.add('reserved');
        }
    });
}

function isTimeRangeOverlap(startTime, endTime, reservedStart, reservedEnd) {
    // HH:mm 形式の時間を分に変換するヘルパー関数
    function convertTimeToMinutes(time) {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    }
  
    // 時間範囲を分に変換
    const start = convertTimeToMinutes(startTime);
    const end = convertTimeToMinutes(endTime);
    const reservedStartMin = convertTimeToMinutes(reservedStart);
    const reservedEndMin = convertTimeToMinutes(reservedEnd);
  
    // 予約時間範囲と重複しているかチェック
    return (start < reservedEndMin && end > reservedStartMin);
  }

export function setPreviewCalendarHeader(eventData){
    const eventPeriodStartDate = document.getElementById('preview-header-event-period-start-date');
    eventPeriodStartDate.textContent = common.formatDateSlashNoPadding(eventData.start_date);

    const eventPeriodEndDate = document.getElementById('preview-header-event-period-end-date');
    eventPeriodEndDate.textContent = common.formatDateSlashNoPadding(eventData.end_date);

    const eventTitle = document.getElementById('preview-header-event-title');
    eventTitle.textContent = eventData.event_title;
}

export function setDashboardHeader(targetDate){
    const dashboardHeaderTargetDate = document.getElementById('dashboard-header-target-date');
    dashboardHeaderTargetDate.textContent = common.convertToSlashSeparatedDate(targetDate);
}

//値取得系 
export function getReserveName() {
    const form = document.querySelector('.form.reserve-name input');
    return form.value;
}

export function getReserveContactAddress() {
    const form = document.querySelector('.form.reserver_contact_address input');
    return form.value;
}

export function getRemark() {
    const form = document.querySelector('.form.remark textarea');
    return form.value;
}

export function getSelectedStartTime() {
    // '.reservation-slot-list' 内のチェックされたラジオボタンを取得
    const selectedRadio = document.querySelector('.reservation-slot-list input[type="radio"]:checked');
    
    if (selectedRadio) {
        // ラジオボタンの次の兄弟要素を取得
        const nextSibling = selectedRadio.nextElementSibling;
        
        // 次の兄弟要素が span 要素で、クラス 'reserve_start_time' を持っているか確認
        if (nextSibling && nextSibling.classList.contains('reserve_start_time')) {
            // span 要素のテキスト内容を返す
            return nextSibling.textContent;
        }
    }

    // 選択されたラジオボタンがない場合や、期待する span 要素が見つからない場合は null を返す
    return null;
}

export function getSelectedEndTime() {
    // '.reservation-slot-list' 内のチェックされたラジオボタンを取得
    const selectedRadio = document.querySelector('.reservation-slot-list input[type="radio"]:checked');
    
    if (selectedRadio) {
        // ラジオボタンの次の兄弟要素を取得
        const nextSibling = selectedRadio.nextElementSibling.nextElementSibling.nextElementSibling;
        
        // 次の兄弟要素が span 要素で、クラス 'reserve_start_time' を持っているか確認
        if (nextSibling && nextSibling.classList.contains('reserve_end_time')) {
            // span 要素のテキスト内容を返す
            return nextSibling.textContent;
        }
    }

    // 選択されたラジオボタンがない場合や、期待する span 要素が見つからない場合は null を返す
    return null;
}