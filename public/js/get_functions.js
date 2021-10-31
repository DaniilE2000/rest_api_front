// Initial DOM collecting.
const mainElement = document.getElementById("app");
        
(async function getNumber() 
{
    const path = window.location.pathname.split('/');
    const id = path[path.length - 1];

    const fetched = await fetch('http://api.numbers.com/generate/' + id);

    const numberRecord = await fetched.json();
    if (numberRecord.status) {
        mainElement.innerHTML = "Ваше число: " + numberRecord.number + '.';
    } else {
        mainElement.innerHTML = "По такому id не зарегистрировано число.";
    }
})();