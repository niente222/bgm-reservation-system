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