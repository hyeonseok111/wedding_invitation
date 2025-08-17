import React, { useState, useRef } from "react";

// ====== 계좌 정보 ======
const GROOM_ACCOUNTS = [
  { bank: "우리은행", number: "1002-743-669917", holder: "이현석" },
  { bank: "농협은행", number: "000-000-000000", holder: "이영철" },
  { bank: "농협은행", number: "000-000-000000", holder: "이경희" },
];

const BRIDE_ACCOUNTS = [
  { bank: "신한은행", number: "000-000-000000", holder: "유지현" },
  { bank: "국민은행", number: "000-000-000000", holder: "유기만" },
  { bank: "하나은행", number: "000-000-000000", holder: "정원경" },
];

// ====== 복사 기능 (계좌번호 그대로) ======
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
        <li
          key={i}
          className="flex items-center justify-between gap-3 border-b pb-3"
        >
          <div className="text-sm">
            <div>{`${a.bank} ${a.number}`}</div>
            <div className="text-gray-500">{a.holder}</div>
          </div>
          <button
            onClick={() => onCopy(a.number)} // ← 계좌번호 그대로 복사
            className="shrink-0 rounded-md px-3 py-1 text-sm border border-gray-300"
          >
            복사
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function WeddingInvite() {
  // 결혼식 날짜
  const weddingDate = new Date("2025-12-07T15:30:00");
  const today = new Date();
  const diffTime = weddingDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 강조 색상
  const highlightColor = "#d98282";

  // 앨범 사진 개수 (확장자는 png/jpg/JPG 다 허용)
  const PHOTO_COUNT = 18;

  // BGM
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 계좌 복사 알림
  const handleCopy = async (txt: string) => {
    await navigator.clipboard.writeText(txt);
    alert(`계좌번호가 복사되었습니다: ${txt}`);
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      {/* ====== 헤더 & BGM ====== */}
      <div className="text-center mb-6">
        <button
          onClick={toggleAudio}
          className="mb-4 p-3 rounded-full shadow border bg-white"
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>
        <audio ref={audioRef} src="/bgm.mp3" loop />
        <h2
          className="text-2xl font-serif tracking-wide mb-2"
          style={{ color: highlightColor }}
        >
          WEDDING INVITATION
        </h2>
        <h3 className="text-xl font-semibold">이현석 & 유지현</h3>
      </div>

      {/* 메인 사진 */}
      <img
        src="/Bloom_25_06_13_073904.JPG"
        alt="main"
        className="w-full max-w-md rounded-lg shadow mb-10"
      />

      {/* 인사말 */}
      <p className="text-center leading-relaxed text-gray-700 mb-12">
        사랑이 봄처럼 시작되어 <br />
        겨울의 약속으로 이어집니다. <br />
        하루하루의 마음이 저희의 계절을 만들었으니 <br />
        함께 오셔서 따뜻히 축복해 주시면 감사하겠습니다.
      </p>

      {/* 신랑 신부 소개 */}
      <div className="text-center mb-12">
        <p className="mb-2">이영철 · 이경희 의 아들 현석</p>
        <p>유기만 · 정원경 의 딸 지현</p>
        <div className="flex justify-center gap-6 mt-4">
          {/* 전화 아이콘 */}
          <a href="tel:01041005960" className="text-2xl">
            📞
          </a>
          <a href="sms:01041005960" className="text-2xl">
            💬
          </a>
          <a href="tel:01033507890" className="text-2xl">
            📞
          </a>
          <a href="sms:01033507890" className="text-2xl">
            💬
          </a>
        </div>
      </div>

      {/* 날짜 & 장소 */}
      <p className="text-lg font-semibold mb-2">
        2025년 12월 7일 일요일 오후 3시 30분
      </p>
      <p className="mb-10">아펠가모 공덕 라로브홀</p>

      {/* 달력 */}
      <h2 className="text-xl font-semibold mb-4">12월</h2>
      <div className="grid grid-cols-7 gap-2 text-center text-sm mb-6">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day} className="font-bold">
            {day}
          </div>
        ))}
        {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
          <div
            key={date}
            className={`w-8 h-8 flex items-center justify-center rounded-full 
              ${date === 7 ? "text-white font-bold" : "text-gray-800"}`}
            style={date === 7 ? { backgroundColor: highlightColor } : {}}
          >
            {date}
          </div>
        ))}
      </div>
      <p className="mb-12 text-lg" style={{ color: highlightColor }}>
        이현석 ❤ 유지현 의 결혼식 {diffDays}일 전
      </p>

      {/* 앨범 */}
      <h2
        className="text-2xl font-semibold mt-16 mb-6"
        style={{ color: highlightColor }}
      >
        ALBUM
      </h2>
      <div className="grid grid-cols-3 gap-3 w-full max-w-3xl mb-16">
        {Array.from({ length: PHOTO_COUNT }, (_, i) => i + 1).map((num) => (
          <img
            key={num}
            src={`/images/album/${String(num).padStart(2, "0")}`}
            alt={`album-${num}`}
            className="w-full h-auto object-cover rounded-lg shadow"
            loading="lazy"
            onError={(e) =>
              ((e.target as HTMLImageElement).style.display = "none")
            }
          />
        ))}
      </div>

      {/* 오시는 길 */}
      <h2 className="text-2xl font-semibold mb-6">오시는 길</h2>
      <p className="mb-2 font-medium">아펠가모 공덕 라로브홀</p>
      <p className="mb-2">02-2197-0230</p>
      <p className="mb-4">
        서울 마포구 마포대로 92 효성해링턴스퀘어 B동 7층
      </p>
      <iframe
        title="naver-map"
        src="https://map.naver.com/p/entry/place/1929913788?c=15.00,0,0,0,dh&placePath=/home"
        width="100%"
        height="300"
        className="rounded-lg mb-4"
        style={{ border: 0 }}
      ></iframe>
      <a
        href="https://naver.me/x8DEFv5E"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg mb-12"
      >
        지도를 자세히 보려면 여기를 눌러주세요
      </a>

      {/* 교통편 */}
      <div className="text-left w-full max-w-md mb-12">
        <h3 className="text-lg font-semibold mb-2" style={{ color: highlightColor }}>
          지하철
        </h3>
        <p>
          공덕역 ⑦번 출구 (5호선, 6호선) [도보 2분]
          <br />
          공덕역 ⑩번 출구 (경의중앙선, 공항철도) [도보 1분]
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2" style={{ color: highlightColor }}>
          버스
        </h3>
        <p>
          파란 간선 : 160, 260, 600 <br />
          초록 지선 : 7013A, 7013B, 7611 <br />
          마을버스 : 마포01, 마포02, 마포10 <br />
          일반버스 : 1002
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2" style={{ color: highlightColor }}>
          주차
        </h3>
        <p>
          효성해링턴스퀘어 본 건물 주차 (2시간 무료)
          <br />
          [외부 주차장 : SUN 장학빌딩, 하이파킹 공덕역점, 경보 주차장]
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-2" style={{ color: highlightColor }}>
          추가 안내
        </h3>
        <p>예식장 내 화환 반입이 불가하여 마음만 감사히 받겠습니다.</p>
      </div>

      {/* 마음 전하는 곳 */}
      <h2
        className="text-2xl font-semibold mb-6"
        style={{ color: highlightColor }}
      >
        마음을 전하는 곳
      </h2>

      <div className="w-full max-w-md space-y-8">
        <div>
          <button
            className="w-full bg-gray-100 rounded-md py-2 font-medium mb-3"
            onClick={() =>
              (document.getElementById("groom-accounts")!.style.display =
                "block")
            }
          >
            신랑측 계좌번호
          </button>
          <div id="groom-accounts" style={{ display: "none" }}>
            <AccountList accounts={GROOM_ACCOUNTS} onCopy={handleCopy} />
          </div>
        </div>

        <div>
          <button
            className="w-full bg-gray-100 rounded-md py-2 font-medium mb-3"
            onClick={() =>
              (document.getElementById("bride-accounts")!.style.display =
                "block")
            }
          >
            신부측 계좌번호
          </button>
          <div id="bride-accounts" style={{ display: "none" }}>
            <AccountList accounts={BRIDE_ACCOUNTS} onCopy={handleCopy} />
          </div>
        </div>
      </div>
    </div>
  );
}
