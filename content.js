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
    spans.forEach(function (span) {
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

const downloadTable = function () {
    const table = document.querySelector('table')

    let content = ''
    table.querySelectorAll('tr').forEach(function (tr) {
        let rowData = []
        tr.querySelectorAll('td, th').forEach(function (td) {
            const td_input = td.querySelector('input[type="text"]')
            if (td_input) {
                rowData.push(td_input.value)
            }
            else {
                rowData.push(td.innerText)
            }
        })
        content += rowData.join(', ') + '\r\n'
    })

    let fileName = ''
    document.querySelectorAll('select').forEach(function (select) {
        fileName += select.selectedOptions[0].innerText
    })
    fileName = fileName + '.csv'

    // Create a Blob with the CSV content
    let blob = new Blob([content], { type: "text/csv;charset=utf-8;" });

    // Create a link element
    let link = document.createElement("a");
    if (link.download !== undefined) {
        // Create a link to the file
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);

        // Append the link to the body
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up
        document.body.removeChild(link);
    } else {
        console.log("Your browser does not support automatic download.");
    }

}


const uploadFile = function () {
    if (document.getElementById('file_upload')) {
        console.log('Upload option already added')
        return
    }

    let content = ''


    const fileElement = document.createElement('input')
    fileElement.type = 'file'
    fileElement.id = 'file_upload'
    document.body.appendChild(fileElement)


    fileElement.addEventListener('change', function (e) {
        const reader = new FileReader()
        reader.addEventListener('load', function (e) {
            content = e.target.result
        })
        reader.readAsText(fileElement.files[0])
    })


    const populateButton = document.createElement('button')
    populateButton.id = 'populate'
    populateButton.textContent = 'Populate'
    populateButton.addEventListener('click', function (e) {
        populateData(content)
    })
    document.body.appendChild(populateButton)
}

const populateData = function (content) {
    if (content) {
        console.log(content)
        const table = document.querySelector('table')
        
        const table_rows = table.querySelectorAll('tr')

        const csv_rows = content.split('\r\n')
        
        for(let i=1;i<table_rows.length;i++){
            const table_cols = table_rows[i].querySelectorAll('td')

            const csv_cols = csv_rows[i].split(',')
            console.log(csv_cols)
            table_cols[3].querySelector('input').value = csv_cols[3]
        }
    }
    else {
        console.log('File is empty')
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

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

    else if (message.type === "downloadTable") {
        downloadTable()
    }

    else if (message.type === "uploadFile") {
        uploadFile()
    }
})