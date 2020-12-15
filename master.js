window.onload=function(){
    nextreg = false;
    imps = IMPS_D.reverse()
    count = 0;
    n = "";
    tarvalue = "";
    page = 0;
    c_count = 0;
    let url = new URL(window.location)
    let par = url.searchParams;
    if (!par.has("page")) {
        par.set("page", "0")
    }
    if (! /^[0-9]+$/.test(par.get("page"))) {
        par.set("page", "0")
    }
    if (!par.has("reg")) {
        par.set("reg", 0)
    }
    par.set("reg",par.get("reg")==="1"?1:0)
    reg = par.get("reg") != 0;
    nextreg = !!reg
    document.getElementById("dropcheck").checked = (reg!=0)
    let p = false
    if (par.has("s")){
        if (par.get("s") != ""){
            p = true
        }
    }
    if (p) {
        par.set("page", Math.max(Number(par.get("page")), 1))
        tarvalue = par.get("s");
        document.getElementById("searchbox").value = tarvalue;
        let spage = Number(par.get("page"))
        window.history.pushState({}, '', url);
        searching()
        while (count < imps.length && spage > page) {
            nextv()
        }
        if (par.has("anchor")){
            let a = document.createElement("a")
            a.href = `#boxid_${par.get("anchor")}`
            a.click()
            if (document.getElementById(`boxid_${par.get("anchor")}`) != null){
                console.log("a")
                document.getElementById(`boxid_${par.get("anchor")}`).classList.add("linked")
            }
        }
    }else{
        par.set('s', '')
        window.history.pushState({}, '', url);
    }
}
function regcheck(e){
    nextreg = e.target.checked
}
document.getElementById("searchbox").addEventListener("keydown",function(e){
    if(e.keyCode==13){
        searching()
        e.preventDefault()
    }
})
function doing(good, conc, com, rep, imp_time, rep_time) {
    n += '<div class="imp_and_rep" id=';
    n += `"boxid_${c_count}">`
    n += "<span class=>[" + imp_time + "]→[" + rep_time + ']</span>'
    n += "<span class='scr' onclick='screenshot(event);'>📷</span>"
    n += "<span class='linkc' onclick='linkcopy(event);'>🔗</span>"
    n += `<img src="Twitter_Social_Icon_Circle_Color.png" onclick="twitterlink(event)" class="twbtn">`
    n += '\n<div class="imp">'
    n += good != "" ? "<h4>良い点</h4>\n" + good.replace(/\n/g, "<br>") : ""
    n += conc != "" ? "<h4>気になる点</h4>\n" + conc.replace(/\n/g, "<br>") : ""
    n += com != "" ? "<h4>一言</h4>\n" + com.replace(/\n/g, "<br>") : ""
    n += "</div><div class='rep'>"
    n += rep.replace(/\n/g, "<br>") + "</div>"
    n += "</div>"
    c_count++;
}
function searching(){
    reg = !!nextreg;
    page = 0;
    let n_count = 0;
    count = 0;
    c_count = 0;
    n = "";
    let tar = document.getElementById("results")
    tarvalue = document.getElementById("searchbox").value
    tar.innerHTML = ""
    while (n_count < 20 && count < imps.length) {
        var ii = imps[count]
        if (!reg){
            if (Object.values(ii).join("\n").includes(tarvalue)) {
                n_count++;
                let i = {}
                Object.keys(ii).forEach(iii => {
                    i[iii] = ii[iii].split(tarvalue).join(`<mark>${tarvalue}</mark>`)
                })
                doing(i.good,i.conc,i.com,i.rep,i.imp_time,i.rep_time)
            }
        }else{
            if (new RegExp(tarvalue,"i").test(Object.values(ii).join("\n"))) {
                n_count++;
                let i = {}
                Object.keys(ii).forEach(iii => {
                    i[iii] = ii[iii].replace(new RegExp("(" + tarvalue + ")", "gi"),"<mark>$1</mark>")
                })
                doing(i.good, i.conc,i.com, i.rep, i.imp_time, i.rep_time)
            }
        }
        count++;
    }
    tar.innerHTML += n
    if (n_count == 20) {
        tar.innerHTML += "<div id='next' onclick='nextv()'>続きを表示</div>"
    }
    if (n_count > 0) {
        page += 1
        let url = new URL(window.location);
        url.searchParams.set('page', page);
        url.searchParams.set('s', tarvalue)
        url.searchParams.set("reg",reg?1:0)
        window.history.pushState({}, '', url);
    }
}
function nextv(){
    let tar = document.getElementById("results")
    tar.innerHTML = ""
    let n_count = 0;
    while (n_count < 20 && count < imps.length) {
        var ii = imps[count]
        if (!reg){
            if (Object.values(ii).join("\n").includes(tarvalue)) {
                n_count++;
                let i = {}
                Object.keys(ii).forEach(iii => {
                    i[iii] = ii[iii].split(tarvalue).join(`<mark>${tarvalue}</mark>`)
                })
                doing(i.good,i.conc,i.com,i.rep,i.imp_time,i.rep_time)
            }
        }else{
            if (new RegExp(tarvalue,"i").test(Object.values(ii).join("\n"))) {
                n_count++;
                let i = {}
                Object.keys(ii).forEach(iii => {
                    i[iii] = ii[iii].replace(new RegExp("(" + tarvalue + ")", "gi"),"<mark>$1</mark>")
                })
                doing(i.good, i.conc,i.com, i.rep, i.imp_time, i.rep_time)
            }
        }
        
        count++;
    }
    tar.innerHTML += n
    if (n_count == 20) {
        tar.innerHTML += "<div id='next' onclick='nextv()'>続きを表示</div>"
    }
    if (n_count > 0) {
        page += 1
        let url = new URL(window.location);
        url.searchParams.set('page', page);
        url.searchParams.set('s', tarvalue)
        window.history.pushState({}, '', url);
    }
}
async function screenshot(e){
    let d = document.createElement("div")
    d.classList = "yohaku"
    d.appendChild(e.target.parentNode.cloneNode(true))
    d = document.body.appendChild(d)
    html2canvas(d, {
        scare: 10
    }).then((canvas)=>{
        d.outerHTML = ""
        canvas.toBlob(blob => {
            let item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]);
        });
    })
}
function linkcopy(e){
    let url = new URL(window.location)
    let par = url.searchParams;
    par.set("anchor",e.target.parentNode.id.replace("boxid_",""))
    navigator.clipboard.writeText(url.toString())
}
function twitterlink(e){
    let url = new URL(window.location)
    let par = url.searchParams;
    par.set("anchor", e.target.parentNode.id.replace("boxid_", ""))
    let text = "";
    text += "感想返し（"
    text += e.target.parentNode.firstChild.innerText
    text += "）\n\n"
    text += e.target.parentNode.getElementsByClassName("rep")[0].innerText.slice(0,40)
    text += "……\n"
    text += url.toString()
    let u = new URL('https://twitter.com/intent/tweet')
    u.searchParams.set("text", text)
    window.open(u.toString())
}
