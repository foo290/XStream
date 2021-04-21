const print = console.log;
const ambientColors = ['rgb(181, 250, 32)', 'rgb(250, 155, 32)', 'rgb(32, 217, 250)']
const root = document.querySelector(':root')

function makePlayList(theUrl)
{
    print('function called start')
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    let list = xmlHttp.response;

    if (list){

        let pl = JSON.parse(list);
        console.log(pl['list'])
        pl['list'].forEach(items => {
            let node = document.createElement('li')
            // let img = document.create
            let thumb = document.createElement('img');
            let txtHolder = document.createElement('div');
            let title = document.createElement('p')
            let desc = document.createElement('p')

            node.classList.add('playlist-items')

            txtHolder.classList.add('text-holder')
            title.classList.add('title')
            desc.classList.add('description')
            thumb.classList.add('thumbnail')

            thumb.src = items[0];

            txtHolder.appendChild(title)
            txtHolder.appendChild(desc)
            
            title.innerText = items[1];
            desc.innerText = 'A great Song!'

            node.appendChild(thumb)
            node.appendChild(txtHolder)

            document.getElementById('vid-list').appendChild(node)
        });
    }
    print('function called')
}

// var ambientInterval = window.setInterval(()=>{
//     ambientColors.forEach(color =>{
//         $("body").css('background-color', color)
//     })
// }, 1000)

makePlayList('/playlist');
