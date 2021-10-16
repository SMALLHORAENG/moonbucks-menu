const store = {
    setLocalStorage(menu){
        //문자열로 저장은 stringify
        localStorage.setItem("menu",JSON.stringify(menu));
    },
    getLocalStorage(){
        //리턴을 해줘야 init에서 값을 받을 수 있음
        //문자열로 저장된 데이터를 JSON 객체로 다시 해주는 것은 parse
        return JSON.parse(localStorage.getItem("menu"));
    },
};

//default 는 해당 모듈에 객체가 하나뿐임을 나타냄, import할 때 중괄호 없이 불러오기 가능
export default store;