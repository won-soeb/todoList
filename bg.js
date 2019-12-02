const body = document.querySelector('body');//배경으로 설정

const IMG_NUMBER = 7;//사진개수

function paintImage(imgNumber) {
  const image = new Image();//이미지 객체 생성
  image.src = `image/${imgNumber}.jpg`;//파일명 입력
  image.classList.add('bgImage');//해당 클래스에 사진을 추가
  body.appendChild(image);//추가한 클래스를 body태그(배경)으로 설정
}

function genRandom() {//임의의 수를 생성 후 리턴하는 함수
  const number = Math.floor(Math.random() * IMG_NUMBER) + 1;
  return number;
}

function init() {
  let randomNumber = genRandom();
  paintImage(randomNumber);//홈페이지 처음 로드 시 랜덤한 이미지 등장
  setInterval(function() {
    randomNumber = genRandom();
    paintImage(randomNumber);
  }, 7000);//이후 7초마다 랜덤하게 이미지가 변한다
}

init();
