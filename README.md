# 게시판 웹사이트 제작

### 스택
- Node.js
- Express
- MongoDB
- Pug

### 목차
- [기능](#기능)
	- [회원가입](#회원가입)
	- [로그인](#로그인)
	- [이메일 인증](#이메일-인증)
- [에러 처리](#에러-처리)
	- [node-fetch 에러](#node-fetch-error-errrequireesm-require-of-es-module--from--not-supported)
	- [DELETE 메소드 관련](#delete-메소드-관련)

### 구현 상황
- [x] 이메일로 회원가입
- [ ] 카카오 회원가입
- [x] 로그인
- [x] 이메일 인증
	- [ ] 타임스탬프 이용해서 timeout 구현
	- [ ] last_auth 구현해서 인증 요청 시간 제한?
- [x] 로그아웃
- [x] 로그인, 이메일 인증 확인 미들웨어
- [x] 404 페이지
- [x] 에러 핸들러
- [x] 프로필 화면
- [x] 프로필 수정
	- [x] 이메일 변경 시 email_auth = false
- [x] 게시글 작성
- [x] 게시글 삭제
- [ ] 게시글 검색
- [ ] 댓글
- [ ] 게시글 작성 이메일 알림
- [ ] 사이트 자체 알림
- [ ] 댓글 작성 이메일 알림
- [ ] 사진 업로드 기능
- [x] 게시글 조회수
	- [x] 조회수 중복 증가 방지

## 기능

### 회원가입
1. 기입한 이메일 주소로 인증 메일 전송
2. 이메일 계정 인증 완료 시 게시글 CRUD 기능 이용 가능

#### 흐름
1. **자체 가입 폼 이용**
	1. `/join` 접속
	2. 가입 폼 작성 후 post 요청
	3. `email_auth=false` 상태로 가입 완료
2. **카카오 가입**
	1. `/join` 접속
	2. 카카오 회원가입 클릭
	3. 카카오에서 받은 정보 중 이메일 없으면 `redirect /join`
	4. `email_auth=false` 상태로 가입 완료

#### 주요 함수 상세
**src/controllers/userController.js - postJoin**
> 가입 폼에서 받은 정보로 회원가입 처리

---

### 로그인
- 이메일 계정과 비밀번호로 로그인
- 소셜 로그인
- 로그인 상태 + 이메일 인증 완료 상태만 나머지 기능 이용 가능

#### 흐름
1. 이메일로 유저 데이터 검색
2. 유저 데이터의 솔트 값으로 입력받은 비밀번호 해시
3. 유저 데이터에 저장된 패스워드(해시값)와 2번의 결과 비교 -> 일치하는 경우 로그인 처리

#### 주요 함수 상세
**src/controllers/userController.js - postLogin**
> 이메일로 유저 검색, 해당 유저의 솔트로 비밀번호 해시 후 DB에 저장되어 있는 해시값과 비교하여 로그인 처리

---

### 이메일 인증
- 로그인 상태에서 이메일 인증 확인

#### 흐름
1. 인증되지 않은 이메일이면 이메일 인증 화면으로 넘어감
2. 인증 메일을 다시 받고 싶으면 버튼 클릭
3. 세션의 이메일값 이용해서 인증 메일 전송

#### 주요 함수 상세
**src/controllers/userController.js - sendAuthMail**
> 세션에서 이메일 가져옴, 이메일을 암호화하여 인증 링크 생성, 해당 메일 주소로 인증 메일 전송

**src/controllers/userController.js - updateEmailAuth**
> 주소의 이메일 부분 복호화하여 유저 검색, email_auth true로 업데이트

---

### 게시물 삭제

#### 흐름
1. 게시물 삭제 버튼 클릭
2. 프론트에서 `DELETE /posts/:post-id`로 fetch
3. 게시물 컨트롤러에서 삭제 처리
4. 홈으로 리다이렉트

#### 주요 함수 상세
**src/client/js/main.js - deletePost**
> 삭제 버튼 클릭 시 `DELETE /posts/:post-id` 요청 보냄, 삭제 완료 되면 홈으로 이동

**src/controllers/postController.js - deletePost**
> 주소의 파라미터에서 id값 얻은 후 게시물 삭제

## 에러 처리

### node-fetch Error [ERR_REQUIRE_ESM]: require() of ES Module ~ from ~ not supported.


`import fetch from 'node-fetch';`

fetch를 추가하자 아래와 같은 에러가 발생했다.

```
Error [ERR_REQUIRE_ESM]: require() of ES Module [node-fetch 경로] from [import한 위치] not supported.
Instead change the require of index.js in [import 위치] to a dynamic import() which is available in all CommonJS modules.
```
아마 바벨로 인해 import문이 require로 변환돼서 이런 에러가 뜬 것 같은데,
검색을 해보니 방법이 두가지 정도 있었다.

1. node-fetch 삭제 후 v2로 재다운로드
```
npm uninstall node-fetch
npm install node-fetch@2
```
2. package.json의 타입 변경
```
{
	...
    "type": "module",
    ...
}
```

CommonJS

> `node-fetch` from v3 is an ESM-only module - you are not able to import it with require(). If you cannot switch to ESM, please use v2 which remains compatible with CommonJS. Critical bug fixes will continue to be published for v2.

(출처 - https://www.npmjs.com/package/node-fetch)

v2도 버그 수정을 계속 한다고 하니.. 편한대로 사용하면 될 듯 하다.

---

### DELETE 메소드 관련
<br>

#### HTML에서는 DELETE 요청을 보낼 수 없다고?
처음에 폼을 이용해서 DELETE 요청을 보내려고 했는데, 뭔가 작동이 안 되어서 검색해보니 html에서는 get과 post 요청만 가능하다는 것을 알게 되었다.

그래서 어떻게 DELETE 메소드를 사용할 수 있을지 생각한 결과.

프론트에서 fetch로 보내면 되겠다는 결론에 도달했다.

이렇게 해도 되는 건가 싶지만 일단 작동은 잘 하니 뿌듯하다.

<br>

#### 왜 자꾸 DELETE 메소드로 리다이렉트가 되는가
```js
// src/client/js/main.js - deletePost

const deletePost = async () => {
	await fetch(location.pathname, { method: "delete" });
};

// src/controllers/postController.js - deletePost
export const deletePost = catchAsync(async (req, res) => {
	const { id } = req.params;
	await Post.deleteOne({ _id: id });
	return res.redirect('/');
});
```
처음엔 위처럼 코드를 작성했는데, `DELETE /` 이렇게 리다이렉트가 되는 것을 발견했다.

`res.redirect(303, '/')`

이렇게 303 코드를 사용하면 GET 메소드로 리다이렉트가 된다고 한다.

그런데 `GET /` 요청이 출력만 되고 실제로 브라우저에서는 리다이렉트가 발생하지 않는다.

그래서 하는 수 없이.. 백에서는 상태 코드 200을 날려주고, 프론트 쪽에서 주소를 바꿔줬다.

```js
// 프론트 js
const postDelBtn = document.querySelector('.post__del-btn');

const deletePost = async () => {
	await fetch(location.pathname, { method: "delete" });  // DELETE 요청
	window.location.href = location.origin;  // 홈으로 이동
};

if (postDelBtn)
	postDelBtn.addEventListener('click', deletePost);
```

참고>

https://stackoverflow.com/questions/24750169/expressjs-res-redirect-after-delete-request
https://stackoverflow.com/questions/33214717/why-post-redirects-to-get-and-put-redirects-to-put

---

### MongoDB 연결 에러

서버를 작동시키고 DB 연결을 기다리는데 연결 에러가 발생했다.

쉘에서 DB를 켜보니 아래의 에러 메세지가 출력됐다.

```
MongoDB shell version v5.0.7
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Error: couldn't connect to server 127.0.0.1:27017, connection attempt failed: SocketException: Error connecting to 127.0.0.1:27017 :: caused by :: Connection refused :
connect@src/mongo/shell/mongo.js:372:17
@(connect):2:6
exception: connect failed
exiting with code 1
```

소켓 오류임을 알 수 있다. 소켓 파일을 제거하면 정상적으로 동작
```
$ sudo rm -rf /tmp/mongodb-27017.sock
```

참고>

https://stackoverflow.com/questions/63562177/mongod-aborts-on-mac