/** tsb radio v2 · 즐겨찾기 동기화 (Apps Script 웹앱, hello@tsb.wine 계정으로 배포)
 *  배포: 새 Apps Script 프로젝트 → 이 코드 붙여넣기 → 배포 > 웹 앱 > 실행 주체 '나', 액세스 '모든 사용자' → URL을 index.html CONFIG.SYNC_URL에.
 *  저장: 스프레드시트 'tsb radio 즐겨찾기' (없으면 자동 생성) 시트 favs: email | track_id | updated
 *  보안: 클라이언트가 보낸 Google ID 토큰을 tokeninfo로 검증해 이메일을 얻는다. 토큰 없는 요청은 거부.
 */
const SHEET_NAME = 'tsb radio 즐겨찾기';
const ALLOWED_DOMAIN = 'tsb.wine';

function sheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('SHEET_ID');
  let ss = id ? SpreadsheetApp.openById(id) : null;
  if (!ss) { ss = SpreadsheetApp.create(SHEET_NAME); props.setProperty('SHEET_ID', ss.getId()); }
  let sh = ss.getSheetByName('favs');
  if (!sh) { sh = ss.insertSheet('favs'); sh.appendRow(['email', 'track_id', 'updated']); }
  return sh;
}
function verify_(token) {
  if (!token) return null;
  const r = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(token), { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) return null;
  const p = JSON.parse(r.getContentText());
  if (ALLOWED_DOMAIN && p.hd !== ALLOWED_DOMAIN) return null;
  return p.email;
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doGet(e) {
  const q = (e && e.parameter) || {};
  const sh = sheet_(); const rows = sh.getDataRange().getValues().slice(1);
  if (q.top) {                       // 직원 인기곡 집계 (익명, 로그인 불필요)
    const c = {}; rows.forEach(r => { c[r[1]] = (c[r[1]] || 0) + 1; });
    return out_({ top: Object.entries(c).sort((a, b) => b[1] - a[1]).map(([id, n]) => ({ id, n })) });
  }
  const email = verify_(q.token); if (!email) return out_({ error: 'unauthorized' });
  return out_({ email, favs: rows.filter(r => r[0] === email).map(r => r[1]) });
}
function doPost(e) {
  let body = {}; try { body = JSON.parse(e.postData.contents); } catch (err) { return out_({ error: 'bad json' }); }
  const email = verify_(body.token); if (!email) return out_({ error: 'unauthorized' });
  const favs = Array.isArray(body.favs) ? body.favs.filter(x => typeof x === 'string').slice(0, 500) : [];
  const sh = sheet_(); const data = sh.getDataRange().getValues();
  for (let i = data.length - 1; i >= 1; i--) if (data[i][0] === email) sh.deleteRow(i + 1);
  const now = new Date();
  if (favs.length) sh.getRange(sh.getLastRow() + 1, 1, favs.length, 3).setValues(favs.map(id => [email, id, now]));
  return out_({ ok: true, n: favs.length });
}
