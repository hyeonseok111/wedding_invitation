import React, { useMemo, useRef, useState } from "react";

/** ───────── 설정(필요시 여기만 수정) ───────── */
const HERO_IMG = "/Bloom_25_06_13_073904.JPG";   // 루트(/public) 기준
const BGM_SRC  = "/bgm/romantic-melody.mp3";
const HIGHLIGHT = "#d98282";

const WEDDING_ISO = "2025-12-07T15:30:00+09:00";
const VENUE_NAME  = "아펠가모 공덕 라로브홀";
const VENUE_ADDR  = "서울 마포구 마포대로 92 효성해링턴스퀘어 B동 7층";
const VENUE_TEL   = "02-2197-0230";

// 지도 자세히 보기(네이버 링크)
const NAVER_VIEW_URL = "https://naver.me/x8DEFv5E";
// 페이지 내 미리보기(퍼가기 URL 권장, 임시 entry URL)
const NAVER_EMBED_SRC =
  "https://map.naver.com/p/entry/place/1929913788?c=15.00,0,0,0,dh";

const GROOM_LINE = "이영철 · 이경희 의 아들 현석";
const BRIDE_LINE = "유기만 · 정원경 의 딸 지현";
const GROOM_TEL  = "010-4100-5960";
const BRIDE_TEL  = "010-3350-7890";

// 계좌 정보(신랑·신부 각 3개)
const GROOM_ACCOUNTS = [
  { bank: "국민", number: "1002-763-669917", holder: "신랑" },
  { bank: "국민", number: "110-123-456789", holder: "신랑아버님" },
  { bank: "국민", number: "220-987-654321", holder: "신랑어머님" },
];
const BRIDE_ACCOUNTS = [
  { bank: "국민", number: "333-111-222333", holder: "신부" },
  { bank: "국민", number: "444-555-666777", holder: "신부아버님" },
  { bank: "국민", number: "888-999-000111", holder: "신부어머님" },
];

const PHOTO_COUNT = 18; // /public/images/album/01,02,03... (확장자 자동)
/** ─────────────────────────────────────────── */

export default function WeddingInvite() {
  /* BGM: 기본 정지 */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const toggleBgm = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try { await a.play(); setIsPlaying(true); } catch {}
    } else { a.pause(); setIsPlaying(false); }
  };

  /* D-day */
  const dDay = useMemo(() => {
    const event = new Date(WEDDING_ISO);
    const today = new Date();
    const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    return Math.ceil((startOf(event) - startOf(today)) / 86400000);
  }, []);

  /* 2025-12 달력 */
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dec2025Cells = useMemo(() => {
    const first = new Date("2025-12-01T00:00:00+09:00");
    const firstDay = first.getDay();
    const total = 31;
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    return cells;
  }, []);

  /* 앨범 파일 번호 */
  const albumNumbers = Array.from({ length: PHOTO_COUNT }, (_, i) => i + 1);

  /* 복사 */
  const copy = async (txt: string) => {
    try { await navigator.clipboard.writeText(txt); alert(`복사되었습니다: ${txt}`); } catch {}
  };

  return (
    <main className="min-h-screen bg-[#FFF8F3] text-gray-900 font-sans relative">
      {/* 좌측 상단 BGM 아이콘 */}
      <button
        onClick={toggleBgm}
        aria-label={isPlaying ? "배경음악 일시정지" : "배경음악 재생"}
        title={isPlaying ? "배경음악 일시정지" : "배경음악 재생"}
        className="fixed left-3 top-3 z-20 w-11 h-11 rounded-full bg-white/95 backdrop-blur shadow flex items-center justify-center"
      >
        <NoteIcon muted={!isPlaying} width={22} height={22} />
      </button>
      <audio ref={audioRef} src={BGM_SRC} preload="none" loop className="hidden" />

      {/* 타이틀 */}
      <section className="max-w-md mx-auto px-5 pt-8 pb-3 text-center">
        <h2
          className="tracking-[0.35em] text-[12px] text-gray-800"
          style={{ fontFamily: `'Noto Serif KR', ui-serif, serif` }}
        >
          WEDDING INVITATION
        </h2>
        <h1
          className="mt-2 text-2xl"
          style={{ fontFamily: `'Noto Serif KR', ui-serif, serif` }}
        >
          이현석 &nbsp;&amp;&nbsp; 유지현
        </h1>
      </section>

      {/* 메인 이미지 */}
      <section className="max-w-md mx-auto px-4">
        <div className="rounded-2xl overflow-hidden shadow bg-white">
          <img
            src={HERO_IMG}
            alt="메인 웨딩 사진"
            className="w-full h-[52svh] object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* 초대 문구 */}
      <section className="max-w-md mx-auto px-5 mt-6">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h3 className="text-[12px] tracking-[0.35em] text-gray-500">INVITATION</h3>
          <div className="mt-5 space-y-3 text-[15px] leading-8 text-gray-800">
            <p>사랑이 봄처럼 시작되어</p>
            <p>겨울의 약속으로 이어집니다.</p>
            <p>하루하루의 마음이 저희의 계절을 만들었으니</p>
            <p>함께 오셔서 따뜻히 축복해 주시면 감사하겠습니다.</p>
          </div>
          <div className="mt-6 text-sm text-gray-600">
            2025년 12월 7일 일요일 오후 3시 30분 · {VENUE_NAME}
          </div>
        </div>
      </section>

      {/* 혼주/본인 라인 — 아이콘은 라인 오른쪽에 */}
      <section className="max-w-md mx-auto px-5 mt-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <ContactRow label={GROOM_LINE} tel={GROOM_TEL} />
          <div className="my-3 h-px bg-gray-100" />
          <ContactRow label={BRIDE_LINE} tel={BRIDE_TEL} />
        </div>
      </section>

      {/* 달력 + D-day */}
      <section className="max-w-md mx-auto px-5 mt-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-center text-lg font-medium">12월</h3>
          <div className="grid grid-cols-7 gap-3 text-center text-sm font-semibold mt-3">
            {days.map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-3 text-center text-lg mt-2">
            {dec2025Cells.map((n, i) =>
              n === null ? <div key={i} /> : (
                <div
                  key={i}
                  className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full ${n===7?"text-white font-bold":"text-gray-800"}`}
                  style={n===7?{backgroundColor:HIGHLIGHT}:{}}>
                  {n}
                </div>
              )
            )}
          </div>
          <p className="mt-5 text-center text-base" style={{ color: HIGHLIGHT }}>
            이현석 ❤ 유지현 의 결혼식 {dDay}일 전
          </p>
        </div>
      </section>

      {/* 앨범 — 확장자 자동 시도 */}
      <section className="max-w-md mx-auto px-5 mt-6">
        <div className="bg-white rounded-2xl shadow p-5">
          <h3 className="text-center text-lg tracking-wide mb-4" style={{ color: HIGHLIGHT }}>ALBUM</h3>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: PHOTO_COUNT }, (_, i) => i + 1).map((num) => (
              <AlbumImage key={num} num={num}/>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            /public/images/album/ 에 01, 02 … 번호로 저장하면 확장자와 무관하게 자동 표시됩니다.
          </p>
        </div>
      </section>

      {/* 오시는 길 */}
      <section className="max-w-md mx-auto px-5 mt-6">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-4" style={{ color: HIGHLIGHT }}>오시는 길</h2>
          <p className="text-lg font-bold">{VENUE_NAME}</p>
          <p className="mt-1 text-gray-700">{VENUE_ADDR}</p>
          <p className="mt-0.5 text-gray-700">{VENUE_TEL}</p>

          <div className="mt-5 rounded-xl overflow-hidden shadow-sm">
            <iframe
              title="네이버 지도"
              src={NAVER_EMBED_SRC}
              width="100%"
              height="320"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
            />
          </div>

          <a
            href={NAVER_VIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-5 py-2 rounded-lg text-white"
            style={{ backgroundColor: HIGHLIGHT }}
          >
            지도를 자세히 보려면 여기를 눌러주세요
          </a>
        </div>
      </section>

      {/* 교통/주차/안내 */}
      <section className="max-w-md mx-auto px-5 mt-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <InfoBlock title="지하철">
            공덕역 ⑦번 출구 (5호선, 6호선) [도보 2분] <br />
            공덕역 ⑩번 출구 (경의중앙선, 공항철도) [도보 1분]
          </InfoBlock>
          <div className="my-4 h-px bg-gray-100" />
          <InfoBlock title="버스">
            파란 간선 : 160, 260, 600 <br />
            초록 지선 : 7013A, 7013B, 7611 <br />
            마을버스 : 마포01, 마포02, 마포10 <br />
            일반버스 : 1002
          </InfoBlock>
          <div className="my-4 h-px bg-gray-100" />
          <InfoBlock title="주차">
            효성해링턴스퀘어 본 건물 주차 (2시간 무료) <br />
            [외부 주차장 : SUN 장학빌딩, 하이파킹 공덕역점, 경보 주차장]
          </InfoBlock>
          <div className="my-4 h-px bg-gray-100" />
          <InfoBlock title="추가 안내">
            예식장 내 화환 반입이 불가하여 마음만 감사히 받겠습니다.
          </InfoBlock>
        </div>
      </section>

      {/* 마음 전하는 곳(아코디언) */}
      <section className="max-w-md mx-auto px-5 mt-6 pb-16">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-center text-xl font-semibold mb-4" style={{ color: HIGHLIGHT }}>
            마음을 전하는 곳
          </h2>
          <Accordion title="신랑측 계좌번호">
            <AccountList accounts={GROOM_ACCOUNTS} onCopy={copy} />
          </Accordion>
          <Accordion title="신부측 계좌번호">
            <AccountList accounts={BRIDE_ACCOUNTS} onCopy={copy} />
          </Accordion>
        </div>
      </section>
    </main>
  );
}

/* ───────── 하위 컴포넌트 ───────── */

/* 음표 아이콘(정지: 대각선 슬래시 겹침) */
function NoteIcon({ muted = false, ...props }: { muted?: boolean } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      {/* 음표 */}
      <path d="M12 3v10.5a3.5 3.5 0 1 1-2-3.2V6l8-2v7.5a3.5 3.5 0 1 1-2-3.2V4.2l-4 1" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      {/* 정지일 때만 슬래시 */}
      {muted && <path d="M4 20L20 4" strokeWidth="2" strokeLinecap="round" />}
    </svg>
  );
}

/* 심플한 아이콘(전화/문자) */
function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        d="M22 16.5v3a2 2 0 0 1-2.2 2A19.5 19.5 0 0 1 2.5 4.2 2 2 0 0 1 4.5 2h3a2 2 0 0 1 2 1.7c.12.8.32 1.6.58 2.4a2 2 0 0 1-.44 2.1L9 10a16 16 0 0 0 5 5l.7-1.1a2 2 0 0 1 2.1-.45c.8.26 1.6.46 2.4.58A2 2 0 0 1 22 16.5z" />
    </svg>
  );
}
function SmsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3" y="4" width="18" height="14" rx="3" strokeWidth="1.8"/>
      <path d="M7 9h10M7 13h6" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

/* 연락 라인: 오른쪽에 아이콘 두 개(전화/문자) */
function ContactRow({ label, tel }: { label: string; tel: string }) {
  const digits = tel.replace(/[^0-9]/g, "");
  return (
    <div className="flex items-center justify-between">
      <p className="text-[15px]">{label}</p>
      <div className="flex items-center gap-2">
        <a
          href={`tel:${digits}`}
          aria-label="전화 걸기"
          title="전화 걸기"
          className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-700"
        >
          <PhoneIcon width={18} height={18}/>
        </a>
        <a
          href={`sms:${digits}`}
          aria-label="문자 보내기"
          title="문자 보내기"
          className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-700"
          style={{ color: HIGHLIGHT }}
        >
          <SmsIcon width={18} height={18}/>
        </a>
      </div>
    </div>
  );
}

/* 정보 블록 */
function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-base font-semibold mb-1.5" style={{ color: HIGHLIGHT }}>{title}</h4>
      <p className="text-[15px] leading-7 text-gray-700">{children}</p>
    </div>
  );
}

/* 심플 아코디언 */
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-xl bg-white shadow-sm mb-3 overflow-hidden">
      <button onClick={() => setOpen(v=>!v)} className="w-full flex items-center justify-between px-4 py-3 text-left">
        <span className="text-[15px]">{title}</span>
        <span className="text-xl">{open ? "▾" : "▸"}</span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

/* 계좌 목록: 복사 시 '계좌번호 그대로' 복사 */
function AccountList({
  accounts, onCopy,
}: { accounts: { bank: string; number: string; holder: string }[]; onCopy: (txt: string)=>void; }) {
  return (
    <ul className="space-y-3">
      {accounts.map((a, i) => (
        <li key={i} className="flex items-center justify-between gap-3 border-b pb-3">
          <div className="text-sm">
            <div>{`${a.bank} ${a.number}`}</div>
            <div className="text-gray-500">{a.holder}</div>
          </div>
          <button
            onClick={() => onCopy(a.number)}   // 하이픈 포함 그대로 복사
            className="shrink-0 rounded-md px-3 py-1 text-sm border border-gray-300"
          >
            복사
          </button>
        </li>
      ))}
    </ul>
  );
}

/** 앨범 01,02,... 확장자 자동 시도(.jpg/.JPG/.png/.jpeg/.webp) */
function AlbumImage({ num }: { num: number }) {
  const [extIndex, setExtIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const padded = String(num).padStart(2, "0");
  const exts = ["jpg", "JPG", "png", "jpeg", "webp"];
  const src = `/images/album/${padded}.${exts[extIndex]}`;
  if (hidden) return null;

  return (
    <figure className="rounded-xl overflow-hidden bg-gray-100">
      <img
        src={src}
        alt={`album-${padded}`}
        loading="lazy"
        className="w-full h-full object-cover aspect-[4/3]"
        onError={() => {
          if (extIndex < exts.length - 1) setExtIndex(extIndex + 1);
          else setHidden(true);
        }}
      />
    </figure>
  );
}
