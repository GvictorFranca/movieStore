const startingMinutes = 1;
let time = startingMinutes * 60

const countDownElement = document.getElementById('countdown');



x()
const timer = setInterval(updateCountdown, 1000)
timer()

function x () {
    let cupomCode = 'R3H562J'
    
    localStorage.setItem('cupom', JSON.stringify(cupomCode))
}


function updateCountdown() {

    console.log("entrou")
    const minutes = Math.floor(time/60);
    let seconds = time % 60

    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    if (minutes == 0 && seconds == 0){
        localStorage.removeItem('cupom')
        clearInterval(timer)
        countDownElement.innerHTML = `Cupom Expirado`;
    }
    countDownElement.innerHTML = `${minutes}: ${seconds}`;
    time --;

}


