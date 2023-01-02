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
    appendBtn($postTextBtns, btnClasses, "Save worksheet", "save-worksheet");
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
    $("#raw-text-method").addClass("d-none");
    $("#url-api-method").addClass("d-none");
    $(".title").text($(".worksheet-title").val())
    $('.title').attr('contenteditable', 'true')
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
    $("#input-methods").addClass("d-none");
    $("#raw-text-method").addClass("d-none");
    $("#url-api-method").addClass("d-none");
    $(".title").text($(".worksheet-title").val())
    $('.title').attr('contenteditable', 'true')
    let url = $("#url-submit-form").val();
    const text = await getTextFromURL(url);
    createWorksheetText(text.data);
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


$worksheetContainer.on("click", "#mult-choice-btn", function (e) {
    e.preventDefault();
    $(".questions-print-btns").addClass("d-none")
    console.log("mult-choice-btn clicked");
    appendTextRow($worksheetContainer, "row question-row");
    appendOneColumn($(".question-row").last(), questionNumber);
    addMultipleChoiceQuestionForm();
})


$worksheetContainer.on("click", "#short-response-btn", function (e) {
    e.preventDefault();
    $(".questions-print-btns").addClass("d-none")
    console.log("clicked");
    appendTextRow($worksheetContainer, "row question-row");
    appendOneColumn($(".question-row").last(), questionNumber);
    addResponseQuestionForm();
})

//adds an event listener to the button created when the form to add a question is created. The event listener adds that multiple choice question to the worksheet.
$worksheetContainer.on("click", "#multiple-choice-question-add-btn", function (e) {
    e.preventDefault();
    console.log("addmultiplechoicequestionbtnon has been activated")
    addMultipleChoiceQuestion(questionNumber);
    $(".question-row").remove()
    $(".questions-print-btns").removeClass("d-none");
    questionNumber++;
})

//adds an event listener to the button created when the form to add a question is created. The event listener adds the long response question to the worksheet.
$worksheetContainer.on("click", "#response-question-add-btn", function (e) {
    e.preventDefault();
    console.log("addresponsequestionbtnon has been activated")
    addResponseQuestion(questionNumber);
    $(".question-row").remove()
    $(".questions-print-btns").removeClass("d-none");
    questionNumber++;
})

//adds an event listener to the button created when the form to add a question is created. The event listener removes the action of adding a new question to the worksheet.
$worksheetContainer.on("click", "#question-undo-btn", function (e) {
    e.preventDefault();
    console.log("undo btn has been activated")
    $(".question-row").remove()
    $(".questions-print-btns").removeClass("d-none");
})

/* 
Takes the text from the question input field and attaches it to the dom with the four answer choices
**/
function addMultipleChoiceQuestion(questionNumber) {
    console.log("addresponsequestion has been activated")
    appendTextRow($("#question-section"), "row text-row");
    appendOneColumn($(".text-row").last(), `Q. ${questionNumber}`);
    appendTenColumns($(".text-row").last(), $(".multiple-choice-question-input").val());
    appendIcon($(".text-row").last(), "col-1 bi bi-x btn close-question-btn");
    appendOneColumn($(".text-row").last(), "a.");
    appendTenColumns($(".text-row").last(), $(".multiple-choice-answer-a").val());
    appendOneColumn($(".text-row").last())
    appendOneColumn($(".text-row").last(), "b.");
    appendTenColumns($(".text-row").last(), $(".multiple-choice-answer-b").val());
    appendOneColumn($(".text-row").last())
    appendOneColumn($(".text-row").last(), "c.");
    appendTenColumns($(".text-row").last(), $(".multiple-choice-answer-c").val());
    appendOneColumn($(".text-row").last())
    appendOneColumn($(".text-row").last(), "d.");
    appendTenColumns($(".text-row").last(), $(".multiple-choice-answer-d").val());
    appendOneColumn($(".text-row").last())
    appendEmptyLine($(".text-row").last());
}

/* 
Takes the text from the question input field and attaches it to the dom with rows commensurate to the sentence response or paragraph response radio selection
**/
function addResponseQuestion(questionNumber) {
    console.log("addresponsequestion has been activated")
    appendTextRow($("#question-section"), "row text-row");
    appendOneColumn($(".text-row").last(), `Q. ${questionNumber}`);
    appendTenColumns($(".text-row").last(), $(".response-question-input").val());
    appendIcon($(".text-row").last(), "col-1 bi bi-x btn close-question-btn");
    appendOneColumn($(".text-row").last());
    let answerSize = undefined;
    $("#gridRadios1").is(":checked") ? answerSize = 50 : answerSize = 200;
    $(".text-row").last().append($("<div>", {
        class: "border border-dark col-10",
        type: "text",
        style: `height: ${answerSize}`,
    }))

    appendEmptyLine($(".text-row").last());
}


function addResponseQuestionForm() {
    $(".question-row").last().append(`
<form class="response-question-text col-10 row">
    <textarea class="form-control response-question-input" type="text" placeholder="Enter question here"></textarea>
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
            <button id="question-undo-btn" type="button">I don't want this question</button>
        </div>
</form> 
    `)
}

function addMultipleChoiceQuestionForm() {
    $(".question-row").last().append(`
<form class="multiple-choice-question-text row col-10">

    <textarea class="form-control multiple-choice-question-input " type="text"
        placeholder="Enter question here"></textarea>
    <textarea class="form-control multiple-choice-answer-a" type="text"
        placeholder="Enter first answer option here"></textarea>
    <textarea class="form-control multiple-choice-answer-b" type="text"
        placeholder="Enter second answer option here"></textarea>
    <textarea class="form-control multiple-choice-answer-c" type="text"
        placeholder="Enter third answer option here"></textarea>
    <textarea class="form-control multiple-choice-answer-d" type="text"
        placeholder="Enter fourth answer option here"></textarea>

    <div class="row">
        <div class="col-sm-10">
            <button id="multiple-choice-question-add-btn" type="button">Add question</button>
            <button id="question-undo-btn" type="button">I don't want this question</button>
        </div>
    </div>

</form>
    `)
}


$worksheetContainer.on("click", "#print-btn", function (e) {
    e.preventDefault();
    $(".navbar").addClass("d-none");
    $(".close-btn").addClass("d-none");
    $(".questions-print-btns").addClass("d-none");
    window.print();
    $(".navbar").removeClass("d-none");
    $(".close-btn").removeClass("d-none");
    $(".questions-print-btns").removeClass("d-none");
})

$worksheetContainer.on("click", "#save-worksheet", async function (e) {
    e.preventDefault();
    const worksheetTitle = $("#title").val();
    const worksheetText = $("final-worksheet-container").html()
    const numberOfQuestions = questionNumber;
    const gradeLevel = $("#grade-level").val();
    await addWorksheet(worksheetTitle, worksheetText, numberOfQuestions, gradeLevel)
})