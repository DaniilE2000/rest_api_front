// Initial DOM collecting.
const form = document.forms.main_form;
const boundStart = form.elements.boundStart;
const boundEnd = form.elements.boundEnd;
const output = document.getElementById("output");

// Message constants.
const STATUS_ERROR = "error";
const STATUS_SUCCESS = "success";

const setOutputContent = async (type, content) => {
    if (content === output.innerHTML) {
        return;
    }

    let textColor;
    switch(type) {
        case STATUS_ERROR:
            textColor = "red";
            break;
        case STATUS_SUCCESS:
            textColor = "black";
            break;
    }
    
    output.style.opacity = 0;
    output.ontransitionend = () => {
        output.style.color = textColor;
        output.style.opacity = 1;
        output.innerHTML = content;
        output.ontransitionend = null;
    }
};

const inspectBounds = (boundStart, boundEnd) => {
    if (isNaN(boundStart) || isNaN(boundEnd)) {
        setOutputContent(STATUS_ERROR, 'Пожалуйста, проверьте, что ограничивающие числа введены корректно!');
        return false;
    }

    if (boundStart > boundEnd) {
        setOutputContent(STATUS_ERROR, 'Пожалуйста, удостоверьтесь, что начальная граница не превосходит конечную!');
        return false;
    }

    return true;
};

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const boundStartValue = parseInt(boundStart.value),
          boundEndValue = parseInt(boundEnd.value);

    if (!inspectBounds(boundStartValue, boundEndValue)) {
        return;
    }

    const idRecord = await generateId(boundStart.value, boundEnd.value);

    if (idRecord.status) {
        const link = window.location.origin + '/get/' + idRecord.id;
        setOutputContent(STATUS_SUCCESS, `Число сгенерировано. Ваша ссылка <a href="${link}">${link}</a>`);
    } else {
        setOutputContent(STATUS_ERROR, 'Ошибка! Сервер вернул "' + idRecord.message + '"');
    }
});

async function generateId(boundStart, boundEnd) {
    let formData = new FormData();
    formData.append('boundStart', boundStart);
    formData.append('boundEnd', boundEnd);

    let fetched = await fetch('http://api.numbers.com/generate', {
        method: "POST",
        body: formData,
    });
    const responce = await fetched.json();
    return responce;
}