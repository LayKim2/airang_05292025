export default function CookiesPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl sm:pt-[120px] pt-[160px]">
      <h1 className="text-3xl font-bold mb-8">쿠키 정책</h1>
      
      <div className="space-y-8 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. 쿠키의 사용 목적</h2>
          <p>회사는 다음과 같은 목적으로 쿠키를 사용합니다:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>회원의 로그인 상태 유지</li>
            <li>서비스 이용 환경 설정 저장</li>
            <li>매칭, 커뮤니티 등에서 최근 본 서비스/게시글 등 사용자 경험 개선</li>
            <li>서비스 개선 및 사용자 경험 향상</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 쿠키의 종류</h2>
          <p>회사는 다음과 같은 종류의 쿠키를 사용합니다:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>세션 쿠키: 브라우저를 닫으면 자동으로 삭제되는 임시 쿠키</li>
            <li>영구 쿠키: 브라우저를 닫아도 유지되는 쿠키</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 쿠키 설정 방법</h2>
          <p>회원은 웹 브라우저의 설정을 통해 쿠키를 차단하거나 삭제할 수 있습니다.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. 광고 및 트래킹 쿠키</h2>
          <p>AIrang은 광고 또는 트래킹 목적의 쿠키를 사용하지 않습니다.</p>
        </section>
      </div>
    </div>
  )
} 