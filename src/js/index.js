// step 1 요구사항 구현을 위한 전략
// 조건에 따라 필요한 것 생각해보기
/* 요구사항 분석
    TODO 메뉴 추가
        메뉴이름 받고 엔터키 입력으로 추가됨 + 확인버튼을 클릭도 포함
        추가되는 메뉴의 마크업은 '<ul id="menu-list" class="mt-3 pl-0"></ul>' 안에 삽입되야 함
        총 메뉴 개수를 count 해서 상단에 보여줌
        메뉴가 추가되고 나면, input은 빈 값으로 초기화 함
        사용자 입력값이 빈 값이면 추가되지 않음

    TODO 메뉴 수정
        메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴 수정하는 모달창 뜸
        모달창에서 신규메뉴를 입력 받고, 확인버튼을 누르면 메뉴가 수정됨

    TODO 메뉴 삭제
        메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 컨펌 모달창이 뜸
        확인 버튼을 클릭하면 메뉴가 삭제됨


    *   Event.target는 부모로부터 이벤트가 위임되어 발생하는 자식의 위치, 내가 클릭한 자식 요소를 반환한다. 
        event.currentTarget은 부모 요소인 button을 반환하는 것을 알 수 있다. * 

        리펙터링 - 중복 줄이고, 가독성 높게 함수로 만들어주는 것
        (함수선언을 위에 추가,수정,삭제로 해주고 아래에서 호출하는 방식으로 수정해봤음)

        주석의 설명은 주석 아래의 코드를 설명함
        함수의 경우 어떤걸 위한 함수인지는 마지막에 적어둠

*/
// step 2
/* 요구사항 분석
    TODO 데이터 저장 , 읽어오기
        localStorage에 데이터를 저장한다.
         -메뉴 추가할 때 , 수정할 때, 삭제할 때
        
        localStorage에 있는 데이터를 읽어온다.

    TODO 카테고리별 메뉴판 관리
        에스프레소,프라푸치노,블렌디드,티바나,디저트 메뉴판 관리

    TODO 페이지 접근시 최초 데이터 읽기,랜더링
        페이지에 최초 로딩 때 localStorage에 에스프레소 메뉴 읽어온다.
        에스프레소 메뉴를 페이지에 그려준다.

    TODO 품질 상태 관리
        품절 상태인 경우를 보여줄 수 있게, 품질 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다
        품절 버튼을 추가한다.
        품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
        클릭이벤트에서 가장 가까운 li태그의 class속성 값에 sold-out을 추가한다.    

        * 상태 = 데이터,변할 수 있는 데이터 * 

*/

// step 3
/* 요구사항 분석
    TODO 서버 요청 부분
        웹 서버를 띄운다.
        서버에 새로운 메뉴명을 추가될 수 있도록 요청한다.
        서버에 카테고리별 메뉴리스트를 불러온다.
        서버에 메뉴가 수정 될 수 있도록 요청한다
        서버에 메뉴의 품절상태를 토글(두가지 상태 반전)될 수 있도록 요청한다.
        서버에 메뉴가 삭제 될 수 있도록 요청한다.

    TODO 리펙터링 부분
        localStorage에 저장하는 조릭은 지운다.
        fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

    TODO 사용자 경험
        API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
        중복되는 메뉴는 추가 할 수 없다.

        웹 서버 띄우는 방법
            (https://github.com/blackcoffee-study/moonbucks-menu-server) 링크타고 들어가서
            메뉴 서버 들어가서 저장소를 local에 클론하기 위해서
            git clone https://github.com/blackcoffee-study/moonbucks-menu-server.git (이 부분 복사)
            터미널에서 붙여넣기 해서 내 로컬에 클론해주기 (moonbucks-menu 폴더로 cd를 이요해 이동 후)
            그리고 cd moonbucks-menu-server 로 디렉토리를 이동해서
            npm install 을 해줘서 npm을 설치
            그리고 npm start 해서 웹서버를 구동시켜주면 된다
            (node.js를 설치해주고 node -v , npm -v를 해서 버전도 확인해주자)

*/

import { $ } from "./utils/dom.js";
import store from "./store/index.js";

//html의 element를 가져올 때 $표시를 관용적으로 사용 함, id값을 받는 querySelector를 리턴해주는걸 의미함
// querySelector() 이 $가 되는 것
// const $ = (selector) => document.querySelector(selector);
// 이 부분은 dom.js로 옮겨서 사용

//저장하는 변수
//localStorage는 문자열만 저장을 해줘야 하기 때문에 JSON.stringify()문자열로 저장하기 위해 사용
// const store = {
//     setLocalStorage(menu){
//         //문자열로 저장은 stringify
//         localStorage.setItem("menu",JSON.stringify(menu));
//     },
//     getLocalStorage(){
//         //리턴을 해줘야 init에서 값을 받을 수 있음
//         //문자열로 저장된 데이터를 JSON 객체로 다시 해주는 것은 parse
//         return JSON.parse(localStorage.getItem("menu"));
//     },
// };
// 이 부분은 store폴더의 index.js로 이동

//"liveServer.settings.port": 3000, 를 이용해서 live server의 JSON을 수정해주면 포트번호 바꿀 수 있다
//재사용을 위해서 BASE_URL로 해줌 3000의 뒤에 있는 api는 이해하기 쉽게 하기위해서 넣어주면 좋음
const BASE_URL = "http://localhost:3000/api"; //사용할 때 현재 주소를 알 수 있도록 해줘야 함
//fetch('url',옵션) 주소와 옵션 , 얻어오다는 의미 (요청주소 보내면 , 옵션으로 구체적 약속을 넣어줌)

const MenuApi = {
    async getAllMenuByCategory(category) {
        //수정 후 코드
        const response = await fetch(`${BASE_URL}/category/${category}/menu`);
        return response.json();
        //여기서는 this를 쓰게되면 오류가 생김 왜냐하면 여기서의 this는 MenuAPi를 의미하기 때문

        //수정 전 코드
        //오류 이유, 전체의 리턴값을 넘겨줘야 하는데 함수의 체이닝 한 부분만 넘겨주다 보니 
        //then으로 붙여주는 형태에서만 받을 수 있는데 함수의 리턴값으로 데이터를 내려주기 위해서
        //await fetch를 해주게 되면 then 안쓰고도 response 객체를 받아올 수 있음
        // .then((response) => {
        //     return response.json();
        // })
        // .then((data) => {
        //     return data; //데이터만 받아오면 되는 부분이라 데이터만 리턴해는 형태로 바꿈
        // });
    },
};

//addEventListener 이벤트 추가 (괄호내용은 이벤트 실행 시 e에 값을 담아서 보내줌, e.key를 이용해서 받음)
//if를 이용해서 엔터를 입력시 값을 받아오는것으로 만들어보자
//.value를 통해서 지정된 것 값을 받아옴, form태그 때문에 엔터치면 새로고침 됨, 해결법은 위 코드에
//한 파일에 객체 하나인것이 좋음 선언하는걸 대표하는 파일명을 만드는데 어려움이 있기 때문
function App() {
    //메뉴명 관리(App함수가 갖고있는 상태이기 때문), this는 전역변수 값을 가져옴(객체자신을 가르킴)
    //메뉴가 여러개이기 때문에 초기화를 해주는것이 좋다
    this.menu = {
        //메뉴판별로 배열을 만들어서 초기화
        espresso: [],
        frappuccino: [],
        blended: [],
        teavana: [],
        desert: [],
    }; //초기화 안하면 어떤 데이터값이 들어갈 지 모르기때문에 push 안됨(협업에서도 필요함)

    //현재 카테고리상태
    //바뀌는 값이고 디폴트로 조건에 맞춰 espresso로 해둔 것
    this.currentCategory = "espresso";

    //새로고침시 localstorage에 데이터가 있는지 확인하고 있으면 this.menu에 넣어주는 것
    this.init = async () => {
        console.log(MenuApi.getAllMenuByCategory(this.currentCategory));
        //Promise(<pending>)라는 에러가 뜸, promise는 진동벨과 같은 의미인데 안에 메뉴가 없으니 렌더링 안됨
        //비동기 통신을 하는 곳 모두다 async await를 써줘야 함 (수정완)
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
        // await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`)
        //     .then((response) => {
        //         return response.json();
        //     })
        //     .then((data) => {
        //         this.menu[this.currentCategory] = data;
        //         render();
        //         $("#menu-name").value = "";
        //     });
        render();
        initEventListeners();

        //localStorage에 데이터가 있으면
        // if (store.getLocalStorage()) {
        //     this.menu = store.getLocalStorage();
        //     render();
        //     initEventListeners();
        // };
    };

    //그려주는, 렌더링 해주는 함수
    const render = () => {
        //map 메서드는 화면별로 마크업 만들기 위해 사용함, menu모아서 새로운 배열로 만들어 줌
        //menu 각각의 item들을 순회하면서 li태그마다 아래의 return된 li태그 마크업의 값이 들어감(원소로)
        //최종적으로 하나의 배열을 만들어준다, 그래서 변수로 만들어서 담는다
        //['<li></li>', '<li></li>'] 이런식으로
        const template = this.menu[this.currentCategory]
            //map는 모든 배열의 아이템에 함수를 실행하는 메서드   
            .map((menuItem, index) => {
                //menuItem.name은 입력한 메뉴의 이름을 나타내고 index는 배열을 나타냄 
                //menuItem.soldOut는 품절인지에 대해서 나와서 삼항연산자고 품절이면 soldOut클래스가 추가됨 아니면 추가X
                return `
        <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">

        <span class="${menuItem.soldOut ? 'sold-out' : ""} w-100 pl-2 menu-name 
        ">${menuItem.name}</span>

        <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
            품절
        </button>

        <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
            수정
        </button>

        <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
            삭제
        </button>
        </li>`;
                // html태그에 넣으려면 하나의 마크업이 되야함(객체 형태로 바로 넣을 수 없으므로)
                //join이라는 메서드 이용시 문자열을 하나로 합쳐줌
            })

            .join("");
        console.log(this.menu[this.currentCategory]);

        //innerHTML 속성을 이용해 HTML에 넣을 수 있음, return된 템플릿을 넣어주면 됨
        //.insertAdjacentHTML("위치",넣는변수(인자)); 해주면 innerHTML + 위치설정 가능하다
        $("#menu-list").innerHTML = template;
        // 한꺼번에 바꿔줄 것 이기에 insertAdjacentHTML을 사용하지 않음
        // .insertAdjacentHTML(
        // "beforeend",
        // menuItemTemplate(MenuName)
        // );

        //메뉴 카운트 (li개수를 카운팅), 변수 명 클래스명을 활용해서 만드는게 이해하기 좋음
        //querySelector을 이요해서 li태그 가져올 수 있는데 가장 첫번째 것 가져옴
        //그래서 querySelectorAll 해주면 모든 태그를 가져올 수 있음 개수를 세는 방법은 .length 해주면 됨

        UpdateMenuCount();
    };

    //생성 부분에서 가져온 것
    //메뉴 업데이트시 카운트 함수
    const UpdateMenuCount = () => {
        // 수정 전
        // const menuCount = $("#menu-list").querySelectorAll("li").length;
        // $(".menu-count").innerText = `총 ${menuCount} 개`;
        // 수정 후
        const menuCount = this.menu[this.currentCategory].length;
        $(".menu-count").innerText = `총 ${this.menu[this.currentCategory].length} 개`;
    };

    //메뉴추가 함수
    const addMenuName = async () => {
        //await을 쓰기위해 addMenuName 부분에 async를 추가해줌
        //async를 사용해줘야 콘솔창에 추가 후 리스트가 정상적으로 뜸, 아니면 리스트부터 떠서 추가 된 항목 안보임
        //빈값이면 알림뜨고 엔터 안되게 하기
        if ($("#menu-name").value === "") {
            alert("값을 입력해주세요.");
            //리턴 해주면 뒷 부분 동작이 안되기 때문에 입력해도 안나옴
            return;
        }

        //이전에 작성해둔 엔터누르면 실행되는 코드, 아무것도 없이 엔터하면 안되게 작성을 위해 위로 수정이동
        //if(e.key === "Enter"){
        //메뉴이름 받아서 저장하는 변수
        const menuName = $("#menu-name").value;

        //api의 주소는 사이트에 있다
        //새로운 메뉴 추가를 요청하기 위함 (서버에 요청하는 로직 , 위 주석된 코드는 상태를 추가하는 로직)
        //객체 생성은 POST라는 메서드 사용, 주고받는 컨텐츠 타입은 주로 json형태로 주고받음
        //localStorage에 데이터를 저장할 때 문자열로 저장하느라 JSON.stringify 이용 (키, 값 넣어서 요청)
        await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`, {
            //현재 주소까지 해줘야 잘 작동함 (/api/category/:category/menu)
            method: "POST", //객체 생성시 주로 POST 사용 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: menuName }),
        }).then((response) => { //체이닝 하는 메서드를 이용해서 응답 받을 수 있음
            console.log(response);
            return response.json();
        }).then((data) => {
            console.log(data);
        }); //보낸 데이터 확인

        //fetch만 쓰면 문제가 생김 먼저쓴게 뒤에 찍힘
        //js는 싱글쓰레드(한번에 한가지의 일만 함), 먼저 요청한것에 대해서 먼저 응답을 받지 못할 수 있음
        //카페의 진동벨과 같은 개념/ 먼저 제조가 쉬운 메뉴는 일찍 나올 수 있지만 진동벨과 같은 것 으로 약속을 함
        //비동기 통신을 async await을 이용해서 순서를 보장해줄 수 있게 할 수 있음
        //async await 사용법은 비동시통신이 있는 함수에 앞에 async 쓰고 기다리길 바라는 로직앞에 await 쓰면 됨

        await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                //console.log(data);
                //추가된 데이터 넣어주기
                this.menu[this.currentCategory] = data
                //input 비우기
                $("#menu-name").value = "";
            });


        const data = await MenuApi.getAllMenuByCategory(this.currentCategory)
        render();
        $("#menu-name").value = "";


        //배열에 메뉴를 추가, push이용해서 새로운 객체를 담을 수 있다.
        //menu 부분에 [this.currentCategory]가 들어간 이유, 현재의 메뉴판에 값 추가를 위함
        //this.menu[this.currentCategory].push({ name: MenuName }); 
        //서버와 통신을 위해 위 작성한 fetch코드를 이용

        //localStorage에 저장
        //store.setLocalStorage(this.menu);

        // 요구사항에 있는 코드를 가져와서, 템플릿을 담을 변수를 만듦
        //MenuName 변수를 인자로 받아서 li태그에 넣을 수 있게 해줌
        // const menuItemTemplate = (MenuName) => {
        //     return `
        // <li class="menu-list-item d-flex items-center py-2">

        // <span class="w-100 pl-2 menu-name">${MenuName}</span>

        // <button
        //   type="button"
        //   class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        // >
        //   수정
        // </button>

        // <button
        //   type="button"
        //   class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        // >
        //   삭제
        // </button>
        // </li>`;
        // }; 위에 template으로 만들어줬기 때문에 안씀

        //api 사용
        //render();

        // <!-- beforebegin -->
        // <ul>
        // <!-- afterbegin -->
        // <li></li>
        // <!-- beforeend -->
        // </ul>
        // <!-- afterend -->
    };

    //메뉴수정 함수, 수정하는 함수를 이용할 때 매개변수(parameter)를 넘겨줘야 잘 작동함
    const updateMenuName = (e) => {
        //마크업 부분에 생성할 때 만들어준 id값인 index를 가져옴
        //dataset속성을 이용해서 데이터속성에 접근 가능(속성이 동적으로 만들어져서 활용가능)
        const menuId = e.target.closest("li").dataset.menuId;

        //e.target.closest("li").querySelector(".menu-name")을 하나의 변수로 만들어서 사용함(코드 가독성)
        const $menuName = e.target.closest("li").querySelector(".menu-name");

        //가까운 li태그를 찾아가야 메뉴이름 받아올 수 있으니 closest 사용해서 태그찾고
        //menu-name 클래스의 들어간 텍스트값을 받는다
        // const menuName = $menuName.innerText; -> upDatedMenuName 부분에 넣어준다

        //prompt("표시할 내용",디폴트값);
        //prompt를 통해서 받은 값은 수정된 값, 디폴트값은 수정받은 텍스트를 담는 변수이기도 함 
        const upDatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);

        //클릭한 메뉴 아이템 어떤 원소인지 아는 방법은 유일한 ID값 추가
        //데이터 생성하는 부분에서 data-menu-id=""${index}로 해주는데
        //menuItem이 아니라 배열의 값을 index로 함(유일한 값으로 안되기 때문에 새로 생성한 것)
        //this.menu[menuId].name = upDatedMenuName;
        this.menu[this.currentCategory][menuId].name = upDatedMenuName;

        //메뉴가 업데이트 되게 하기위함 (최대한 데이터 변경을 최소화 해주는것이 좋음)
        store.setLocalStorage(this.menu);

        //받아온 li태그의 menu-name 클래스가 들어간 곳의 innerText를 입력한 값을 넣어서 수정해줌
        //$menuName.innerText = upDatedMenuName; -> render() 함수를 이용해서 리펙터링
        render();
    };

    //메뉴삭제 함수, 삭제하는 함수를 이용할 때 매개변수(parameter)를 넘겨줘야 잘 작동함
    const removeMenuName = (e) => {
        if (confirm("정말 삭제하시겠습니까?")) {
            //삭제할 것을 알기위한 menuId 가져오기
            const menuId = e.target.closest("li").dataset.menuId;
            //splice는 배열의 특정 원소를 삭제 괄호는(삭제 할 배열, 몇개를 삭제할지)
            this.menu[this.currentCategory].splice(menuId, 1);
            //localStorage업데이트
            store.setLocalStorage(this.menu);

            //찾은 태그의 가장 가까운것을 찾아주기 때문에 잘 작동됨(클릭한 곳에서 가장 가까운 li태그)
            //remove는 ()로 마무리 해줘야 작동 됨
            // e.target.closest("li").remove(); -> render() 함수를 이용해서 리펙터링
            render();

            //생성때 해준 count부분을 함수로 만들어서 사용
            // UpdateMenuCount(e);
        }
    };

    //메뉴품절 함수, 
    const soldOutMenu = (e) => {
        const menuId = e.target.closest("li").dataset.menuId;
        //클릭할 때 현재 카테고리의 menuId의 값이 soldOut가 true가 됨
        //추가로 불 연산자(논리연산자)를 사용해서 다시 클릭해서 품절상태를 없애기 위해 적용
        //처음 값인 undefined의 값에서 !를 사용해서 true의 값이 나오고 또 클릭시 반대되는 false가 나온다
        this.menu[this.currentCategory][menuId].soldOut =
            //!는 논리적부정을 의미함 - 값을 반대로 바꿔줌 treu -> false
            !this.menu[this.currentCategory][menuId].soldOut;
        store.setLocalStorage(this.menu);
        //render 해서 soldout이면 soldout 클래스를 넣고 아니면 안넣는 것 render함수에서 구현 (span부분)
        render();
    }


    //이 함수안에 이벤트를 추가하면 되기 떄문에 분리해서 사용하기에 유용하다
    const initEventListeners = () => {
        //form태그 자동전송 막기 (preventDefault();)
        $("#menu-form").addEventListener("submit", (e) => {
            e.preventDefault();
        }); //자동전송 제어

        //버튼 클릭시 메뉴추가됨 (함수안에 빈 값이면 실행 안되게 해둔 것 있음)
        $("#menu-submit-button").addEventListener("click", addMenuName); //추가
        //괄호에 넣지 않아도 되기 때문에 이렇게 줄여줌

        //이벤트 위임(상위 태그에게 이벤트 위임 해두는 것) - 없는 태그를 위해서
        //addMenuName 부분에 보면 버튼을 추가해뒀고 그 버튼의 class명이 다르다
        $("#menu-list").addEventListener("click", (e) => {
            //classList를 통해서 클래스들 가져올 수 있다, contains를 통해 해당 클래스 있는지 확인가능
            //if문 여러개의 경우 하나의 조건이 만족하면 다른 것 확인 안해도 되니 return을 해주는것이 좋음(습관화 하기)
            if (e.target.classList.contains("menu-edit-button")) {
                //호출때도 인자값을 e로 잘 받아와야 함 , 수정 로직
                updateMenuName(e);
                return;
            }; //수정

            if (e.target.classList.contains("menu-remove-button")) {
                //전달받은 인자가 있어야 잘 작동함 , 삭제 로직
                removeMenuName(e);
                return;
            }; //삭제

            if (e.target.classList.contains("menu-sold-out-button")) {
                //soldout 로직
                soldOutMenu(e);
                return;
            }; //품절
        });

        //메뉴의 이름을 입력받음
        $("#menu-name")
            .addEventListener("keypress", (e) => {
                console.log(e.key);
                if (e.key !== "Enter") {
                    return;
                }
                //입력받은 값이 엔터가 아니면 return 되고 엔터가 맞다면 메뉴추가 함수가 실행된다
                addMenuName();
            });

        //다른 메뉴판으로 갈 때 이벤트
        $("nav").addEventListener("click", (e) => {
            //클래스 cafe-category-name인거 있는지 찾는 함수
            const isCategoryButton = e.target.classList.contains("cafe-category-name")

            //true , false로 값을 받아오기 때문에 함수이름으로 넣어줌
            if (isCategoryButton) {
                //카테고리 이름 불러와서 categoryName에 넣어줌
                const categoryName = e.target.dataset.categoryName;
                this.currentCategory = categoryName;

                //html에 category-title라는 id값을 <h2> 부분인 타이틀에 추가해준 뒤 불러와서 넣어주기
                $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;

                render();
            }
        });
    }

}

//App 실행, app.init을 실행
const app = new App();
app.init();



/* 세팅
Docker
ESLint
린트는 소스 코드에 문제가 있는지 탐색하는 작업을 의미
이 작업을 돕는 소프트웨어가 린터

Live Server
로컬 개발 서버를 띄워 코드 수정 및 저장하면
리소스의 변경을 실시간으로 반영해줌

Live Share
공동작업을 도와주는 Extension 참가자 모두 설치하고 로그인 필요

Prettier - Code formatter
코드가 정해진 스타일 따르도록 변환해주는 도구
(인기있는 자바스크립트 라이브러리)

Marp for VS Code

Lint는 강제성 없고 Prettier은 강제성이 있다
Lint와 Prettier을 설정하는건 VsCode에서 셋팅에 들어간 뒤
우측상단에 파일모양을 눌러보면 JSON을 설정할 수 있게 해준다
{
    // Set the default
    "editor.formatOnSave": false,
    // Enable per-language
    "[javascript]": {
        "editor.formatOnSave": true
    },
    "editor.codeActionsOnSave": {
        // For ESLint
        "source.fixAll.eslint": true
    }
}
이렇게 설정해주면 된다
(프로젝트 별로 설정이 다른 경우가 많아서 경로를 다르게 설정해주는 것)
https://blog.makerjun.com/24443069-e1b0-416c-9e64-a27392487a5a

{
    // Set the default
    "editor.formatOnSave": false,
    // Enable per-language
    "[javascript]": {
        "editor.formatOnSave": true
    },
    "editor.codeActionsOnSave": {
        // For ESLint
        "source.fixAll.eslint": true
    },
    "workbench.iconTheme": "material-icon-theme",
    "git.ignoreMissingGitWarning": true,
    "workbench.colorTheme": "Viow Neon"
    }
원래 있던것에서 오류가 생겨서 수정한 값 - 기존값을 갖고있는 중괄호
부분의 내용을 아래로 내리니 오류가 사라짐 (root 때문으로 보임)

*/