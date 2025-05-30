export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl sm:pt-[120px] pt-[160px]">
      <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>
      
      <div className="space-y-8 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. 수집하는 개인정보 항목 및 수집방법</h2>
          <p>
            AIrang은 구글 로그인(OAuth) 연동을 통해 아래와 같은 개인정보를 수집합니다.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>필수항목: 이메일, 닉네임(구글 프로필 이름), 프로필 이미지</li>
            <li>선택항목: 소개글(회원이 직접 입력 시)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 개인정보의 수집 및 이용목적</h2>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>회원 식별 및 서비스 제공</li>
            <li>커뮤니티 운영 및 관리</li>
            <li>서비스 개선 및 신규 서비스 개발</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 개인정보의 보유 및 이용기간</h2>
          <p>
            회원 탈퇴 시 또는 서비스 종료 시 즉시 파기합니다. 단, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. 개인정보 제3자 제공</h2>
          <p>
            AIrang은 원칙적으로 회원의 개인정보를 외부에 제공하지 않습니다. 단, 법령에 의거하거나 회원의 동의가 있는 경우에만 예외적으로 제공할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 개인정보 보호책임자</h2>
          <p>
            개인정보 관련 문의는 contact@airang.com 으로 연락해주시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. 서비스 등록 및 커뮤니티 활동 시 공개 정보</h2>
          <p>
            회원이 서비스 등록, 커뮤니티 게시글 작성, 매칭 지원 등 플랫폼 내에서 직접 입력한 정보(서비스 설명, 이미지, 게시글, 댓글 등)는 개인정보가 아닌 공개 콘텐츠로 취급되며, 다른 회원 및 방문자에게 공개될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. 매칭 및 커뮤니티 기능 관련 정보</h2>
          <p>
            매칭 기능(팀원 모집, 전문가 매칭 등) 및 커뮤니티 활동을 위해 회원의 프로필, 지원 내역, 게시글, 댓글 등의 정보가 수집·이용될 수 있습니다. 해당 정보는 서비스 제공 및 커뮤니티 활성화 목적으로만 사용됩니다.
          </p>
        </section>
      </div>
    </div>
  )
} 