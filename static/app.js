"use strict;"

const $worksheetContainer = $("#worksheet-container");

//iterates through inputted paragraphs. Creates a row with a paragraph number, paragraph text, delete button, and extra empty line to the DOM
function createWorksheetText(inputText) {
    let paragraphCount = 1;
    let paragraphArrayCount = 0;
    let paragraphArray = createParagraphArray(inputText);

    while (paragraphArrayCount < paragraphArray.length) {
        appendTextRow($worksheetContainer, "row text-row");
        appendOneColumn($(".text-row").last(), paragraphCount);
        appendTenColumns($(".text-row").last(), paragraphArray[paragraphArrayCount])
        appendIcon($(".text-row").last(), "col-1 bi bi-x btn close-btn");
        appendEmptyLine($(".text-row").last());
        paragraphCount++
        paragraphArrayCount++;
    }
}

//creates a row under the worksheet text that allows the user to create questions and print the worksheet
function createButtonRow() {
    appendTextRow($worksheetContainer, "row questions-print-btns");

    const btnClasses = "col btn btn-primary border";
    const $postTextBtns = $(".questions-print-btns");
    appendBtn($postTextBtns, btnClasses, "Create multiple choice question", "mult-choice-btn");
    appendBtn($postTextBtns, btnClasses, "Create short response question", "short-response-btn");
    appendBtn($postTextBtns, btnClasses, "Print Worksheet", "print-btn");

}

//takes raw text and splits it into an array of paragraphs
function createParagraphArray(input) {
    return input.split("\n\n");
}

//appends a div with the row class
function appendTextRow(parent, className) {
    parent.append($("<div>", { class: className }))
}

//appends a div with one column and inputtable data
function appendOneColumn(parent, input) {
    parent.append($("<div>", {
        text: input,
        class: "col-1",
        contenteditable: "true"
    }))
}

//appends a div with ten columns and inputtable data
function appendTenColumns(parent, input) {
    parent.append($("<div>", {
        text: input,
        class: "col-10",
        contenteditable: "true"
    }))
}

//appends an icon 
function appendIcon(parent, className) {
    parent.append($("<i>", {
        class: className,
    }))
}

//appends a button
function appendBtn(parent, className, text, idName) {
    parent.append($("<button>", {
        class: className,
        id: idName,
        text: text
    }))
}

//appends an empty row line break
function appendEmptyLine(parent) {
    parent.append($("<div>", {
        html: "&nbsp",
        class: "col-12",
    }))
}

//click that generates the text for the worksheet and the buttons to create questions/answers and to print
$("#text-input-btn").on("click", function (e) {
    e.preventDefault();
    createWorksheetText($("#text-input").val());
    createButtonRow()
})

//click that allows the user access to the raw text method of worksheet genoratoring 
$("#raw-text-select").on("click", function () {
    $("#raw-text-method").removeClass("d-none")
})

//click that allows the user access to the url method of worksheet genoratoring 
$("#url-api-select").on("click", function () {
    $("#url-api-method").removeClass("d-none")
})

//click used on the paragraph rows to allow the user to delete a paragraph
$worksheetContainer.on("click", ".close-btn", function (evt) {
    $(evt.target).parent().remove();
})



//button to create short response question. clicking it creates an input field for a question and a confirm button. When you click confirm it adds a row, and then appends to that row a 1 column div with the number of the question, the question text that takes up 10 columns and an x icon one that can remove it if you want. The first two are content editable

$("#short-response-btn").on("click", createShortResponseQuestion)

function createShortResponseQuestion(e) {
    e.preventDefault();

}

