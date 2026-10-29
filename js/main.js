const inputDataType = document.getElementById("input-data-type");
const inputDataValue = document.getElementById("input-data-value");

const outputTable = document.getElementById("output-table");

const darkMode = document.getElementById("dark-mode");

var isDarkMode = true;
document.documentElement.setAttribute("data-bs-theme", (isDarkMode ? "dark" : ""));
darkMode.checked = isDarkMode;

//data to be collected/recorded; includes default values
var collectedData = {
    "dew point": null,
    "temperature": null,
    "time": Temporal.Now.plainTimeISO().round("second").toString()
};

var selectedInputDataType = Object.keys(collectedData)[0];

function setTextStyle(element, style) {
    switch (style) {
        case "empty":
            element.setAttribute("class", "fst-italic " + (isDarkMode ? "text-dark bg-warning" : "table-warning"));
            // element.parentElement.setAttribute("class", "bg-danger table-danger")
            break;
        default:
            element.setAttribute("class", "text-body");
        // element.parentElement.setAttribute("class", "table-default")
    }
}

//populate input and output tables
const previewCellSuffix = "-preview-value";

for (const dataLabel in collectedData) {
    //populate data input fields
    var dataTypeOption = document.createElement("option");
    dataTypeOption.setAttribute("name", dataLabel);
    dataTypeOption.innerHTML = dataLabel;
    inputDataType.appendChild(dataTypeOption);

    //populate data preview table
    var dataRow = document.createElement("tr");
    //dataRow.setAttribute("id", dataLabel)
    outputTable.tBodies[0].appendChild(dataRow);

    var dataRowType = document.createElement("td");
    dataRowType.innerHTML = dataLabel;
    dataRow.appendChild(dataRowType);

    var dataRowValue = document.createElement("td");
    dataRowValue.setAttribute("id", dataLabel + previewCellSuffix);
    dataRow.appendChild(dataRowValue);
    if (collectedData[dataLabel] != null) {
        dataRowValue.innerHTML = collectedData[dataLabel];
        setTextStyle(dataRowValue);
    } else {
        dataRowValue.innerHTML = "none";
        setTextStyle(dataRowValue, "empty");
    }
}

function setPreviewTableValue(dataType, newValue) {
    var previewValueCell = document.getElementById(dataType + "-preview-value");



    if (newValue != "") {
        collectedData[dataType] = newValue;

        previewValueCell.innerHTML = newValue;
        setTextStyle(previewValueCell);
    } else {
        collectedData[dataType] = null;

        previewValueCell.innerHTML = "none";
        setTextStyle(previewValueCell, "empty");
    }
}

//input data TYPE changed
inputDataType.addEventListener("change", (event) => {
    selectedInputDataType = event.target.value;

    switch (selectedInputDataType) {
        case "time":
            inputDataValue.setAttribute("type", "time");
            inputDataValue.value = Temporal.Now.plainTimeISO().round("second").toString();
            break;
        default:
            inputDataValue.value = collectedData[selectedInputDataType];
            inputDataValue.setAttribute("placeholder", "input data");
            inputDataValue.removeAttribute("readonly");
            inputDataValue.setAttribute("type", "number");
    }
});

//input data VALUE changed
inputDataValue.addEventListener("input", (event) => {
    setPreviewTableValue(selectedInputDataType, event.target.value);

    //DEBUG: console.log(selectedInputDataType + ": " + event.target.value);
});

//darkmode toggle
darkMode.addEventListener("input", (event) => {
    isDarkMode = event.target.checked;

    if (event.target.checked) {
        document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-bs-theme", "");
    }

    //refresh color of empty cells (it's different based on dark/light mode)
    for (const dataValueCell of outputTable.querySelectorAll("td[id$='" + previewCellSuffix + "']")) {
        setTextStyle(dataValueCell, (dataValueCell.innerHTML == "none" ? "empty" : "default"));
    }
});