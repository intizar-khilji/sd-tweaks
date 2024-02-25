function maskValues(element) {
    // Function to generate a random string of a specified length
    function generateRandomText(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // Function to generate a random number of a specified length
    function generateRandomNumber(length) {
        var result = '';
        for (var i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10); // Random digit between 0 and 9
        }
        return result;
    }

    // Get all span elements within the provided element
    var spans = element.querySelectorAll('span');

    // Iterate through each span element
    spans.forEach(function(span) {
        var originalValue = span.textContent.trim();
        var replacementValue;

        // Determine if the original value is a number
        if (!isNaN(originalValue)) {
            // If the original value is a number, generate a random number of the same length
            replacementValue = generateRandomNumber(originalValue.length);
        } else {
            // If the original value is not a number, generate random text of the same length
            replacementValue = generateRandomText(originalValue.length);
        }

        // Update the text content of the span
        span.textContent = replacementValue;
    });
}


const replaceSelectToSpan = function () {
    let selects = document.querySelectorAll('select');
    selects.forEach(function (select) {
        let newSpan = document.createElement('span');
        let selectedOption = select.options[select.selectedIndex];
        newSpan.textContent = selectedOption.innerText;
        select.parentNode.replaceChild(newSpan, select);
    });
}

const replaceInputToSpan = function () {
    const inputElements = document.querySelectorAll('input[type="text"]');
    inputElements.forEach(input => {
        const spanElement = document.createElement('span');
        spanElement.textContent = input.value;
        input.parentNode.replaceChild(spanElement, input);
    });
}


const selectFirstOption = function () {
    const selectElements = document.querySelectorAll('select');
    selectElements.forEach(select => {
        select.querySelectorAll('option').forEach(option => {
            if (option.value === "0") {
                option.selected = true;
            } else {
                option.selected = false;
            }
        });
    });
}

const enterValuesInAllInput = function () {
    const numberToFill = prompt("Enter value :");
    const textboxes = document.querySelectorAll('input[type="text"]');
    textboxes.forEach(textbox => {
        textbox.value = numberToFill;
    });
}

const enterValuesInGivenInput = function () {
    let columnIndex = prompt('Enter column number : ');
    let numberToEnter = prompt('Enter value :');
    let inputsInColumn = document.querySelectorAll('#dvReport tbody tr td:nth-child(' + (Number(columnIndex) + 1) + ') input[type="text"]');
    inputsInColumn.forEach(function (input) {
        input.value = numberToEnter;
    });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("Message :", message)
    console.log("Sender :", sender)
    if (message.type === "replaceSelectToSpan") {
        replaceSelectToSpan()
    }
    else if (message.type === "replaceInputToSpan") {
        replaceInputToSpan()
    }
    else if (message.type === "selectFirstOption") {
        selectFirstOption()
    }
    else if (message.type === "enterValuesInAllInput") {
        enterValuesInAllInput()
    }
    else if (message.type === "enterValuesInGivenInput" && message.url.includes("RMSA_SChoolMonthly_NP_tablets")) {
        enterValuesInGivenInput()
    }
    else if (message.type === "maskValues") {
        let headerDiv = document.querySelector(".details-box")
        let dvReport = document.querySelector("#dvReport")
        maskValues(headerDiv)
        maskValues(dvReport)
    }
})