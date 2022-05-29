# 게시판 웹사이트 제작

### 스택
- Node.js
- Express
- MongoDB
- ?

### 목차
- [기능](#기능)
- [구현](#구현)
- [트러블 슈팅](#트러블-슈팅)

### 구현 상황
- [x] 이메일로 회원가입
- [ ] 카카오 회원가입
- [x] 로그인
- [ ] 프로필 화면
- [ ] 프로필 수정
- [ ] 게시글 작성
- [ ] 게시글 삭제
- [ ] 게시글 수정
- [ ] 게시글 검색

## 기능

### 회원가입
1. 기입한 이메일 주소로 인증 메일 전송
2. 이메일 계정 인증 완료 시 게시글 CRUD 기능 이용 가능

### 로그인
- 이메일 계정과 비밀번호로 로그인
- 소셜 로그인
- 로그인 상태 + 이메일 인증 완료 상태만 나머지 기능 이용 가능

## 구현

### 회원가입

#### 흐름

1. **자체 가입 폼 이용**
	1. `/join` 접속
	2. 가입 폼 작성 후 post 요청
	3. 입력 받은 이메일 주소로 인증 메일 발송
	4. `email_auth=false` 상태로 가입 완료
	5. 인증 완료 시 `email_auth=true` 업데이트
2. **카카오 가입**
	1. `/join` 접속
	2. 카카오 회원가입 클릭
	3. 카카오에서 받은 정보 중 이메일 없으면 `redirect /join`
	4. 받은 이메일로 인증 메일 발송
	5. `email_auth=false` 상태로 가입 완료
	6. 인증 완료 시 `email_auth=true` 업데이트

#### 주요 함수 상세
**src/middlewares.js - sendAuthMail**
> nodemailer 이용해서 인증 메일 전송
이메일 암호화 값을 링크로 생성

**src/controllers/userController.js - postJoin**
> 가입 폼에서 받은 정보로 회원가입 처리

**src/controllers/userController.js - authMail**
> 메일 인증 링크 클릭 시 계정 부분을 복호화하여 어떤 계정의 인증이 완료됐는지 확인 후 `email_auth=true` 업데이트

**src/controllers/userController.js - postLogin**
> 이메일로 유저 검색, 해당 유저의 솔트로 비밀번호 해시 후 DB에 저장되어 있는 해시값과 비교하여 로그인 처리

## 트러블 슈팅