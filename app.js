"use strict;"
//user inputs a url
//variable that references the input starts a scrape
//xpath of the webpage scraped and create raw text
//for loop that breaks the very long string into something with x characters with the i attached
//user sees the document reformatted with line numbers
//user has buttons to click question which creates a text box to insert text
//once user clicks to make question they can then do multiple choice with x answer choices or text box to write out answer in sentence form or paragraph form with or without lines
//at end they click "generate" and it makes a downloadable pdf

const $worksheetContainer = $("#worksheet-container");
let $rawText = $("#text-input").val();


let count = 1;

let textArray = $rawText.split("");

$("#text-input-btn").on("click", function (evt) {
    evt.preventDefault();
    let $rawText = $("#text-input").val();

    let lineCount = 1
    let paragraphArray = $rawText.split("\n\n");
    let paragraphArrayCount = 0;

    while (paragraphArrayCount < paragraphArray.length) {

        $worksheetContainer.append($("<div>", {
            class: "row text-row"
        }))
        $(".text-row").last().append($("<div>", {
            text: `${lineCount}`,
            class: "col-1",
            contenteditable: "true"
        }))
        $(".text-row").last().append($("<div>", {
            text: paragraphArray[paragraphArrayCount],
            class: "col-10",
            contenteditable: "true"
        }))
        $(".text-row").last().append($("<i>", {
            class: "col-1 bi bi-x btn close-btn",

        }))

        $(".text-row").last().append($("<div>", {
            html: "&nbsp",
            class: "col-12",
        }))

        lineCount++
        paragraphArrayCount++;
    }
    $worksheetContainer.append($("<div>", {
        class: "row questions-print-btns"
    }))

    $(".questions-print-btns").append($("<button>", {
        class: "col-3 btn btn-primary border",
        text: "Create multiple choice question"
    }))
    $(".questions-print-btns").append($("<button>", {
        class: "col-3 btn btn-primary border",
        text: "Create short response question"
    }))
    $(".questions-print-btns").append($("<button>", {
        class: "btn btn-info col-3 border",
        text: "Print Worksheet"
        // text: "Create short response question"
    }))

})

$("#raw-text-select").on("click", function () {
    $("#raw-text-method").removeClass("d-none")
})

$("#url-api-select").on("click", function () {
    $("#url-api-method").removeClass("d-none")
})

$worksheetContainer.on("click", ".close-btn", function (evt) {
    $(evt.target).parent().remove();
})





// $worksheetText.append($("<div>", {
//     text: `${count}`,
//     class: "col-1"
// }))
// $worksheetText.append($("<div>", {
//     text: $rawText,
//     class: "col-11"
// }))
// count++
// console.log($rawText)
// console.log(textArray)
// $("#categories").append($("<th>", {
//     text: `${category.title}`,
//     scope: "col",
//     class: "border col-md-2",
//   }));

// let lineCount = 1
// let textArray = $rawText.split("");
// let textArrayCount = 0;
// let textLine = `     `;

// //make a while loop where if textarraycount is less than test array length it keeps going. each time it goes through it has another while loop that goes as long as the length of textLine is < 65. when it exits that while loop it adds the number div and the textLine div. Then it incriments the line count and resets the textArrayCount and textLine stirng. 

// while (textArrayCount < textArray.length) {
//     while (textLine.length <= 75) {
//         textLine += textArray[textArrayCount];
//         textArrayCount++
//     }

//     $worksheetText.append($("<div>", {
//         text: `${lineCount}`,
//         class: "col-1"
//     }))
//     $worksheetText.append($("<div>", {
//         text: textLine,
//         class: "col-11"
//     }))

//     lineCount++;
//     textLine = ``;
// }

