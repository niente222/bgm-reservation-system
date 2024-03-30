
window.onload = function() {
    if (window.registeredEvent) {
        // 登録データを表示
        //document.getElementById('event-info').textContent = window.registeredEvent.event_title;
        // その他のデータも同様に表示...
        console.log("セッションを受け取って完了画面を表示")
    }else {
        console.log("セッションを受け取って完了画面を表示出来ていない")
    }
}

