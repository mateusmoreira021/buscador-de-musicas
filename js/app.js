const form = document.getElementById("form");
const busca = document.getElementById("busca");
const result = document.getElementById("resultado");
const mais = document.getElementById("more");

const apiURL = 'https://api.lyrics.ovh';

async function searchSong(term){
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();

    showSong(data);
}

function showSong(data){
    result.innerHTML = `
        <ul class="som">
            ${data.data
                .map(
                    song => 

                    `<li>
                        <span><strong>${song.artist.name}</strong> - ${song.title}</span>
                        <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Ver a letra</button>
                    </li>`
                    )

                .join('')}
        
        
        </ul>
    `;

    if(data.prev || data.next){
        mais.innerHTML = `
            ${
                data.prev
                ? `<button class="btn" onclick=getMoreSong('${data.prev}')>Voltar</button>`
                : ''
            }

            ${
                data.next
                ? `<button class="btn" onclick=getMoreSong('${data.next}')>Proximo</button>`
                : ''
            }
        `;
    }else{
        mais.innerHTML = '';
    }
}

async function getMoreSong(url){
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();

    showSong(data);
}

async function getLetra(artist, songTitle){
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    if(data.error){
        result.innerHTML = data.error;
    }else{
        const letra = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

        result.innerHTML = `

            <h2><strong>${artist}</strong> - ${songTitle}</h2>
            <span>${letra}</span>
        
        `;
    }

    mais.innerHTML = '';
}

form.addEventListener("submit", (e) =>{
    e.preventDefault();

    const buscaTermo = busca.value.trim();

    if(!buscaTermo){
        alert("Coloque um som");
    }else{
        searchSong(buscaTermo);
    }
});


result.addEventListener("click", (e) =>{
    const clicado = e.target;


    if(clicado.tagName === 'BUTTON'){
        const artist = clicado.getAttribute('data-artist');
        const songtitle = clicado.getAttribute('data-songtitle');

        getLetra(artist, songtitle);
    }
})