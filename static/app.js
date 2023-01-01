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

//takes raw text, splits it into an array of paragraphs, and filters away empty arrays
function createParagraphArray(input) {
    let textArrayRaw = input.split("\n");
    let textArrayFiltered = textArrayRaw.filter((str => str !== ""));
    return textArrayFiltered;
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
    $("#input-methods").addClass("d-none");
    createWorksheetText($("#text-input").val());
    $worksheetContainer.append($("<div>", {
        class: "row",
        id: "question-section"
    }))
    $("#question-section").append($("<h2>", {
        class: "row d-flex justify-content-center",
        id: "question-section",
        text: "Questions"
    }))

    createButtonRow();
})



//click that allows the user access to the raw text method of worksheet genoratoring 
$("#raw-text-select").on("click", function () {
    $("#raw-text-method").removeClass("d-none")
})

//click that allows the user access to the url method of worksheet genoratoring 
$("#url-api-select").on("click", function () {
    $("#url-api-method").removeClass("d-none")
})

//click that generates the text for the worksheet and the buttons to create questions/answers using the url method
$("#url-submit-btn").on("click", async function (e) {
    e.preventDefault();
    const url = $("#url-submit-form").val();
    const text = await getTextFromURL(url);
    createWorksheetText(text);
    createButtonRow()
})

//click used on the paragraph rows to allow the user to delete a paragraph
$worksheetContainer.on("click", ".close-btn", function (evt) {
    $(evt.target).parent().remove();
})

$worksheetContainer.on("click", ".close-question-btn", function (evt) {
    $(evt.target).parent().remove();
    questionNumber--;
})



/*button to create short response question. clicking it creates an input field for a question and a confirm button. When you click confirm it adds a row, and then appends to that row a 1 column div with the number of the question, the question text that takes up 10 columns and an x icon one that can remove it if you want. The first two are content editable
**/

let questionNumber = 1
$worksheetContainer.on("click", "#short-response-btn", function (e) {
    e.preventDefault();
    $(".questions-print-btns").addClass("d-none")
    console.log("clicked");
    appendTextRow($worksheetContainer, "row question-row");
    appendOneColumn($(".question-row").last(), questionNumber);
    addResponseQuestionForm();


})

//adds an event listener to the button created when the form to add a question is created. The event listener adds that questionto the worksheet.
$worksheetContainer.on("click", "#response-question-add-btn", function (e) {
    e.preventDefault();
    console.log("addresponsequestionbtnon has been activated")
    addResponseQuestion(questionNumber);
    $(".question-row").remove()
    $(".questions-print-btns").removeClass("d-none");
    questionNumber++;
})
// }

/* 
Takes the text from the question input field and attaches it to the dom with rows commensurate to the sentence response or paragraph response radio selection
**/
function addResponseQuestion(questionNumber) {
    console.log("addresponsequestion has been activated")
    appendTextRow($("#question-section"), "row text-row");
    appendOneColumn($(".text-row").last(), questionNumber);
    appendTenColumns($(".text-row").last(), $(".response-question-input").val());
    appendIcon($(".text-row").last(), "col-1 bi bi-x btn close-question-btn");
    appendOneColumn($(".text-row").last());
    $(".text-row").last().append($("<textarea>", {
        class: "form-control col-10",
        type: "text",
        rows: 5
    }))

    appendEmptyLine($(".text-row").last());
}


function addResponseQuestionForm() {
    $(".question-row").last().append(`
    <form class="response-question-text col-10 row" >
        <textarea class="form-control response-question-input" type="text" placeholder="Enter question here"
         ></textarea>
        <div class="row">
         <div class="col-sm-10">
            <div class="form-check">
            <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="option1" checked>
             <label class="form-check-label" for="gridRadios1">
            Sentence Answer
             </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="option2">
          <label class="form-check-label" for="gridRadios2">
            Paragraph Answer
          </label>
        </div>
        <button id="response-question-add-btn" type="button">Add question</button>
        <button id="response-question-undo-btn" type="button">I don't want this question</button>
        </div>    
    </form>`)
}

