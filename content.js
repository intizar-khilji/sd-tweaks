function getTables() {
    return document.querySelectorAll('.table')
}

function closePopup() {
    let popup = document.getElementById("popup");
    let overlay = document.getElementById("overlay");
    popup.parentNode.removeChild(popup);
    overlay.parentNode.removeChild(overlay);
}


function openTablePopup(callback) {
    let tables = getTables()
    let tableOptionsHtml = '';
    tables.forEach(function (table, index) {
        tableOptionsHtml += `<option value="${index}">Table ${index + 1}</option>`;
    });

    var popupHtml = `
        <div class="overlay" id="overlay"></div>
        <div class="popup" id="popup">
            <select id="options">${tableOptionsHtml}</select>
            <br><br>
            <button id='ok'>Okey</button>
            <button id='close'>Cancel</button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHtml);
    document.getElementById('popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';

    document.getElementById('ok').onclick = function() {
        const tables = getTables()
        const tableIndex = document.getElementById('options').value
        callback(tables[tableIndex])
    }

    document.getElementById('close').onclick = function() {
        closePopup()
    }
}


const downloadTableInCsv = function (table, fileName) {
    let content = ''
    table.querySelectorAll('tr').forEach(function (tr) {
        let rowData = []
        tr.querySelectorAll('td, th').forEach(function (td) {
            const td_input = td.querySelector('input[type="text"]')
            let td_text = ''
            if (td_input) {
                td_text = td_input.value.trim()
            }
            else {
                td_text = td.innerText.trim()
            }
            if (rowData) {
                rowData.push(td_text)
            }
        })
        content += rowData.join(',') + '\r\n'
    })

    if (!fileName.endsWith('.csv')) {
        fileName += '.csv'
    }

    let blob = new Blob([content], { type: "text/csv;charset=utf-8;" });

    let link = document.createElement("a");
    if (link.download !== undefined) {
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        console.log("Your browser does not support automatic download.");
    }
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

const createFileName = function () {
    let fileName = ''
    document.querySelectorAll('select').forEach(function (op) {
        const selectedOption = op.selectedOptions[0]
        if (selectedOption) {
            fileName += selectedOption.innerText + '_'
        }
    })
    fileName = fileName + '.csv'
    return fileName
}

const downloadTableTemp = function(table) {
    const fileName = createFileName()
    downloadTableInCsv(table, fileName)
}

const downloadTable = function() {
    const fileName = createFileName()
    const tables = getTables()
    if(tables.length > 1) {
        openTablePopup(function(table) {
            downloadTableInCsv(table, fileName)
        })
    }
    else if(tables.length == 1) {
        downloadTableInCsv(tables[0], fileName)
    }
    else {
        console.log("There is no table.")
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
        const table = getTables()[0]

        const table_rows = table.querySelectorAll('tr')

        const table_col_names = {}
        table_rows[0].querySelectorAll('th').forEach(function (th, index) {
            table_col_names[th.innerText.trim()] = index
        })

        const csv_rows = content.split('\r\n')

        const csv_col_names = {}
        csv_rows[0].split(',').forEach(function (th, index) {
            csv_col_names[th.trim()] = index
        })

        const cols = Object.keys(table_col_names)

        for (let i = 1; i < table_rows.length; i++) {
            const table_cols = table_rows[i].querySelectorAll('td')

            const csv_cols = csv_rows[i].split(',')

            for (let i = 0; i < cols.length; i++) {
                const input = table_cols[table_col_names[cols[i]]].querySelector('input')
                if (input) {
                    input.value = csv_cols[csv_col_names[cols[i]]]
                }
            }
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

    else if (message.type === "downloadTable") {
        downloadTable()
    }

    else if (message.type === "uploadFile") {
        uploadFile()
    }
})