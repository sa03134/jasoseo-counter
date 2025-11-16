# GitHub 업로드 가이드

## 방법 1: GitHub 웹사이트에서 업로드 (가장 쉬움!)

1. **GitHub 저장소 생성**
   - https://github.com/new 접속
   - Repository name: `jasoseo-counter` 입력
   - Description: "자소서 글자수 및 바이트 계산 크롬 확장 프로그램"
   - Public 선택
   - "Create repository" 클릭

2. **파일 업로드**
   - "uploading an existing file" 클릭
   - 다음 파일들을 드래그 앤 드롭:
     - manifest.json
     - popup.html
     - popup.js
     - styles.css
     - icon16.png
     - icon48.png
     - icon128.png
     - README.md
     - .gitignore
   - "Commit changes" 클릭

3. **완료!**
   - 저장소 URL: https://github.com/sa03134/jasoseo-counter

---

## 방법 2: Git 커맨드라인 사용

### 1단계: Git 설치 확인
```bash
git --version
```

### 2단계: GitHub 저장소 생성
- https://github.com/new 에서 저장소 생성
- Repository name: `jasoseo-counter`

### 3단계: 로컬에서 Git 초기화 및 업로드
```bash
# 프로젝트 폴더로 이동
cd byte-counter

# Git 초기화
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: 자소서 글자수 계산기 v1.3"

# 원격 저장소 연결 (YOUR_USERNAME을 sa03134로 변경)
git remote add origin https://github.com/sa03134/jasoseo-counter.git

# GitHub에 푸시
git branch -M main
git push -u origin main
```

### 4단계: GitHub 로그인
- 사용자명: sa03134
- Personal Access Token 입력 (비밀번호 대신)

---

## Personal Access Token 생성 방법

1. GitHub 로그인
2. Settings → Developer settings → Personal access tokens → Tokens (classic)
3. "Generate new token (classic)" 클릭
4. Note: "jasoseo-counter upload"
5. Expiration: 원하는 기간 선택
6. Select scopes: `repo` 체크
7. "Generate token" 클릭
8. 토큰 복사 (다시 볼 수 없으니 안전한 곳에 보관!)

---

## 파일 구조

```
byte-counter/
├── manifest.json          # 확장 프로그램 설정
├── popup.html            # 메인 UI
├── popup.js              # 기능 구현
├── styles.css            # 스타일
├── icon16.png            # 아이콘 16x16
├── icon48.png            # 아이콘 48x48
├── icon128.png           # 아이콘 128x128
├── README.md             # 프로젝트 설명
└── .gitignore            # Git 제외 파일
```

---

## 추천: 방법 1 사용!

Git 처음 사용하시면 웹사이트에서 직접 업로드하는 게 가장 쉬워요!
