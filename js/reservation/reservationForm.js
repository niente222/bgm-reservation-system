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

            // ラジオボタンを作成
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'reservation-time';
            input.value = `${startHHmm} - ${endHHmm}`;

            label.appendChild(input);
            label.append(`${startHHmm} ～ ${endHHmm}`);
            reservationSlotList.appendChild(label);

            // 次の時間帯のために更新
            startTime = nextTime;
        }
    });
}

