// step 1 요구사항 구현을 위한 전략
// 조건에 따라 필요한 것 생각해보기
/* 요구사항 분석
    TODO 메뉴 추가
        메뉴이름 받고 엔터키 입력으로 추가됨 + 확인버튼을 클릭도 포함
        추가되는 메뉴의 마크업은 '<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>' 안에 삽입되야 함
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

*/


//html의 element를 가져올 때 $표시를 관용적으로 사용 함, id값을 받는 querySelector를 리턴해주는걸 의미함
// querySelector() 이 $가 되는 것
const $ = (selector) => document.querySelector(selector);

    //addEventListener 이벤트 추가 (괄호내용은 이벤트 실행 시 e에 값을 담아서 보내줌, e.key를 이용해서 받음)
    //if를 이용해서 엔터를 입력시 값을 받아오는것으로 만들어보자
    //.value를 통해서 지정된 것 값을 받아옴, form태그 때문에 엔터치면 새로고침 됨, 해결법은 위 코드에
function App(){

    //form태그 자동전송 막기 (preventDefault();)
    $("#espresso-menu-form").addEventListener("submit",(e) => {
        e.preventDefault();
    }); //자동전송 제어

    
    //생성 부분에서 가져온 것
    //메뉴 업데이트시 카운트 함수
    const UpdateMenuCount = () => {
        const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
        $(".menu-count").innerText = `총 ${menuCount} 개`;
    };

    //메뉴추가 함수
    const addMenuName = () => {
        //빈값이면 알림뜨고 엔터 안되게 하기
    if($("#espresso-menu-name").value === ""){
        alert("값을 입력해주세요.");
        //리턴 해주면 뒷 부분 동작이 안되기 때문에 입력해도 안나옴
        return;
    }
        //이전에 작성해둔 엔터누르면 실행되는 코드, 아무것도 없이 엔터하면 안되게 작성을 위해 위로 수정이동
        //if(e.key === "Enter"){
        //메뉴이름 받아서 저장하는 변수
        const espressoMenuName = $("#espresso-menu-name").value;
        // 요구사항에 있는 코드를 가져와서, 템플릿을 담을 변수를 만듦
        //espressMenuName 변수를 인자로 받아서 li태그에 넣을 수 있게 해줌
        const menuItemTemplate = (espressoMenuName) => {
            return `
        <li class="menu-list-item d-flex items-center py-2">

        <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
        
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
    };

// <!-- beforebegin -->
// <ul>
// <!-- afterbegin -->
// <li></li>
// <!-- beforeend -->
// </ul>
// <!-- afterend -->

//innerHTML 속성을 이용해 HTML에 넣을 수 있음, return된 템플릿을 넣어주면 됨
//.insertAdjacentHTML("위치",넣는변수(인자)); 해주면 innerHTML + 위치설정 가능하다
        $("#espresso-menu-list").insertAdjacentHTML(
            "beforeend",
            menuItemTemplate(espressoMenuName)
        );
        //메뉴 카운트 (li개수를 카운팅), 변수 명 클래스명을 활용해서 만드는게 이해하기 좋음
        //querySelector을 이요해서 li태그 가져올 수 있는데 가장 첫번째 것 가져옴
        //그래서 querySelectorAll 해주면 모든 태그를 가져올 수 있음 개수를 세는 방법은 .length 해주면 됨
        const menuCount =
        $("#espresso-menu-list").querySelectorAll("li").length;
        $(".menu-count").innerText = `총 ${menuCount} 개`;

        //input 비우기
        $("#espresso-menu-name").value = "";
    } 
    
    //메뉴수정 함수, 수정하는 함수를 이용할 때 매개변수(parameter)를 넘겨줘야 잘 작동함
    const updateMenuName = (e) => {
            //e.target.closest("li").querySelector(".menu-name")을 하나의 변수로 만들어서 사용함(코드 가독성)
            const $menuName = e.target.closest("li").querySelector(".menu-name");

            //가까운 li태그를 찾아가야 메뉴이름 받아올 수 있으니 closest 사용해서 태그찾고
            //menu-name 클래스의 들어간 텍스트값을 받는다
            // const menuName = $menuName.innerText; -> upDatedMenuName 부분에 넣어준다

            //prompt("표시할 내용",디폴트값);
            //prompt를 통해서 받은 값은 수정된 값, 디폴트값은 수정받은 텍스트를 담는 변수이기도 함 
            const upDatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);

            //받아온 li태그의 menu-name 클래스가 들어간 곳의 innerText를 입력한 값을 넣어서 수정해줌
            $menuName.innerText = upDatedMenuName;
    }

    //메뉴삭제 함수, 삭제하는 함수를 이용할 때 매개변수(parameter)를 넘겨줘야 잘 작동함
    const removeMenuName = (e) => {
                //찾은 태그의 가장 가까운것을 찾아주기 때문에 잘 작동됨(클릭한 곳에서 가장 가까운 li태그)
                //remove는 ()로 마무리 해줘야 작동 됨
                e.target.closest("li").remove();
                //생성때 해준 count부분을 함수로 만들어서 사용
                UpdateMenuCount();
    }



    //버튼 클릭시 메뉴추가됨 (함수안에 빈 값이면 실행 안되게 해둔 것 있음)
    $("#espresso-menu-submit-button").addEventListener("click", addMenuName); //추가
    //괄호에 넣지 않아도 되기 때문에 이렇게 줄여줌


    //이벤트 위임(상위 태그에게 이벤트 위임 해두는 것) - 없는 태그를 위해서
    //addMenuName 부분에 보면 버튼을 추가해뒀고 그 버튼의 class명이 다르다
    $("#espresso-menu-list").addEventListener("click", (e) => {
        //classList를 통해서 클래스들 가져올 수 있다, contains를 통해 해당 클래스 있는지 확인가능
        if(e.target.classList.contains("menu-edit-button")){
            //호출때도 인자값을 e로 잘 받아와야 함
            updateMenuName(e);
        }
    }); //수정


    $("#espresso-menu-list").addEventListener("click", (e) => {
        
        if(e.target.classList.contains("menu-remove-button")){

            if(confirm("정말 삭제하시겠습니까?")){
                //전달받은 인자가 있어야 잘 작동함
                removeMenuName(e);
            }
        }
    }); //삭제


    //메뉴의 이름을 입력받음
    $("#espresso-menu-name")
    .addEventListener("keypress", (e) => {
        console.log(e.key);
    if(e.key !== "Enter"){
        return;
    }
    //입력받은 값이 엔터가 아니면 return 되고 엔터가 맞다면 메뉴추가 함수가 실행된다
    addMenuName();
    });
}

App();




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
