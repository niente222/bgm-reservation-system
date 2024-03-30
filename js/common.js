
//引数の文字列が日付として有効か確認
// 引数 str yyyyMMdd
// return true 有効
// return false 無効
export function isValidDateFormat(str) {
    // 形式が yyyyMMdd の正規表現パターン
    const regexPattern = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;
  
    // フォーマットのチェック
    if (!regexPattern.test(str)) {
      return false;
    }
  
    // 文字列から年月日を抽出
    const year = parseInt(str.substring(0, 4), 10);
    const month = parseInt(str.substring(4, 6), 10) - 1; // JavaScriptの月は0から始まるため
    const day = parseInt(str.substring(6, 8), 10);
  
    // 日付オブジェクトを生成
    const date = new Date(year, month, day);
  
    // 抽出した年月日と日付オブジェクトが一致するか確認
    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
  }

//引数の文字列が日付として有効か確認 有効なら曜日IDを返却
// 引数 str yyyyMMdd
// return 0=日 1=月 ... 6=土
// return null 無効な日付
export function getDayOfWeekOfDate(str) {
    // 形式が yyyyMMdd の正規表現パターン
    const regexPattern = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;
  
    // フォーマットのチェック
    if (!regexPattern.test(str)) {
      return null;
    }
  
    // 文字列から年月日を抽出
    const year = parseInt(str.substring(0, 4), 10);
    const month = parseInt(str.substring(4, 6), 10) - 1; // JavaScriptの月は0から始まるため
    const day = parseInt(str.substring(6, 8), 10);
  
    // 日付オブジェクトを生成
    const date = new Date(year, month, day);
  
    // 抽出した年月日と日付オブジェクトが一致するか確認
    if(date.getFullYear() === year && date.getMonth() === month && date.getDate() === day){
        return date.getDay();
    }else{
        return null;
    };
  }


//
export function convertDateToYYYYMMDD(date) {
  return date.replace(/-/g, "");
}

//DBに保存されるDATE型をyyyy-MM-ddに変換
export function convertDBDateToYYYYMMDD(db_date) {
  // Dateオブジェクトを生成
  const dateObj = new Date(db_date);

  // Dateオブジェクトを yyyy-MM-dd 形式に変換
  const formattedDate = dateObj.toISOString().split('T')[0];

  return formattedDate;
}