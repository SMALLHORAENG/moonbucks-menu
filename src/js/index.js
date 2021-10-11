// step 1 요구사항 구현을 위한 전략
// 조건에 따라 필요한 것 생각해보기
/* 요구사항 분석
    TODO 메뉴 추가
        메뉴이름 받고 엔터키 입력으로 추가됨
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
    });

    //메뉴의 이름을 입력받음
    $("#espresso-menu-name")
    .addEventListener("keypress", (e) => {
        console.log(e.key);
    if(e.key === "Enter"){
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
    }
    });
};
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
