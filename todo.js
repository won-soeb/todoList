const toDoForm = document.querySelector('.js-toDoForm'),
  //form태그. submit이벤트를 걸기 위해 생성함
  toDoInput = toDoForm.querySelector('input'),
  //input태그. 할일 목록을 입력하는 곳
  /*이 프로그램을 실행해보면 input태그가 여러개 만들어지기 때문에
  document를 사용할 경우 querySelector가 메인 input태그값이
  무엇인지 제대로 찾지 못한다(body범위에서 모든 input태그값을 찾기 때문).
  그래서 toDoForm객체에서 함수를 실행하여 form태그로 범위를
  한정해야 한다(submit이벤트도 걸어야 하고.)*/
  toDoList = document.querySelector('.js-toDoList'),
  //ul태그. 입력한 할일 목록(li태그)을 생성 또는 삭제한다
  result = document.querySelector('p');
//p태그. 입력,삭제,편집결과를 출력한다

const TODO_LS = 'toDos'; //로컬 스토리지의 키값

let toDos = []; //할일 목록을 저장할 배열 생성

function saveTodos() {
  localStorage.setItem(TODO_LS, JSON.stringify(toDos));
  //로컬 스토리지는 문자열만 저장이 가능하기에 json형식으로 변환해준다.
}

function todoHTML(input) { //화면세팅(선택버튼생성)
  input.innerHTML = `
    <button onclick="drawLine(event)">Stop</button><button
    onclick="editTodo(event)">Edit</button><button
    onclick="deleteToDo(event)">Delete</button>
    <span></span>
      `;
}

function deleteToDo(event) {
  const li = event.target.parentNode; //li태그를 의미한다
  //target객체는 해당태그를, parentNode객체는 target의 부모태그를 지칭한다.
  span = li.querySelector('span').innerText, //span태그에 표시할 내용
    //document대신 li로 범위를 한정해준다.이렇게 해야만 선택한 li태그 내부의
    //span태그를 찾을 수 있다
    deleteLi = confirm( //알림창을 띄워 삭제여부를 묻는다
      //html속성에 접근할 경우 ['속성']를 사용한다
      `${li['id']}번째 할 일 "${span}"를 삭제합니다.
    정말로 삭제할까요?`);
  if (deleteLi) { //삭제하는 경우
    toDoList.removeChild(li); //ul태그의 자식인 li태그를 제거
    const cleanToDos = toDos.filter(function(toDo) {
      /* 배열 toDos의 요소는 객체이므로 filter함수의 콜백인자는
      아래의 toDoObj객체(addToDo함수에 있음)이다
      filter함수를 통해 배열(객체들)을 순회하면서 조건에 만족하는 새로운 배열을 생성한다
       */
      return toDo.id != parseInt(li.id);
      /* 원본배열의 속성(숫자)과 선택한 배열의 속성
      (문자열로 출력되기 때문에 parseInt로 변환해야 함)을 비교한다
      선택한 값(숫자)과 다른 값들만 모아 새로운 배열을 만들며,
      최종적으로 선택한 값만 제거된 배열이 생성된다.
       */
    });
    toDos = cleanToDos;
    //filter함수는 원본배열을 보존하므로 변경된 배열로 덮어씌워야 한다
    saveTodos(); //로컬스토리지에 저장
    result.innerText = `${li['id']}번째 할 일 "${span}"를 삭제함`;
    console.log(`${li['id']}번째 할 일 "${span}"를 삭제함`);
  } else { //삭제하지 않는경우
    result.innerText = `${li['id']}번째 할 일 "${span}"를 삭제하지 않음`;
    console.log(`${li['id']}번째 할 일 "${span}"를 삭제하지 않음`);
  }
}

function editTodo(event) {
  const li = event.target.parentNode, //li태그
    data = JSON.parse(localStorage.getItem(TODO_LS))[li.id - 1].text;
  /*
  JSON.parse : JSON객체를 문자열로 파싱
  localStorage.getItem(TODO_LS) : 로컬스토리지(배열)를 가져옴
  [li.id - 1] : html(li태그)의 id값으로 배열의 인덱스를 결정
  text : 선택한 인덱스(객체)의 속성
   */
  li.innerHTML = `
    <input type="text" value="${data}" id="edit">
    <button id="textEdit">Edit</button><button
    id="cancel">Cancel</button>
  `; //선택버튼을 먼저 생성
  const cancel = li.querySelector('#cancel'),
    edit = li.querySelector('#textEdit');
  cancel.addEventListener('click', textCancel);
  edit.addEventListener('click', textEdit);
}

function textEdit(event) {
  const li = event.target.parentNode, //li
    editInput = li.querySelector('#edit').value, //input
    index = li.id;
  todoHTML(li); //li태그 내부에 선택버튼생성
  const span = li.querySelector('span'),
    data = JSON.parse(localStorage.getItem(TODO_LS))[li.id - 1].text;
  if (editInput != data) {
    //데이터가 수정되려면 이전에 입력한 값(현재 로컬스토리지에 저장된 값)과
    //현재 입력한 값(로컬스토리지에 덮어쓸 값)이 달라야 한다
    const toDoObj = { //배열에 덮어쓸 객체
      text: editInput, //입력할 내용
      id: index //수정할 번호
    };
    toDos.splice(index - 1, 1, toDoObj); //배열에 위의 객체를 덮어쓴다
    saveTodos(); //로컬스토리지에 저장
    result.innerText = `${index}번째 할 일 "${data}"를 "${editInput}"로 수정함`;
    console.log(`${index}번째 할 일 "${data}"를 "${editInput}"로 수정함`);
  } else { //이전값과 현재값이 같은 경우
    result.innerText = `할 일 "${data}"를 수정하지 않음`;
    console.log(`할 일 "${data}"를 수정하지 않음`);
  }
  span.innerText = editInput; //화면에 수정한 값을 출력
}

function textCancel(event) { //수정취소함수
  const li = event.target.parentNode, //li
    data = JSON.parse(localStorage.getItem(TODO_LS))[li.id - 1].text;
  todoHTML(li);
  const span = li.querySelector('span');
  span.innerText = data;
  result.innerText = '데이터 수정을 취소함';
  console.log('데이터 수정을 취소함');
}

function drawLine(event) {
  const btn = event.target,
    span = btn.parentNode.querySelector('span');
  btn.removeEventListener('click', drawLine);
  span.style.textDecoration = 'line-through'; //줄긋기(css)
  btn.innerText = 'Resume';
  btn.addEventListener('click', deleteLine);
  result.innerText = `할 일 "${span.innerText}"를 정지함`;
  console.log(`할 일 "${span.innerText}"를 정지함`);
}

function deleteLine(event) {
  const btn = event.target,
    span = btn.parentNode.querySelector('span');
  btn.removeEventListener('click', deleteLine);
  span.style.textDecoration = 'none'; //줄지우기(css)
  btn.innerText = 'Stop';
  btn.addEventListener('click', drawLine);
  result.innerText = `할 일 "${span.innerText}"를 재개함`;
  console.log(`할 일 "${span.innerText}"를 재개함`);
}

function addToDo(text) {
  const li = document.createElement('li'), //li태그를 생성
    newId = toDos.length + 1; //할일 목록에 각각 지정할 번호
  todoHTML(li); //li태그 내부에 선택버튼을 생성
  const span = li.querySelector('span');
  span.innerText = text; //화면(span태그)에 표시할 텍스트
  li.id = newId; //각 태그마다 번호가 id값으로 매핑되도록 한다
  toDoList.appendChild(li); //ul태그 내부에 입력한 내용을 li태그로 생성한다
  const toDoObj = { //배열에 추가할 객체
    text: text, //입력할 내용
    id: newId //번호
  };
  toDos.push(toDoObj); //배열에 위의 객체를 추가
  saveTodos(); //객체 추가 후 저장
}

function handleSubmit(event) { //메인 input태그 이벤트함수
  event.preventDefault(); //이벤트가 다른 태그로 퍼지는 것을 방지한다
  const curretValue = toDoInput.value;
  addToDo(curretValue);
  result.innerText = `"${curretValue}"를 새로운 데이터로 추가함`;
  console.log(`"${curretValue}"를 새로운 데이터로 추가함`);
  toDoInput.value = ''; //입력하고 엔터누르면 내용이 지워지도록 함
}

function loadToDos() {
  const loadedToDos = localStorage.getItem(TODO_LS);
  if (loadedToDos !== null) {
    const parsedToDos = JSON.parse(loadedToDos);
    //로컬스토리지에 문자열로 저장된 데이터를 본래 타입으로 되돌린다
    parsedToDos.forEach(function(toDo) {
      //위의 toDoObj객체를 인자로 받음
      addToDo(toDo.text);
      //toDos배열을 순회하면서 toDoObj객체의 text요소를 화면에 출력한다
    });
  }
}

function init() {
  loadToDos();
  toDoForm.addEventListener('submit', handleSubmit);
}

init();
