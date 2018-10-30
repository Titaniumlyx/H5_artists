function $(id) {
    return typeof id == "string"?document.getElementById(id):id;
}

window.onload = function(){
    let tabClick = $("tabClick").getElementsByTagName("li")
    let contents = $("content").getElementsByTagName("div")

    if(tabClick.length != contents.length){
        return ;
    }

    for(let i = 0; i < tabClick.length; i++){
        tabClick[i].key = i
        tabClick[i].onclick = function(){
            for(let j = 0; j< tabClick.length; j++){
                tabClick[j].className = ''
                contents[j].style.display = 'none'
            }
            this.className = 'active'
            contents[this.key].style.display = 'block'
        }
    }
}