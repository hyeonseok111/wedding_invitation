import React, { useState } from "react";

// 메인 컴포넌트
export default function WeddingInvite() {
  // 결혼식 날짜
  const weddingDate = new Date("2025-12-07T15:30:00");
  const today = new Date();
  const diffDays = Math.ceil(
    (weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 앨범 사진 개수
  const PHOTO_COUNT = 18;

  // 신랑/신부 계좌번호 토글
  const [showGroomAccount, setShowGroomAccount] = useState(false);
  const [showBrideAccount, setShowBrideAccount] = useState(false);

  // 강조 색상
  const highlightColor = "#d98282";

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto font-sans">
      {/* 1. 상단 인트로 (버튼 + 타이틀 → 이미지) */}
      <section className="relative w-full text-center py-16 bg-white">
        {/* 배경음 버튼 (동작 예시) */}
        <button
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
          onClick={() => alert("배경음악 재생 기능 연결 예정")}
          aria-label="배경음악 재생/정지"
          title="배경음악 재생/정지"
        >
          ♪
        </button>

        {/* 세리프 느낌 타이틀 */}
        <h2
          className="text-2xl tracking-[0.35em] mb-2 text-gray-800"
          style={{ fontFamily: `'Noto Serif KR', ui-serif, serif` }}
        >
          WEDDING INVITATION
        </h2>
        <p
          className="text-xl text-gray-700"
          style={{ fontFamily: `'Noto Serif KR', ui-serif, serif` }}
        >
          이현석 &nbsp;&amp;&nbsp; 유지현
        </p>

        {/* 메인 이미지 (타이틀 아래) */}
        <img
          src="/images/Bloom_25_06_13_073904.jpg"
          alt="main"
          className="mt-6 w-full h-[52svh] object-cover rounded-lg shadow"
        />
      </section>

      {/* 2. 초대 글귀 */}
      <section className="text-center py-12 px-6 leading-relaxed">
        <p>사랑이 봄처럼 시작되어</p>
        <p>겨울의 약속으로 이어집니다.</p>
        <p>하루하루의 마음이 저희의 계절을 만들었으니</p>
        <p>함께 오셔서 따뜻히 축복해 주시면 감사하겠습니다.</p>
        <div className="mt-6 text-sm text-gray-600">
          2025년 12월 7일 일요일 오후 3시 30분 · 아펠가모 공덕 라로브홀
        </div>
      </section>

      {/* 3. 혼주 안내 (아이콘 버튼 버전) */}
      <section className="text-center py-10 px-6 w-full max-w-md">
        <ContactRow
          label="이영철 · 이경희 의 아들 현석"
          tel="010-4100-5960"
          highlightColor={highlightColor}
        />
        <div className="h-3" />
        <ContactRow
          label="유기만 · 정원경 의 딸 지현"
          tel="010-3350-7890"
          highlightColor={highlightColor}
        />
      </section>

      {/* 4. 일정 안내 (12월 달력 + D-day) */}
      <section className="py-12 px-4 text-center">
        <h2 className="text-xl font-semibold mb-4">12월</h2>
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div key={day} className="font-bold">
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
            <div
              key={date}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                date === 7 ? "text-white font-bold" : "text-gray-800"
              }`}
              style={date === 7 ? { backgroundColor: highlightColor } : {}}
            >
              {date}
            </div>
          ))}
        </div>
        <p className="mt-6 text-base" style={{ color: highlightColor }}>
          이현석 ❤ 유지현 의 결혼식 {diffDays}일 전
        </p>
      </section>

      {/* 5. 앨범 */}
      <section className="py-12 text-center w-full">
        <h2
          className="text-2xl font-semibold mb-6"
          style={{ color: highlightColor }}
        >
          ALBUM
        </h2>
        <div className="grid grid-cols-3 gap-3 w-full px-4">
          {Array.from({ length: PHOTO_COUNT }, (_, i) => i + 1).map((num) => (
            <img
              key={num}
              src={`/images/album/${String(num).padStart(2, "0")}.jpg`}
              alt={`album-${num}`}
              className="w-full h-auto object-cover rounded-lg shadow"
              loading="lazy"
              onError={(e) =>
                ((e.target as HTMLImageElement).style.display = "none")
              }
            />
          ))}
        </div>
      </section>

      {/* 6. 오시는 길 (지도 임베드 + 외부 링크 버튼) */}
      <section className="py-12 text-center px-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">오시는 길</h2>
        <p className="mb-2 font-bold">아펠가모 공덕 라로브홀</p>
        <p className="text-sm text-gray-600">
          서울 마포구 마포대로 92 효성해링턴스퀘어 B동 7층
        </p>
        <p className="text-sm text-gray-600 mb-4">☎ 02-2197-0230</p>

        {/* 네이버 지도 iframe — 퍼가기 URL로 교체 권장 */}
        <div className="w-full h-64 mb-4 rounded-xl overflow-hidden shadow">
          <iframe
            title="네이버 지도"
            src="https://map.naver.com/p/entry/place/1929913788?c=15.00,0,0,0,dh"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          />
        </div>

        {/* 자세히 보기 버튼 → naver.me 링크 */}
        <a
          href="https://naver.me/F2niWCWY"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 rounded-lg text-white shadow"
          style={{ backgroundColor: highlightColor }}
        >
          지도를 자세히 보려면 여기를 눌러주세요
        </a>
      </section>

      {/* 7. 교통편 안내 */}
      <section className="py-12 px-6 text-left w-full max-w-2xl">
        <h3 className="text-lg font-bold mb-2" style={{ color: highlightColor }}>
          지하철
        </h3>
        <p>공덕역 ⑦번 출구 (5호선, 6호선) [도보 2분]</p>
        <p className="mb-4">공덕역 ⑩번 출구 (경의중앙선, 공항철도) [도보 1분]</p>

        <h3 className="text-lg font-bold mb-2" style={{ color: highlightColor }}>
          버스
        </h3>
        <p>파란 간선 : 160, 260, 600</p>
        <p>초록 지선 : 7013A, 7013B, 7611</p>
        <p>마을버스 : 마포01, 마포02, 마포10</p>
        <p className="mb-4">일반버스 : 1002</p>

        <h3 className="text-lg font-bold mb-2" style={{ color: highlightColor }}>
          주차
        </h3>
        <p>효성해링턴스퀘어 본 건물 주차 (2시간 무료)</p>
        <p>[외부 주차장 : SUN 장학빌딩, 하이파킹 공덕역점, 경보 주차장]</p>

        <h3 className="text-lg font-bold mb-2 mt-4" style={{ color: highlightColor }}>
          추가 안내
        </h3>
        <p>예식장 내 화환 반입이 불가하여 마음만 감사히 받겠습니다.</p>
      </section>

      {/* 8. 마음 전하는 곳 (아코디언) */}
      <section className="py-12 px-6 text-center w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6">마음을 전하는 곳</h2>

        <Accordion
          title="신랑측 계좌번호"
          open={showGroomAccount}
          onToggle={() => setShowGroomAccount(!showGroomAccount)}
        >
          <AccountItem bank="국민" number="000000-00-000000" holder="신랑성함" />
          <AccountItem bank="국민" number="000000-00-000000" holder="신랑아버님" />
          <AccountItem bank="국민" number="000000-00-000000" holder="신랑어머님" />
        </Accordion>

        <Accordion
          title="신부측 계좌번호"
          open={showBrideAccount}
          onToggle={() => setShowBrideAccount(!showBrideAccount)}
        >
          <AccountItem bank="국민" number="000000-00-000000" holder="신부성함" />
          <AccountItem bank="국민" number="000000-00-000000" holder="신부아버님" />
          <AccountItem bank="국민" number="000000-00-000000" holder="신부어머님" />
        </Accordion>
      </section>
    </div>
  );
}

/* ================== 하위 컴포넌트 ================== */

// 전화/문자 아이콘 (SVG)
function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 16.92v3a2 2 0 0 1-2.18 2A19.88 19.88 0 0 1 3.1 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12.86.32 1.7.6 2.5a2 2 0 0 1-.45 2.11L9 10a16 16 0 0 0 5 5l.67-1.15a2 2 0 0 1 2.11-.45c.8.28 1.64.48 2.5.6A2 2 0 0 1 22 16.92z"
      />
    </svg>
  );
}

function SmsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z"
      />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6" />
    </svg>
  );
}

// 연락 행: 아이콘 버튼만 표시
function ContactRow({
  label,
  tel,
  highlightColor,
}: {
  label: string;
  tel: string;
  highlightColor: string;
}) {
  const digits = tel.replace(/[^0-9]/g, "");

  return (
    <div className="flex items-center justify-between border-b pb-3">
      <p className="text-[15px] text-left">{label}</p>
      <div className="flex items-center gap-3">
        <a
          href={`tel:${digits}`}
          aria-label="전화 걸기"
          title="전화 걸기"
          className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 shadow flex items-center justify-center"
          style={{ color: "#333" }}
        >
          <PhoneIcon width={18} height={18} />
        </a>
        <a
          href={`sms:${digits}`}
          aria-label="문자 보내기"
          title="문자 보내기"
          className="w-10 h-10 rounded-full"
          style={{
            backgroundColor: highlightColor,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          }}
        >
          <SmsIcon width={18} height={18} />
        </a>
      </div>
    </div>
  );
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-xl bg-white shadow-sm mb-3 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-[15px]">{title}</span>
        <span className="text-xl">{open ? "▾" : "▸"}</span>
      </button>
      {open && <div className="px-4 pb-3 text-left">{children}</div>}
    </div>
  );
}

function AccountItem({
  bank,
  number,
  holder,
}: {
  bank: string;
  number: string;
  holder: string;
}) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${bank} ${number}`);
      alert("복사되었습니다.");
    } catch {}
  };

  return (
    <div className="flex items-center justify-between gap-3 border-b py-3">
      <div className="text-sm">
        <div>{`${bank} ${number}`}</div>
        <div className="text-gray-500">{holder}</div>
      </div>
      <button
        onClick={copy}
        className="shrink-0 rounded-md px-3 py-1 text-sm border border-gray-300"
      >
        복사
      </button>
    </div>
  );
}
