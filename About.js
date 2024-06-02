function openTab(event, tabName) {
    var i, tabcontent, tablinks;
    
    // Hide all tab contents
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    
    // Remove "active" class from all tab buttons
    tablinks = document.getElementsByClassName("cause-buttons")[0].getElementsByTagName("button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    // Show the current tab and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}

// Set the first tab as active by default
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".cause-buttons button")[0].click();
});

document.addEventListener("DOMContentLoaded", function() {
    var faqQuestions = document.querySelectorAll(".faq-question");
    
    faqQuestions.forEach(function(question) {
        question.addEventListener("click", function() {
            var answer = this.nextElementSibling;
            if (answer.style.display === "block") {
                answer.style.display = "none";
            } else {
                answer.style.display = "block";
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", function() {
    var faqQuestions = document.querySelectorAll(".faq-question");
    
    faqQuestions.forEach(function(question) {
        question.addEventListener("click", function() {
            var answer = this.nextElementSibling;
            this.classList.toggle("active");
            answer.classList.toggle("open");
        });
    });
});
