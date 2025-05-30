export default function TermsPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl sm:pt-[120px] pt-[160px]">
      <h1 className="text-3xl font-bold mb-8">이용약관</h1>
      
      <div className="space-y-8 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">제1조 (목적)</h2>
          <p>본 약관은 AIrang(이하 "회사")이 제공하는 서비스의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">제2조 (정의)</h2>
          <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>"서비스"란 회사가 제공하는 모든 서비스를 의미합니다.</li>
            <li>"회원"이란 회사와 구글 계정으로 로그인하여 서비스 이용계약을 체결한 자를 말합니다.</li>
            <li>"콘텐츠"란 회원이 서비스 내에서 생성한 모든 형태의 데이터를 의미합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">제3조 (서비스 이용)</h2>
          <p>서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간을 원칙으로 합니다.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">제4조 (회원의 의무 및 콘텐츠 관리)</h2>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>회원은 타인의 권리를 침해하지 않는 범위 내에서 자유롭게 서비스(콘텐츠)를 등록, 공유할 수 있습니다.</li>
            <li>회원이 등록한 서비스, 게시글, 댓글 등 모든 콘텐츠의 저작권 및 법적 책임은 해당 회원에게 있습니다.</li>
            <li>타인의 저작권, 초상권 등 권리를 침해하는 행위는 금지되며, 분쟁 발생 시 회사는 책임을 지지 않습니다.</li>
            <li>매칭 기능(팀원 모집, 전문가 매칭 등)에서 발생하는 의사소통, 협업, 계약 등은 당사자 간의 책임입니다.</li>
            <li>커뮤니티 활동 시 욕설, 비방, 불법 정보 게시 등은 금지되며, 위반 시 서비스 이용이 제한될 수 있습니다.</li>
          </ul>
        </section>
      </div>
    </div>
  )
} 