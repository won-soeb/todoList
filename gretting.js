const form = document.querySelector('.js-form'),
  input = document.querySelector('input'),
  // input = form.querySelector('input'), 이렇게도 쓴다
  greeting = document.querySelector('.js-greetings'),
  button = document.querySelector('.button');

const USER_LS = 'currentUser', //로컬스토리지의 키값 지정
  SHOWING_CN = 'showing'; //input창의 활성화 여부를 지정(css속성)

function saveName(text) { //이름 저장
  //로컬스토리지에 키값과 파라미터값을 저장
  localStorage.setItem(USER_LS, text);
}

function handleSubmit(event) { //이벤트 함수
  event.preventDefault(); //이벤트 버블링 금지
  //enter를 눌렀을 시 새로고침되지 않도록 방지한다
  const currentValue = input.value; //input창에 입력한 값을 가져온다
  paintGreeting(currentValue);
  saveName(currentValue);
}

function askForName() { //이름 입력 함수
  form.classList.add(SHOWING_CN);
  //js-form클래스(form태그)에 showing클래스(+css/display속성)를 추가한다
  form.addEventListener('submit', handleSubmit);
  //form태그에 submit이벤트를 지정
}

function paintGreeting(text) { //이름 출력 함수
  form.classList.remove(SHOWING_CN);
  //js-form클래스(form태그)에 showing클래스(+css/display속성)를 제거한다
  greeting.classList.add(SHOWING_CN);
  //js-greetings클래스(h4태그)에 showing클래스(+css/display속성)를 추가한다
  greeting.innerText = `Hello ${text}`;
  //h4태그의 내용을 위의 탬플릿 문자열로 덮어쓴다
  button.classList.add(SHOWING_CN);
}

function loadName() { //이름 불러오기
  const currentUser = localStorage.getItem(USER_LS);
  //로컬스토리지에 저장된 키값을 불러온다
  if (currentUser === null) { //키값이 없다면
    askForName();
  } else {
    paintGreeting(currentUser);
  } //다음의 조건문 실행
}

function eraseName() {
  button.addEventListener('click', function() {
    localStorage.clear();
    greeting.classList.remove(SHOWING_CN);
    button.classList.remove(SHOWING_CN);
    form.classList.add(SHOWING_CN);
  });
}

function init() { //모듈함수
  loadName();
  // eraseName();
}

init();
