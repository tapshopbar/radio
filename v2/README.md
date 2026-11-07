# tsb radio v2 · 선곡 플레이어 (시험판)

`/radio/v2/` 아래에만 있고, 매장에서 돌고 있는 `/radio/index.html`(v1)과 `tracks.json`, `music/`은 건드리지 않는다.

- 곡 목록·음원: `../tracks.json`, `../music/*` 그대로 읽음 (v1과 같은 라이브러리)
- 메타: `meta.json` (BPM·보컬·스타일). 새 곡을 v1에 넣을 때 여기에도 한 줄 추가하면 분류가 정확해진다. 없으면 플레이리스트로 추정하고 BPM 뒤에 `?` 표시.
- 채널: 시간대 자동 / 전체 랜덤 / 연주곡 / 보컬 / 빠른(≥100) / 미디엄 / 조용한(≤85) / wine o'clock / 모임 / 혼술 / 카페 / 내 즐겨찾기
- 선곡: 목록에서 ▶ 즉시 재생, ＋ 대기열, 검색·정렬, "이 목록 셔플 재생"
- 즐겨찾기 ★: 로그인 사용자별 localStorage 저장. `CONFIG.SYNC_URL`(sync.gs 웹앱)을 넣으면 시트로 동기화 + `?top=1`로 직원 인기곡 집계.
- 로그인: Google Identity Services. `CONFIG.GOOGLE_CLIENT_ID`에 OAuth 클라이언트 ID(승인된 JavaScript 원본: https://tapshopbar.github.io, https://tsb.wine)를 넣으면 켜짐. 비어 있으면 게스트만.

## 현재 설정 (2026-11-07)
- OAuth 클라이언트: Google Cloud 프로젝트 tsb-people > "tsb radio v2 선곡 플레이어" (웹, 원본 tapshopbar.github.io · tsb.wine)
- 즐겨찾기 동기화: Apps Script "tsb radio v2 즐겨찾기 동기화 (TOM)" 웹앱 v1, 시트 'tsb radio 즐겨찾기' (hello@ Drive)

## 켜는 순서 (관리자)
1. Google Cloud 콘솔(hello@tsb.wine) → API 및 서비스 → 사용자 인증 정보 → OAuth 클라이언트 ID(웹) 생성, 원본에 `https://tapshopbar.github.io` 추가 → ID를 `CONFIG.GOOGLE_CLIENT_ID`에.
2. (선택) `sync.gs`를 Apps Script 웹앱으로 배포 → URL을 `CONFIG.SYNC_URL`에.
3. 매장 iPad/PC는 계속 `/radio/` (v1). v2는 직원 개인 기기·본사에서 먼저 써 보고, 문제 없으면 매장 전환을 따로 결정.
