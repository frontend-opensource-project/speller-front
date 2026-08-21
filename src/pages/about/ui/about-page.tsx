import Link from 'next/link'

const ADOPTIONS = [
  {
    field: '공공기관',
    names: '교육행정정보시스템(NEIS), 금융감독원, 산업인력공단, 법원도서관 등',
  },
  { field: '언론사', names: '연합뉴스, 중앙일보, 동아일보, KBS, MBC, SBS 등' },
  { field: '기업', names: '한컴, 사람인, 펄어비스 등' },
]

const classes = {
  section: 'flex flex-col gap-3',
  heading:
    'text-lg font-semibold text-slate-600 dark:text-dark-text tab:text-xl pc:text-2xl',
}

export const AboutPage = () => {
  return (
    <article className='mx-auto w-full max-w-[48rem] px-4 py-10 text-base leading-[170%] tracking-[-0.02rem] text-slate-500 dark:text-dark-text tab:text-lg tab:tracking-[-0.0225rem] pc:py-16'>
      <div className='flex w-full flex-col gap-10 pc:gap-12'>
        <header className='flex flex-col gap-3'>
          <h1 className='text-2xl font-bold text-slate-600 dark:text-dark-text tab:text-3xl pc:text-4xl'>
            바른한글 소개
          </h1>
          <p className='font-semibold text-slate-600 dark:text-dark-text'>
            ‘바른한글’은 ‘한국어 맞춤법/문법 검사기’의 새 이름입니다.
          </p>
          <p>
            1994년부터 30년 넘게 무료로 제공되어 온 한국어 맞춤법/문법 검사기가
            ‘바른한글’이라는 이름으로 새롭게 문을 열었습니다.
          </p>
        </header>

        <section className={classes.section}>
          <h2 className={classes.heading}>30년을 이어 온 검사기</h2>
          <p>
            바른한글은 前 권혁철 부산대학교 정보컴퓨터공학부 교수가 1994년부터
            일반에 무료로 제공해 온 한국어 맞춤법/문법 검사기입니다. 오류를
            찾아내고 바른 표현으로 고쳐 주는 정확도가 높다는 평가를 받아 왔고,
            한 달 평균 검사량이 2,000만 건에 달합니다.
          </p>
          <p>
            단순한 오자나 탈자는 물론이고, 문맥에서 틀린 표현을 찾아주는 기능이
            뛰어나다는 평을 받습니다. 자기소개서를 다듬는 입시생과 취업준비생
            사이에서는 ‘등불’이라고 불려 왔습니다.
          </p>
        </section>

        <section className={classes.section}>
          <h2 className={classes.heading}>이런 곳에서 쓰고 있습니다</h2>
          <p>
            여러 기관과 기업이 바른한글의 한국어 맞춤법/문법 검사 기술을 도입해
            사용하고 있습니다.
          </p>
          <dl className='flex flex-col gap-2 rounded-[1rem] border border-[#ECEDF4] bg-[#FAFAFC] p-5 dark:border-dark-border dark:bg-dark-elevated'>
            {ADOPTIONS.map(({ field, names }) => (
              <div key={field} className='flex flex-col tab:flex-row tab:gap-3'>
                <dt className='shrink-0 font-semibold text-slate-600 dark:text-dark-text tab:w-32'>
                  {field}
                </dt>
                <dd>{names}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={classes.section}>
          <h2 className={classes.heading}>이름과 주소가 바뀐 이유</h2>
          <p>
            그동안 ‘한국어 맞춤법/문법 검사기’ 또는 ‘부산대 맞춤법/문법
            검사기’로 불려 왔습니다.
          </p>
          <p>
            권혁철 교수의 퇴임 이후 부산대학교 내부(speller.cs.pusan.ac.kr)에서
            서비스를 운영할 수 없게 되어, 외부 주소(nara-speller.co.kr)로 자리를
            옮겼습니다. 이 과정에서 화면 디자인을 대폭 개편했고, 검사기의 이름도
            ‘바른한글’로 간결하게 정리해 상표와 로고를 등록하고 있습니다.
          </p>
          <p className='font-semibold text-slate-600 dark:text-dark-text'>
            서비스와 기술은 그대로입니다. 주소와 이름만 바뀌었습니다.
          </p>
        </section>

        <section className={classes.section}>
          <h2 className={classes.heading}>만들고 운영하는 사람들</h2>
          <p>
            한국어 맞춤법/문법 검사기는 부산대학교 인공지능연구실과
            ㈜나라인포테크가 함께 만들었으며, 현재는 ㈜나라인포테크가 운영하고
            있습니다. 권혁철 교수는 퇴임 후에도 ㈜나라인포테크에서 한국어 처리
            분야의 연구와 개발을 이어가고 있습니다.
          </p>
          <a
            href='https://rogue-toothpaste-2b9.notion.site/1ee8bd6bfd808016995ff0b71b2cb358'
            target='_blank'
            rel='noopener noreferrer'
            className='font-semibold text-primary hover:underline'
          >
            바른한글 재단장에 기여하신 분들 →
          </a>
        </section>

        <section className={classes.section}>
          <h2 className={classes.heading}>이용 안내</h2>
          <p>
            이 검사기는 개인이나 학생만 무료로 사용할 수 있습니다. 기업이나
            기관에서 도입하시려면{' '}
            <Link
              href='/order'
              className='font-semibold text-primary hover:underline'
            >
              구매 안내
            </Link>
            를 참고해 주세요.
          </p>
        </section>

        <footer className='border-t border-slate-200 pt-4 text-sm text-slate-400 dark:border-dark-border dark:text-dark-subtle'>
          Copyrightⓒ2001 AI Lab &amp; Narainfotech. All Rights Reserved
        </footer>
      </div>
    </article>
  )
}
