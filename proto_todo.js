const toDoForm = document.querySelector('.js-toDoForm'),
  toDoInput = toDoForm.querySelector('input'),
  toDoList = document.querySelector('.js-toDoList');

const TODO_LS = 'toDos'; //로컬 스토리지의 키값

let toDos = []; //할일 목록을 저장할 배열 생성

function saveTodos() {
  localStorage.setItem(TODO_LS, JSON.stringify(toDos));
  //로컬 스토리지는 문자열만 저장이 가능하기에 json형식으로 변환해준다.
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
}


let drawLine = function(event) {
  const btn = event.target,
    span = btn.parentNode.querySelector('span');
  span.style.textDecoration = 'line-through';
  btn.innerText = 'Resume';
  btn.addEventListener('click', deleteLine);
};

let deleteLine = function(event) {
  const btn = event.target,
    span = btn.parentNode.querySelector('span');
  btn.removeEventListener('click', deleteLine);
  span.style.textDecoration = 'none';
  btn.innerText = 'Stop';
  btn.addEventListener('click', drawLine);
};

function paintToDo(text) {
  const li = document.createElement('li'),
    delBtn = document.createElement('button'),
    drawline = document.createElement('button'),
    span = document.createElement('span'), //한줄에 이어쓰는 태그
    newId = toDos.length + 1; //할일 목록에 각각 지정할 번호
  delBtn.innerHTML = 'Delete'; //삭제버튼
  drawline.innerText = 'Stop' //중지버튼
  delBtn.addEventListener('click', deleteToDo);
  drawline.addEventListener('click', drawLine);
  span.innerText = text; //화면에 표시할 텍스트
  li.appendChild(delBtn); //해당인자(button)를 li태그의 자식태그로 생성한다
  li.appendChild(drawline); //해당인자(drawline)를 li태그의 자식태그로 생성한다
  li.appendChild(span); //span태그가 li태그 내부에 생성된다
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
  paintToDo(curretValue);
  toDoInput.value = ''; //입력하고 엔터누르면 내용이 지워지도록 함
}

function loadToDos() {
  const loadedToDos = localStorage.getItem(TODO_LS);
  if (loadedToDos !== null) {
    const parsedToDos = JSON.parse(loadedToDos);
    //로컬스토리지에 문자열로 저장된 데이터를 본래 타입으로 되돌린다
    parsedToDos.forEach(function(toDo) {
      //위의 toDoObj객체를 인자로 받음
      paintToDo(toDo.text);
      //toDos배열을 순회하면서 toDoObj객체의 text요소를 화면에 출력한다
    });
  }
}

function init() {
  loadToDos();
  toDoForm.addEventListener('submit', handleSubmit);
}

init();
