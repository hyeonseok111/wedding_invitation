import React, { useMemo, useRef, useState } from "react";

/** ───────────────── 설정 (여기만 바꾸면 전체 반영) ───────────────── */
const HERO_IMG = "/images/main-photo.jpg"; // ← 상단 메인 이미지
const BGM_SRC = "/bgm/romantic-melody.mp3";
const HIGHLIGHT = "#d98282"; // 포인트 컬러(하트/달력/섹션 타이틀)

const WEDDING_ISO = "2025-12-07T15:30:00+09:00";
const VENUE_NAME = "아펠가모 공덕 라로브홀";
const VENUE_ADDR = "서울 마포구 마포대로 92 효성해링턴스퀘어 B동 7층";
const VENUE_TEL = "02-2197-0230";
const NAVER_MAP_URL =
  "https://map.naver.com/p/entry/place/1929913788?c=15.00,0,0,0,dh&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202508172041&locale=ko&svcName=map_pcv5";

const GROOM_LINE = "이영철 · 이경희 의 아들 현석";
const BRIDE_LINE = "유기만 · 정원경 의 딸 지현";
const GROOM_TEL = "010-4100-5960";
const BRIDE_TEL = "010-3350-7890";

// 앨범(01.jpg ~ N.jpg) → /public/images/album/ 에 넣으면 자동 표시
const PHOTO_COUNT = 18;

// 마음 전하는 곳(원하면 자유 수정)
const GROOM_ACCOUNTS = [
  { bank: "우리은행", number: "000000-00-000000", holder: "이현석" },
  { bank: "농협", number: "000000-00-000000", holder: "이영철" },
  { bank: "농협", number: "000000-00-000000", holder: "이경희" },
];
const BRIDE_ACCOUNTS = [
  { bank: "신한은행", number: "000000-00-000000", holder: "유지현" },
  { bank: "국민은행", number: "000000-00-000000", holder: "유기만" },
  { bank: "하나은행", number: "000000-00-000000", holder: "정원경" },
];
/** ─────────────────────────────────────────────────────────── */

export default function WeddingInvite() {
  /** BGM 토글 */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const toggleBgm = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
        setIsPlaying(true);
      } catch {}
    } else {
      a.pause();
      setIsPlaying(false);
    }
  };

  /** D-day */
  const dDay = useMemo(() => {
    const event = new Date(WEDDING_ISO);
    const today = new Date();
    const startOf = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    return Math.ceil((startOf(event) - startOf(today)) / 86400000);
  }, []);

  /** 2025년 12월 달력 셀 */
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

  /** 앨범 이미지 */
  const albumImages = Array.from(
    { length: PHOTO_COUNT },
    (_, i) => `/images/album/${String(i + 1).padStart(2, "0")}.jpg`
  );
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  /** 마음 전하는 곳(아코디언) */
  const [openGroom, setOpenGroom] = useState(false);
  const [openBride, setOpenBride] = useState(false);
  const copy = async (txt: string) => {
    try {
      await navigator.clipboard.writeText(txt);
      alert("복사되었습니다.");
    } catch {}
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans">

      {/* 0) 최상단: 재생 버튼 + 타이틀(예쁜 세리프) */}
      <section className="relative max-w-md mx-auto px-6 pt-6 pb-2 text-center">
        {/* 배경음 버튼 */}
        <button
          onClick={toggleBgm}
          aria-label="배경 음악 토글"
          className="absolute left-4 top-4 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>

        {/* 타이포 (세리프 느낌) */}
        <h2
          className="tracking-[0.35em] text-[12px] mb-3"
          style={{ color: "#111", fontFamily: `'Noto Serif KR', ui-serif, serif` }}
        >
          WEDDING INVITATION
        </h2>
        <h1
          className="text-2xl"
          style={{ fontFamily: `'Noto Serif KR', ui-serif, serif` }}
        >
          이현석 & 유지현
        </h1>
      </section>

      {/* 1) 메인 이미지 (타이틀 아래 배치) */}
      <section className="w-full">
        <img
          src={HERO_IMG}
          alt="메인 웨딩 사진"
          className="w-full h-[52svh] object-cover"
        />
      </section>

      {/* 2) 초대 문구 */}
      <section className="max-w-md mx-auto px-6 py-10 text-center">
        <div className="h-2" />
        <h3 className="text-[12px] tracking-[0.35em] text-gray-500">
          INVITATION
        </h3>
        <div className="mt-6 space-y-3 text-[15px] leading-8 text-gray-800">
          <p>사랑이 봄처럼 시작되어</p>
          <p>겨울의 약속으로 이어집니다.</p>
          <p>하루하루의 마음이 저희의 계절을 만들었으니</p>
          <p>함께 오셔서 따뜻히 축복해 주시면 감사하겠습니다.</p>
        </div>
        <div className="mt-6 text-sm text-gray-600">
          2025년 12월 7일 일요일 오후 3시 30분 · {VENUE_NAME}
        </div>
      </section>

      {/* 3) 혼주 연락 */}
      <section className="max-w-md mx-auto px-6 py-6">
        <ContactRow label={GROOM_LINE} tel={GROOM_TEL} />
        <ContactRow label={BRIDE_LINE} tel={BRIDE_TEL} />
      </section>

      {/* 4) 달력 + D-day */}
      <section className="max-w-md mx-auto px-6 py-10">
        <h3 className="text-center text-xl font-medium mb-4">12월</h3>

        <div className="grid grid-cols-7 gap-3 text-center text-sm font-semibold">
          {days.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3 text-center text-lg mt-2">
          {dec2025Cells.map((n, i) =>
            n === null ? (
              <div key={i} />
            ) : (
              <div
                key={i}
                className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full ${
                  n === 7 ? "text-white font-bold" : "text-gray-800"
                }`}
                style={n === 7 ? { backgroundColor: HIGHLIGHT } : {}}
              >
                {n}
              </div>
            )
          )}
        </div>

        <p className="mt-6 text-center text-lg" style={{ color: HIGHLIGHT }}>
          이현석 ❤ 유지현 의 결혼식 {dDay}일 전
        </p>
      </section>

      {/* 5) 앨범 */}
      <section className="w-full max-w-md mx-auto px-4 pb-10">
        <h3
          className="text-center text-lg tracking-wide mb-4"
          style={{ color: HIGHLIGHT }}
        >
          ALBUM
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {albumImages.map((src) => (
            <figure
              key={src}
              className={`rounded-xl overflow-hidden bg-gray-100 ${
                hidden[src] ? "hidden" : ""
              }`}
            >
              <img
                src={src}
                alt="wedding album"
                loading="lazy"
                className="w-full h-full object-cover aspect-[4/3]"
                onError={() => setHidden((h) => ({ ...h, [src]: true }))}
              />
            </figure>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center mt-3">
          /public/images/album/ 에 01.jpg, 02.jpg … 형식으로 사진을 추가하면
          자동으로 표시됩니다.
        </p>
      </section>

      {/* 6) 오시는 길(장소/지도 링크) */}
      <section className="max-w-md mx-auto px-6 py-10 text-center">
        <h2 className="text-2xl font-semibold mb-6" style={{ color: HIGHLIGHT }}>
          오시는 길
        </h2>
        <p className="text-xl font-bold">{VENUE_NAME}</p>
        <p className="mt-2">{VENUE_ADDR}</p>
        <p className="mt-1">{VENUE_TEL}</p>

        <a
          href={NAVER_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-6 py-2 rounded-lg text-white"
          style={{ backgroundColor: HIGHLIGHT }}
        >
          네이버 지도 열기
        </a>

        <p className="mt-4">
          <a
            href={NAVER_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 underline"
          >
            지도를 자세히 보려면 여기를 눌러주세요
          </a>
        </p>
      </section>

      {/* 7) 오시는 길 상세안내 */}
      <section className="w-full max-w-2xl mx-auto px-6 pb-10">
        <h3 className="text-lg font-semibold mt-2 mb-2" style={{ color: HIGHLIGHT }}>
          지하철
        </h3>
        <p className="text-gray-700 leading-relaxed">
          공덕역 ⑦번 출구 (5호선, 6호선) [도보 2분] <br />
          공덕역 ⑩번 출구 (경의중앙선, 공항철도) [도보 1분]
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2" style={{ color: HIGHLIGHT }}>
          버스
        </h3>
        <p className="text-gray-700 leading-relaxed">
          파란 간선 : 160, 260, 600 <br />
          초록 지선 : 7013A, 7013B, 7611 <br />
          마을버스 : 마포01, 마포02, 마포10 <br />
          일반버스 : 1002
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2" style={{ color: HIGHLIGHT }}>
          주차
        </h3>
        <p className="text-gray-700 leading-relaxed">
          효성해링턴스퀘어 본 건물 주차 (2시간 무료) <br />
          [외부 주차장 : SUN 장학빌딩, 하이파킹 공덕역점, 경보 주차장]
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2" style={{ color: HIGHLIGHT }}>
          추가 안내
        </h3>
        <p className="text-gray-700 leading-relaxed">
          예식장 내 화환 반입이 불가하여 마음만 감사히 받겠습니다.
        </p>
      </section>

      {/* 8) 마음을 전하는 곳(아코디언) */}
      <section className="max-w-md mx-auto px-6 pb-16">
        <h2
          className="text-center text-xl font-semibold mb-4"
          style={{ color: HIGHLIGHT }}
        >
          마음을 전하는 곳
        </h2>

        <Accordion
          title="신랑측 계좌번호"
          defaultOpen={false}
          content={<AccountList accounts={GROOM_ACCOUNTS} onCopy={copy} />}
        />
        <Accordion
          title="신부측 계좌번호"
          defaultOpen={false}
          content={<AccountList accounts={BRIDE_ACCOUNTS} onCopy={copy} />}
        />
      </section>

      {/* 오디오(토글 제어) */}
      <audio ref={audioRef} src={BGM_SRC} preload="none" loop className="hidden" />
    </main>
  );
}

/** 연락(전화/문자) 한 줄 */
function ContactRow({ label, tel }: { label: string; tel: string }) {
  const telDigits = tel.replaceAll(/[^0-9]/g, "");
  return (
    <div className="flex items-center justify-between border-b py-3">
      <p className="text-[15px]">{label}</p>
      <div className="flex gap-3">
        <a
          href={`tel:${telDigits}`}
          className="rounded-md px-3 py-1 border border-gray-300 text-sm"
        >
          전화
        </a>
        <a
          href={`sms:${telDigits}`}
          className="rounded-md px-3 py-1 border border-gray-300 text-sm"
        >
          문자
        </a>
      </div>
    </div>
  );
}

/** 단순 아코디언 */
function Accordion({
  title,
  content,
  defaultOpen = false,
}: {
  title: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-xl bg-white shadow-sm mb-3 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-[15px]">{title}</span>
        <span className="text-xl">{open ? "▾" : "▸"}</span>
      </button>
      {open && <div className="px-4 pb-4">{content}</div>}
    </div>
  );
}

/** 계좌 목록(복사 버튼 포함) */
function AccountList({
  accounts,
  onCopy,
}: {
  accounts: { bank: string; number: string; holder: string }[];
  onCopy: (txt: string) => void;
}) {
  return (
    <ul className="space-y-3">
      {accounts.map((a, i) => (
        <li key={i} className="flex items-center justify-between gap-3 border-b pb-3">
          <div className="text-sm">
            <div>{`${a.bank} ${a.number}`}</div>
            <div className="text-gray-500">{a.holder}</div>
          </div>
          <button
            onClick={() => onCopy(`${a.bank} ${a.number}`)}
            className="shrink-0 rounded-md px-3 py-1 text-sm border border-gray-300"
          >
            복사
          </button>
        </li>
      ))}
    </ul>
  );
}
