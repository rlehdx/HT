'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

interface CatalogViewerProps {
  pdfUrl: string
  totalPages: number
  title?: string
}

export function CatalogViewer({
  pdfUrl,
  totalPages,
  title = 'Haitai Catalog 2026',
}: CatalogViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right')
  const [inputPage, setInputPage] = useState('1')
  const sectionRef = useRef<HTMLDivElement>(null)

  const goToPage = useCallback(
    (direction: 'prev' | 'next') => {
      if (isFlipping) return
      if (direction === 'next' && currentPage >= totalPages) return
      if (direction === 'prev' && currentPage <= 1) return

      const nextDir = direction === 'next' ? 'right' : 'left'
      setFlipDirection(nextDir)
      setIsFlipping(true)

      setTimeout(() => {
        setCurrentPage((p) => {
          const next = direction === 'next' ? p + 1 : p - 1
          setInputPage(String(next))
          return next
        })
        setIsFlipping(false)
      }, 380)
    },
    [isFlipping, currentPage, totalPages]
  )

  const jumpToPage = useCallback(
    (page: number) => {
      if (isFlipping || page === currentPage) return
      const clamped = Math.max(1, Math.min(totalPages, page))
      setFlipDirection(clamped > currentPage ? 'right' : 'left')
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(clamped)
        setInputPage(String(clamped))
        setIsFlipping(false)
      }, 380)
    },
    [isFlipping, currentPage, totalPages]
  )

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return
      if (e.key === 'ArrowRight') goToPage('next')
      if (e.key === 'ArrowLeft') goToPage('prev')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goToPage])

  const progress = ((currentPage - 1) / (totalPages - 1)) * 100

  return (
    <section ref={sectionRef} className="catalog-section">
      {/* 섹션 헤더 */}
      <div className="catalog-header">
        <div className="catalog-header-left">
          <div className="catalog-tag">2026 Product Catalog</div>
          <h2 className="catalog-title">{title}</h2>
        </div>
        <a
          href={pdfUrl}
          download="haitai-catalog-2026.pdf"
          className="catalog-download-btn"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </a>
      </div>

      {/* 메인 뷰어 */}
      <div className="catalog-viewer-wrap">
        {/* 왼쪽 네비 */}
        <button
          className="catalog-nav catalog-nav-prev"
          onClick={() => goToPage('prev')}
          disabled={currentPage <= 1 || isFlipping}
          aria-label="이전 페이지"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 책 프레임 */}
        <div className="catalog-book">
          {/* 책등 */}
          <div className="catalog-spine" />

          {/* 페이지 */}
          <div
            className={`catalog-flipper ${
              isFlipping
                ? flipDirection === 'right'
                  ? 'flip-right'
                  : 'flip-left'
                : ''
            }`}
          >
            <iframe
              key={currentPage}
              src={`${pdfUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              className="catalog-iframe"
              title={`카탈로그 ${currentPage}페이지`}
            />
          </div>

          {/* 페이지 두께 효과 (우측) */}
          <div className="catalog-page-edge" />
        </div>

        {/* 오른쪽 네비 */}
        <button
          className="catalog-nav catalog-nav-next"
          onClick={() => goToPage('next')}
          disabled={currentPage >= totalPages || isFlipping}
          aria-label="다음 페이지"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 하단 컨트롤 바 */}
      <div className="catalog-controls">
        {/* 진행 바 */}
        <div className="catalog-progress-wrap">
          <div
            className="catalog-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 페이지 입력 + 인디케이터 */}
        <div className="catalog-controls-row">
          <button
            className="catalog-ctrl-btn"
            onClick={() => goToPage('prev')}
            disabled={currentPage <= 1 || isFlipping}
          >
            ‹ Prev
          </button>

          <div className="catalog-page-input-wrap">
            <input
              type="number"
              className="catalog-page-input"
              value={inputPage}
              min={1}
              max={totalPages}
              onChange={(e) => setInputPage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') jumpToPage(Number(inputPage))
              }}
              onBlur={() => jumpToPage(Number(inputPage))}
            />
            <span className="catalog-page-of">/ {totalPages}</span>
          </div>

          <button
            className="catalog-ctrl-btn"
            onClick={() => goToPage('next')}
            disabled={currentPage >= totalPages || isFlipping}
          >
            Next ›
          </button>
        </div>

        {/* 빠른 점프 점 */}
        <div className="catalog-dots">
          {Array.from({ length: 10 }).map((_, i) => {
            const page = Math.round((i / 9) * (totalPages - 1)) + 1
            const isActive = Math.abs(currentPage - page) < totalPages / 10 / 2
            return (
              <button
                key={i}
                className={`catalog-dot ${isActive ? 'catalog-dot-active' : ''}`}
                onClick={() => jumpToPage(page)}
                title={`Page ${page}`}
              />
            )
          })}
        </div>

        <p className="catalog-hint">← → 키보드로 페이지 이동</p>
      </div>

      <style jsx>{`
        /* ── 섹션 전체 ── */
        .catalog-section {
          width: 100%;
          background: #0f0f0f;
          padding: 48px 0 40px;
        }

        /* ── 헤더 ── */
        .catalog-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 0 40px 28px;
          max-width: 1400px;
          margin: 0 auto;
          gap: 16px;
          flex-wrap: wrap;
        }

        .catalog-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #E8001A;
          margin-bottom: 6px;
        }

        .catalog-title {
          font-size: clamp(1.4rem, 2.5vw, 2rem);
          font-weight: 800;
          color: white;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .catalog-download-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #E8001A;
          color: white;
          font-size: 13px;
          font-weight: 700;
          border-radius: 10px;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: background 0.15s, transform 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .catalog-download-btn:hover {
          background: #c0001a;
          transform: translateY(-2px);
        }

        /* ── 뷰어 래퍼 ── */
        .catalog-viewer-wrap {
          display: flex;
          align-items: center;
          gap: 0;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 8px;
        }

        /* ── 네비 버튼 ── */
        .catalog-nav {
          flex-shrink: 0;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.07);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, transform 0.15s;
          z-index: 2;
        }

        .catalog-nav svg {
          width: 22px;
          height: 22px;
        }

        .catalog-nav:not(:disabled):hover {
          background: #E8001A;
          transform: scale(1.08);
        }

        .catalog-nav:disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }

        /* ── 책 본체 ── */
        .catalog-book {
          position: relative;
          flex: 1;
          height: 85vh;
          min-height: 500px;
          max-height: 940px;
          display: flex;
          overflow: hidden;
          border-radius: 2px 6px 6px 2px;
          box-shadow:
            -8px 0 32px rgba(0, 0, 0, 0.6),
            0 16px 64px rgba(0, 0, 0, 0.5),
            4px 0 12px rgba(0, 0, 0, 0.3);
        }

        /* 책등 */
        .catalog-spine {
          flex-shrink: 0;
          width: 18px;
          background: linear-gradient(to right,
            #1a0005 0%,
            #5c000c 35%,
            #8b0012 60%,
            #6b000e 80%,
            #2a0006 100%
          );
          box-shadow: inset -2px 0 6px rgba(0,0,0,0.5), 2px 0 8px rgba(0,0,0,0.4);
          z-index: 3;
        }

        /* 페이지 두께(우측 엣지) */
        .catalog-page-edge {
          position: absolute;
          right: 0;
          top: 3px;
          bottom: 3px;
          width: 8px;
          background: repeating-linear-gradient(
            to bottom,
            #f0f0f0 0px,
            #f0f0f0 1px,
            #ddd 1px,
            #ddd 2px
          );
          border-radius: 0 2px 2px 0;
          z-index: 2;
        }

        /* ── 플리퍼 ── */
        .catalog-flipper {
          flex: 1;
          height: 100%;
          transform-origin: left center;
          will-change: transform, opacity;
        }

        .catalog-flipper.flip-right {
          animation: flipRight 0.38s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .catalog-flipper.flip-left {
          animation: flipLeft 0.38s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes flipRight {
          0%   { transform: perspective(1600px) rotateY(0deg) scaleX(1); opacity: 1; }
          45%  { transform: perspective(1600px) rotateY(-22deg) scaleX(0.97); opacity: 0.55; }
          100% { transform: perspective(1600px) rotateY(0deg) scaleX(1); opacity: 1; }
        }

        @keyframes flipLeft {
          0%   { transform: perspective(1600px) rotateY(0deg) scaleX(1); opacity: 1; }
          45%  { transform: perspective(1600px) rotateY(22deg) scaleX(0.97); opacity: 0.55; }
          100% { transform: perspective(1600px) rotateY(0deg) scaleX(1); opacity: 1; }
        }

        .catalog-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
          background: white;
        }

        /* ── 하단 컨트롤 ── */
        .catalog-controls {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px 40px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .catalog-progress-wrap {
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .catalog-progress-bar {
          height: 100%;
          background: #E8001A;
          border-radius: 2px;
          transition: width 0.4s ease;
        }

        .catalog-controls-row {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .catalog-ctrl-btn {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          font-weight: 600;
          padding: 7px 18px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          letter-spacing: 0.02em;
        }

        .catalog-ctrl-btn:not(:disabled):hover {
          background: #E8001A;
          color: white;
          border-color: #E8001A;
        }

        .catalog-ctrl-btn:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }

        .catalog-page-input-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .catalog-page-input {
          width: 58px;
          text-align: center;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          color: white;
          font-size: 14px;
          font-weight: 700;
          padding: 6px 8px;
          outline: none;
          transition: border-color 0.15s;
          -moz-appearance: textfield;
        }

        .catalog-page-input::-webkit-inner-spin-button,
        .catalog-page-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }

        .catalog-page-input:focus {
          border-color: #E8001A;
        }

        .catalog-page-of {
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          font-weight: 500;
        }

        .catalog-dots {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .catalog-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.18);
          cursor: pointer;
          padding: 0;
          transition: background 0.15s, transform 0.15s;
        }

        .catalog-dot:hover {
          background: rgba(232,0,26,0.7);
          transform: scale(1.3);
        }

        .catalog-dot-active {
          background: #E8001A;
          transform: scale(1.3);
        }

        .catalog-hint {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          margin: 0;
          font-style: italic;
        }

        /* ── 모바일 ── */
        @media (max-width: 768px) {
          .catalog-header {
            padding: 0 20px 20px;
          }

          .catalog-book {
            height: 60vh;
            min-height: 380px;
          }

          .catalog-nav {
            width: 40px;
            height: 40px;
          }

          .catalog-controls {
            padding: 16px 20px 0;
          }

          .catalog-hint {
            display: none;
          }
        }
      `}</style>
    </section>
  )
}
