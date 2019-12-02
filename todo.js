const toDoForm = document.querySelector('.js-toDoForm'),
  toDoInput = toDoForm.querySelector('input'),
  toDoList = document.querySelector('.js-toDoList'),
  result = document.querySelector('p');

const TODO_LS = 'toDos'; //로컬 스토리지의 키값

let toDos = []; //할일 목록을 저장할 배열 생성

function saveTodos() {
  localStorage.setItem(TODO_LS, JSON.stringify(toDos));
  //로컬 스토리지는 문자열만 저장이 가능하기에 json형식으로 변환해준다.
}

function todoHTML(input) {
  input.innerHTML = `
    <button onclick="deleteToDo(event)">Delete</button><button
    onclick="drawLine(event)">Stop</button><button
    onclick="editTodo(event)">Edit</button><span></span>
      `;
}

function deleteToDo(event) {
  const li = event.target.parentNode; //li태그를 의미한다
  //target객체는 해당태그를, parentNode객체는 target의 부모태그를 지칭한다.
  toDoList.removeChild(li); //ul태그의 자식인 li태그를 제거
  const cleanToDos = toDos.filter(function(toDo) {
    //아래의 toDoObj객체를 인자로 받는다
    //배열을 순회하면서 조건에 만족하는 새로운 배열을 생성한다
    return toDo.id != parseInt(li.id);
    //toDoObj객체의 id와 화면에 나타난 li태그의 id를 비교하여
    //달라지는 값들을 새로운 배열의 요소로 선택한다.
  });
  toDos = cleanToDos;
  saveTodos();
  result.innerText = `${li['id']}번째 항목을 삭제함`;
  console.log(`${li['id']}번째 항목을 삭제함`);
}

function editTodo(event) {
  const li = event.target.parentNode, //li
    data = JSON.parse(localStorage.getItem(TODO_LS))[li.id - 1].text;
  // console.log(li.id);
  // console.log(data);
  /*
  JSON.parse : JSON객체를 문자열로 파싱
  localStorage.getItem(TODO_LS) : 로컬스토리지(배열)를 가져옴
  [btn.id - 1] : html(li태그)의 id값으로 배열의 인덱스를 결정
  text : 선택한 인덱스(요소)의 속성
   */
  li.innerHTML = `
    <input type="text" value="${data}" id="edit">
    <button id="textEdit">Edit</button><button
    id="cancel">Cancel</button>
  `;
  const cancel = li.querySelector('#cancel'),
    edit = li.querySelector('#textEdit');
  //document대신 li로 범위를 한정해준다.그래야 복수선택시 문제가 발생하지 않는다
  cancel.addEventListener('click', textCancel);
  edit.addEventListener('click', textEdit);
}

function textCancel(event) {
  const li = event.target.parentNode, //li
    data = JSON.parse(localStorage.getItem(TODO_LS))[li.id - 1].text;
  todoHTML(li);
  const span = li.querySelector('span');
  span.innerText = data;
}

function textEdit(event) {
  // event.preventDefault();
  const li = event.target.parentNode, //li
    editInput = li.querySelector('#edit').value;
  todoHTML(li);
  const span = li.querySelector('span'),
    data = JSON.parse(localStorage.getItem(TODO_LS))[li.id - 1].text,
    index = JSON.parse(localStorage.getItem(TODO_LS))[li.id - 1].id;
  span.innerText = editInput;
  const toDoObj = { //배열에 추가할 객체
    text: editInput, //입력할 테스트
    id: index - 1 //수정할 번호
  };
  toDos.splice(index - 1, 1, toDoObj); //배열에 위의 객체를 덮어쓴다
  saveTodos();
  result.innerText = `${index}번째 데이터 '${data}'를 '${editInput}'로 수정함`;
  console.log(`${index}번째 데이터 '${data}'를 '${editInput}'로 수정함`);
}

function editSubmit(event) {
  event.preventDefault();
  const curretValue = toDoInput.value;
  paintToDo(curretValue);
  toDoInput.value = ''; //입력하고 엔터누르면 내용이 지워지도록 함
}

function drawLine(event) {
  const btn = event.target,
    span = btn.parentNode.querySelector('span');
  btn.removeEventListener('click', drawLine);
  span.style.textDecoration = 'line-through';
  btn.innerText = 'Resume';
  btn.addEventListener('click', deleteLine);
  result.innerText = `${btn.parentNode['id']}번째 항목을 정지함`;
  console.log(`${btn.parentNode['id']}번째 항목을 정지함`);
  //html속성에 접근할 경우 []를 사용한다
}

function deleteLine(event) {
  const btn = event.target,
    span = btn.parentNode.querySelector('span');
  btn.removeEventListener('click', deleteLine);
  span.style.textDecoration = 'none';
  btn.innerText = 'Stop';
  btn.addEventListener('click', drawLine);
  result.innerText = `${btn.parentNode['id']}번째 항목을 재개함`;
  console.log(`${btn.parentNode['id']}번째 항목을 재개함`);
}

function addToDo(text) {
  const li = document.createElement('li'),
    newId = toDos.length + 1; //할일 목록에 각각 지정할 번호
  todoHTML(li);
  const span = li.querySelector('span');
  span.innerText = text; //화면에 표시할 텍스트
  li.id = newId; //각 태그마다 번호가 id값으로 매핑되도록 한다
  toDoList.appendChild(li); //ul태그 내부에 입력한 내용을 li태그로 생성한다
  const toDoObj = { //배열에 추가할 객체
    text: text, //입력할 테스트
    id: newId //번호
  };
  toDos.push(toDoObj); //배열에 위의 객체를 추가
  saveTodos(); //객체 추가 후 저장
}

function handleSubmit(event) {
  event.preventDefault();
  const curretValue = toDoInput.value;
  addToDo(curretValue);
  result.innerText = `'${curretValue}'를 새로운 데이터로 추가함`;
  console.log(`'${curretValue}'를 새로운 데이터로 추가함`);
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
