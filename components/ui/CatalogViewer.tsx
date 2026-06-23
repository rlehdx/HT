'use client'

import { useState, useCallback } from 'react'

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
  const [isOpen, setIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right')

  const goToPage = useCallback(
    (direction: 'prev' | 'next') => {
      if (isFlipping) return
      if (direction === 'next' && currentPage >= totalPages) return
      if (direction === 'prev' && currentPage <= 1) return

      setFlipDirection(direction === 'next' ? 'right' : 'left')
      setIsFlipping(true)

      setTimeout(() => {
        setCurrentPage((p) => (direction === 'next' ? p + 1 : p - 1))
        setIsFlipping(false)
      }, 400)
    },
    [isFlipping, currentPage, totalPages]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToPage('next')
      if (e.key === 'ArrowLeft') goToPage('prev')
      if (e.key === 'Escape') setIsOpen(false)
    },
    [goToPage]
  )

  return (
    <>
      {/* 히어로 섹션 내 카탈로그 카드 */}
      <div className="catalog-card-wrapper">
        <button
          onClick={() => setIsOpen(true)}
          className="catalog-trigger-btn group"
          aria-label="카탈로그 열기"
        >
          {/* 책자 모양 미리보기 */}
          <div className="book-preview">
            <div className="book-spine" />
            <div className="book-cover group-hover:book-cover-hover">
              <div className="book-cover-inner">
                <div className="book-logo-area">
                  <span className="book-brand">HAITAI</span>
                  <span className="book-year">2026</span>
                </div>
                <div className="book-subtitle">Product Catalog</div>
                <div className="book-stripes">
                  <div className="stripe stripe-1" />
                  <div className="stripe stripe-2" />
                  <div className="stripe stripe-3" />
                </div>
              </div>
            </div>
            {/* 페이지 두께 효과 */}
            <div className="book-pages" />
          </div>

          <div className="catalog-card-label">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.75 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            View Catalog
          </div>
        </button>
      </div>

      {/* 모달 오버레이 */}
      {isOpen && (
        <div
          className="catalog-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="카탈로그 뷰어"
        >
          <div className="catalog-modal-container">
            {/* 헤더 */}
            <div className="catalog-modal-header">
              <span className="catalog-modal-title">{title}</span>
              <div className="catalog-modal-controls">
                <a
                  href={pdfUrl}
                  download="haitai-catalog-2026.pdf"
                  className="catalog-download-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
                <button
                  className="catalog-close-btn"
                  onClick={() => setIsOpen(false)}
                  aria-label="닫기"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 책 뷰어 */}
            <div className="catalog-book-area">
              {/* 이전 버튼 */}
              <button
                className={`catalog-nav-btn catalog-nav-prev ${currentPage <= 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                onClick={() => goToPage('prev')}
                disabled={currentPage <= 1 || isFlipping}
                aria-label="이전 페이지"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* 책 본체 */}
              <div className="catalog-book-frame">
                <div
                  className={`catalog-page-flipper ${isFlipping ? (flipDirection === 'right' ? 'flip-right' : 'flip-left') : ''}`}
                >
                  <iframe
                    key={currentPage}
                    src={`${pdfUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                    className="catalog-iframe"
                    title={`카탈로그 ${currentPage}페이지`}
                  />
                </div>

                {/* 책 바인딩 효과 */}
                <div className="catalog-book-binding" />
              </div>

              {/* 다음 버튼 */}
              <button
                className={`catalog-nav-btn catalog-nav-next ${currentPage >= totalPages ? 'opacity-30 cursor-not-allowed' : ''}`}
                onClick={() => goToPage('next')}
                disabled={currentPage >= totalPages || isFlipping}
                aria-label="다음 페이지"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* 페이지 인디케이터 */}
            <div className="catalog-page-indicator">
              <span className="catalog-page-text">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>
              <div className="catalog-page-dots">
                {Array.from({ length: Math.min(totalPages, 8) }).map((_, i) => {
                  const pageNum = Math.round((i / 7) * (totalPages - 1)) + 1
                  return (
                    <button
                      key={i}
                      className={`catalog-dot ${currentPage === pageNum ? 'catalog-dot-active' : ''}`}
                      onClick={() => {
                        setFlipDirection(pageNum > currentPage ? 'right' : 'left')
                        setIsFlipping(true)
                        setTimeout(() => { setCurrentPage(pageNum); setIsFlipping(false) }, 400)
                      }}
                      aria-label={`${pageNum}페이지로 이동`}
                    />
                  )
                })}
              </div>
              <span className="catalog-keyboard-hint">← → 키로 이동</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* ── 트리거 카드 ── */
        .catalog-card-wrapper {
          margin-top: 2rem;
        }

        .catalog-trigger-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: transform 0.2s ease;
        }

        .catalog-trigger-btn:hover {
          transform: translateY(-4px);
        }

        /* ── 책 미리보기 ── */
        .book-preview {
          position: relative;
          width: 90px;
          height: 115px;
          filter: drop-shadow(0 12px 28px rgba(0,0,0,0.22));
          transition: filter 0.3s ease;
        }

        .catalog-trigger-btn:hover .book-preview {
          filter: drop-shadow(0 18px 36px rgba(232,0,26,0.30));
        }

        .book-spine {
          position: absolute;
          left: 0;
          top: 4px;
          bottom: 4px;
          width: 10px;
          background: linear-gradient(180deg, #8b0010 0%, #c0001a 50%, #8b0010 100%);
          border-radius: 2px 0 0 2px;
        }

        .book-cover {
          position: absolute;
          left: 10px;
          top: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #E8001A 0%, #b0001a 100%);
          border-radius: 0 4px 4px 0;
          overflow: hidden;
          transition: transform 0.3s ease;
          transform-origin: left center;
        }

        .catalog-trigger-btn:hover .book-cover {
          transform: perspective(400px) rotateY(-15deg);
        }

        .book-cover-inner {
          padding: 10px 8px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .book-logo-area {
          display: flex;
          flex-direction: column;
        }

        .book-brand {
          font-size: 11px;
          font-weight: 900;
          color: white;
          letter-spacing: 0.15em;
          line-height: 1;
        }

        .book-year {
          font-size: 9px;
          font-weight: 700;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.1em;
          margin-top: 2px;
        }

        .book-subtitle {
          font-size: 7px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .book-stripes {
          position: absolute;
          bottom: 0;
          right: 0;
          left: 0;
          height: 28px;
          overflow: hidden;
        }

        .stripe {
          position: absolute;
          height: 6px;
          left: -10px;
          right: -10px;
          border-radius: 2px;
          transform: rotate(-25deg);
        }

        .stripe-1 { background: rgba(255,255,255,0.15); bottom: 18px; }
        .stripe-2 { background: rgba(255,255,255,0.10); bottom: 10px; }
        .stripe-3 { background: rgba(255,255,255,0.06); bottom: 2px; }

        .book-pages {
          position: absolute;
          right: 0;
          top: 6px;
          bottom: 6px;
          width: 6px;
          background: repeating-linear-gradient(
            to bottom,
            #f5f5f5 0px,
            #f5f5f5 1px,
            #e8e8e8 1px,
            #e8e8e8 2px
          );
          border-radius: 0 2px 2px 0;
        }

        .catalog-card-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #E8001A;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* ── 모달 오버레이 ── */
        .catalog-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: overlayIn 0.25s ease;
        }

        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .catalog-modal-container {
          width: 100%;
          max-width: 900px;
          background: #1a1a1a;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
          animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          flex-direction: column;
        }

        @keyframes modalIn {
          from { transform: scale(0.92) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }

        /* ── 헤더 ── */
        .catalog-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #111;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .catalog-modal-title {
          font-size: 14px;
          font-weight: 700;
          color: white;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .catalog-modal-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .catalog-download-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: #E8001A;
          color: white;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.15s ease, transform 0.15s ease;
          letter-spacing: 0.03em;
        }

        .catalog-download-btn:hover {
          background: #c0001a;
          transform: translateY(-1px);
        }

        .catalog-close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: none;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .catalog-close-btn:hover {
          background: rgba(232,0,26,0.2);
          color: #E8001A;
        }

        /* ── 책 뷰어 영역 ── */
        .catalog-book-area {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 24px 16px;
          background: #1a1a1a;
          min-height: 520px;
        }

        .catalog-nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.08);
          color: white;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
          flex-shrink: 0;
        }

        .catalog-nav-btn:not(:disabled):hover {
          background: #E8001A;
          transform: scale(1.1);
        }

        /* ── 책 프레임 ── */
        .catalog-book-frame {
          position: relative;
          flex: 1;
          max-width: 720px;
          height: 480px;
          border-radius: 4px;
          overflow: hidden;
          box-shadow:
            -6px 0 16px rgba(0,0,0,0.4),
            0 8px 32px rgba(0,0,0,0.5),
            inset -2px 0 6px rgba(0,0,0,0.3);
        }

        .catalog-book-binding {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 12px;
          background: linear-gradient(to right, #111 0%, #222 40%, #1a1a1a 100%);
          z-index: 10;
          box-shadow: 2px 0 8px rgba(0,0,0,0.4);
        }

        /* ── 페이지 플리핑 애니메이션 ── */
        .catalog-page-flipper {
          width: 100%;
          height: 100%;
          transform-origin: left center;
          perspective: 1200px;
        }

        .catalog-page-flipper.flip-right {
          animation: flipRight 0.4s ease-in-out;
        }

        .catalog-page-flipper.flip-left {
          animation: flipLeft 0.4s ease-in-out;
        }

        @keyframes flipRight {
          0%   { transform: perspective(1200px) rotateY(0deg); opacity: 1; }
          50%  { transform: perspective(1200px) rotateY(-25deg); opacity: 0.6; }
          100% { transform: perspective(1200px) rotateY(0deg); opacity: 1; }
        }

        @keyframes flipLeft {
          0%   { transform: perspective(1200px) rotateY(0deg); opacity: 1; }
          50%  { transform: perspective(1200px) rotateY(25deg); opacity: 0.6; }
          100% { transform: perspective(1200px) rotateY(0deg); opacity: 1; }
        }

        .catalog-iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
          background: white;
        }

        /* ── 페이지 인디케이터 ── */
        .catalog-page-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 12px 20px;
          background: #111;
          border-top: 1px solid rgba(255,255,255,0.08);
          flex-wrap: wrap;
        }

        .catalog-page-text {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }

        .catalog-page-text strong {
          color: white;
        }

        .catalog-page-dots {
          display: flex;
          gap: 6px;
        }

        .catalog-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.2);
          cursor: pointer;
          padding: 0;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .catalog-dot:hover {
          background: rgba(232,0,26,0.6);
          transform: scale(1.2);
        }

        .catalog-dot-active {
          background: #E8001A !important;
          transform: scale(1.2);
        }

        .catalog-keyboard-hint {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          font-style: italic;
        }

        @media (max-width: 640px) {
          .catalog-book-area {
            padding: 16px 8px;
            min-height: 360px;
          }

          .catalog-book-frame {
            height: 340px;
          }

          .catalog-keyboard-hint {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
