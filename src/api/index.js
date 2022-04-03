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
    //addMenu에 있는 await fetch를 MenuApi에 넣음
    //name은 다른명으로 해도 되지만 순서가 중요하고 잊지 않도록 약속이 중요
    async createMenu(category, name) {
        const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
            //현재 주소까지 해줘야 잘 작동함 (/api/category/:category/menu)
            method: "POST", //객체 생성시 주로 POST 사용 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) {
            console.error("에러가 발생했습니다.");
        }
    },
    async updateMenu(category, name, menuId) {
        const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
            method: "PUT",
            //생성은 POST , 수정은 PUT
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) {
            console.error("에러가 발생했습니다.");
        }
        return response.json();
    },
    //토글, 품절 처리하기(온 오프로 생각하면 됨 토글은)
    async toggleSoldOutMenu(category, menuId) {
        const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`,
            {
                method: "PUT",
            }
        );
        console.log(response);
        if (!response.ok) {
            console.error("에러가 발생했습니다.");
        }
    },
    async deleteMenu(category, menuId) {
        const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            console.error("에러가 발생했습니다.");
        }
    }
};

export default MenuApi;