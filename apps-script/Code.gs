/**
 * 강의 문의 접수 스크립트 (Google Apps Script)
 *
 * 하는 일
 *  1) POST로 받은 문의를 시트에 한 줄 추가
 *  2) 관리자(OWNER_EMAIL)에게 "새 문의 도착" 알림 메일 발송
 *  3) 신청자 이메일로 "문의가 접수되었습니다" 자동회신 발송
 *
 * 시트 헤더(1행): 이름 | 이메일 | 전화번호 | 회사,직함 | 강의 문의 내용
 *
 * 받는 필드 이름
 *   name, email, phone, company, message   (honeypot: website - 비워 두어야 함)
 *
 * 설치 방법은 이 파일 맨 아래 주석 참고.
 */

// ───────── 설정 ─────────
var OWNER_EMAIL = 'antprincess79@gmail.com'; // 알림을 받을 내 이메일
var SENDER_NAME = '서예진 AI 교육 강사';       // 자동회신 보낸 사람 이름
var SHEET_NAME = '문의';                      // 데이터가 쌓일 시트(탭) 이름
var HEADERS = ['이름', '이메일', '전화번호', '회사,직함', '강의 문의 내용'];
var MAX_LEN = { name: 50, email: 100, phone: 30, company: 100, message: 3000 };

// ───────── 웹앱 진입점 ─────────
function doPost(e) {
  try {
    var data = parseBody_(e);

    // 스팸 봇이 숨김 칸을 채웠으면 성공처럼 응답하고 버린다
    if (data.website) return json_({ ok: true });

    var err = validate_(data);
    if (err) return json_({ ok: false, error: err });

    appendRow_(data);

    // 메일 실패가 접수 자체를 막지 않도록 각각 따로 처리
    try { sendOwnerNotice_(data); } catch (e1) { console.error('관리자 알림 실패: ' + e1); }
    try { sendAutoReply_(data); } catch (e2) { console.error('자동회신 실패: ' + e2); }

    return json_({ ok: true });
  } catch (ex) {
    console.error(ex);
    return json_({ ok: false, error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' });
  }
}

// 브라우저로 주소를 열었을 때 동작 확인용
function doGet() {
  return json_({ ok: true, message: '문의 접수 서비스가 동작 중입니다. POST로 문의를 보내 주세요.' });
}

// ───────── 입력 처리 ─────────
function parseBody_(e) {
  var raw = {};
  var body = e && e.postData && e.postData.contents;
  if (body) {
    try { raw = JSON.parse(body); } catch (err) { raw = e.parameter || {}; }
  } else if (e && e.parameter) {
    raw = e.parameter;
  }
  var out = {};
  ['name', 'email', 'phone', 'company', 'message', 'website'].forEach(function (k) {
    var v = raw[k] == null ? '' : String(raw[k]).trim();
    out[k] = MAX_LEN[k] ? v.slice(0, MAX_LEN[k]) : v;
  });
  return out;
}

function validate_(d) {
  if (!d.name) return '이름을 입력해 주세요.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return '올바른 이메일 주소를 입력해 주세요.';
  if (!d.message) return '강의 문의 내용을 입력해 주세요.';
  return '';
}

// ───────── 시트 ─────────
function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function appendRow_(d) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000); // 동시에 여러 건이 들어와도 줄이 섞이지 않게
  try {
    var sheet = getSheet_();
    sheet.getRange('C:C').setNumberFormat('@'); // 전화번호 앞자리 0이 사라지지 않게 텍스트로
    sheet.appendRow([
      safeCell_(d.name),
      safeCell_(d.email),
      safeCell_(d.phone),
      safeCell_(d.company),
      safeCell_(d.message),
    ]);
  } finally {
    lock.releaseLock();
  }
}

// 시트 수식 주입 방지: =, +, -, @ 로 시작하면 앞에 ' 를 붙여 일반 글자로 저장
function safeCell_(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

// ───────── 메일 ─────────
function sendOwnerNotice_(d) {
  var subject = '[새 문의 도착] ' + d.name + (d.company ? ' (' + d.company + ')' : '');
  var text =
    '새 강의 문의가 접수되었습니다.\n\n' +
    '이름: ' + d.name + '\n' +
    '이메일: ' + d.email + '\n' +
    '전화번호: ' + (d.phone || '-') + '\n' +
    '회사,직함: ' + (d.company || '-') + '\n\n' +
    '강의 문의 내용:\n' + d.message + '\n\n' +
    '※ 이 메일에 답장하면 신청자(' + d.email + ')에게 바로 전달됩니다.';
  var html =
    '<div style="font-family:sans-serif;line-height:1.7;color:#1d2433">' +
    '<h2 style="color:#0f1f3d">새 강의 문의가 도착했습니다</h2>' +
    '<table style="border-collapse:collapse">' +
    row_('이름', d.name) + row_('이메일', d.email) + row_('전화번호', d.phone || '-') + row_('회사,직함', d.company || '-') +
    '</table>' +
    '<h3 style="color:#0f1f3d;margin-bottom:4px">강의 문의 내용</h3>' +
    '<p style="white-space:pre-wrap;background:#f5f3ee;padding:14px;border-radius:8px">' + esc_(d.message) + '</p>' +
    '<p style="color:#5d6678;font-size:13px">이 메일에 답장하면 신청자에게 바로 전달됩니다.</p>' +
    '</div>';
  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: subject,
    body: text,
    htmlBody: html,
    replyTo: d.email,
    name: SENDER_NAME,
  });
}

function sendAutoReply_(d) {
  var subject = '[' + SENDER_NAME + '] 문의가 접수되었습니다';
  var text =
    d.name + ' 님, 안녕하세요.\n\n' +
    '강의 문의가 정상적으로 접수되었습니다. 내용을 확인한 뒤 빠르게 회신드리겠습니다.\n\n' +
    '[접수 내용]\n' + d.message + '\n\n' +
    '급하신 경우 010-3029-8222 로 연락해 주세요.\n\n' +
    '감사합니다.\n' + SENDER_NAME;
  var html =
    '<div style="font-family:sans-serif;line-height:1.7;color:#1d2433">' +
    '<h2 style="color:#0f1f3d">문의가 접수되었습니다</h2>' +
    '<p>' + esc_(d.name) + ' 님, 안녕하세요.<br>강의 문의가 정상적으로 접수되었습니다. 내용을 확인한 뒤 빠르게 회신드리겠습니다.</p>' +
    '<h3 style="color:#0f1f3d;margin-bottom:4px">접수 내용</h3>' +
    '<p style="white-space:pre-wrap;background:#f5f3ee;padding:14px;border-radius:8px">' + esc_(d.message) + '</p>' +
    '<p>급하신 경우 <a href="tel:010-3029-8222">010-3029-8222</a> 로 연락해 주세요.</p>' +
    '<p>감사합니다.<br><b>' + esc_(SENDER_NAME) + '</b></p>' +
    '</div>';
  MailApp.sendEmail({
    to: d.email,
    subject: subject,
    body: text,
    htmlBody: html,
    replyTo: OWNER_EMAIL,
    name: SENDER_NAME,
  });
}

// ───────── 도우미 ─────────
function row_(label, value) {
  return '<tr><td style="padding:4px 14px 4px 0;color:#5d6678">' + label + '</td><td><b>' + esc_(value) + '</b></td></tr>';
}

function esc_(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ───────── 테스트용 (편집기에서 ▶ 실행) ─────────
// 아래 이메일을 본인이 받을 수 있는 주소로 바꾼 뒤 testSubmit 을 실행하면
// 시트 추가 + 알림 + 자동회신이 한 번에 확인됩니다. 첫 실행 때 권한 승인 창이 뜹니다.
function testSubmit() {
  var res = doPost({
    postData: {
      contents: JSON.stringify({
        name: '테스트',
        email: OWNER_EMAIL,
        phone: '010-0000-0000',
        company: '테스트회사 / 교육팀장',
        message: '테스트 문의입니다. 챗GPT 업무효율화 교육을 문의드립니다.',
      }),
    },
  });
  console.log(res.getContent());
}

/*
 ───────── 설치 방법 ─────────
 1. 구글 시트를 새로 만들고, 상단 메뉴 [확장 프로그램] → [Apps Script] 를 엽니다.
 2. 기본 코드를 모두 지우고 이 파일 내용을 붙여넣은 뒤 저장(💾)합니다.
 3. 함수 선택 칸에서 testSubmit 을 고르고 ▶ 실행합니다.
    - 권한 승인 창이 뜨면 본인 계정으로 허용합니다. (시트, 메일 발송 권한)
    - "문의" 시트가 자동으로 만들어지고 헤더와 테스트 한 줄이 들어가며,
      antprincess79@gmail.com 으로 알림과 자동회신이 도착해야 합니다.
 4. 테스트 줄은 시트에서 직접 지웁니다.
 5. [배포] → [새 배포] → 유형 "웹 앱" 선택
      - 다음 사용자로 실행: 나
      - 액세스 권한이 있는 사용자: 모든 사용자
    배포 후 나오는 웹 앱 URL(https://script.google.com/macros/s/.../exec)을 복사합니다.
 6. 코드를 고쳤다면 [배포] → [배포 관리] → 연필 아이콘 → 버전 "새 버전" 으로 다시 배포해야 반영됩니다.

 ───────── 웹사이트에서 보내는 예 ─────────
 fetch(WEB_APP_URL, {
   method: 'POST',
   headers: { 'Content-Type': 'text/plain;charset=utf-8' },   // 사전 요청(CORS) 방지용
   body: JSON.stringify({ name, email, phone, company, message, website: '' })
 }).then(r => r.json()).then(r => { if (r.ok) { 성공 } else { alert(r.error) } });

 ───────── 참고 ─────────
 - MailApp 하루 발송 한도: 일반 Gmail 계정 약 100통, Workspace 약 1,500통.
   문의 1건당 2통(알림 + 자동회신)씩 나갑니다.
 - 웹 앱 URL을 아는 사람은 누구나 POST할 수 있습니다. 이 스크립트에는 숨김 칸(website),
   입력 길이 제한, 수식 주입 방지가 들어 있지만, 스팸이 늘면 비밀 토큰 확인을 추가하세요.
*/
