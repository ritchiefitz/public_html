/*************************************************************************
 * $
 * This lets me select any element by using CSS selectors.
 *************************************************************************/
 function $(selector)
 {
 	return document.querySelectorAll(selector);
 }

/*************************************************************************
 * ADD CLASS
 * This adds a class to the passed in element.
 *************************************************************************/
 function addClass(element, newClass)
 {
 	element.className = element.className + " " + newClass;
 }

/*************************************************************************
 * REMOVE CLASS
 * This removes a class to the passed in element.
 *************************************************************************/
 function removeClass(element, deleteClass)
 {
 	var reg = new RegExp(" " + deleteClass,"g");
 	element.className = element.className.replace(reg, '');
 }

/*************************************************************************
 * CHANGE CONTENT
 * This changes the html content of the passed in element.
 *************************************************************************/
 function changeContent(element, message)
 {
 	element.innerHTML = message;
 }

/*************************************************************************
 * CONTAINS
 * This searches for a substring in string.
 *************************************************************************/
 function contains(str, substr)
 {
 	return str.indexOf(substr) > -1;
 }

/*************************************************************************
 * CLEAR CHECKS
 * This removes all success and error classes from form. It also removes
 * all messages letting the user start from the beginning.
 *************************************************************************/
 function clearChecks()
 {
	// This will select all enabled inputs.
	var elements = $("form input[type*=text]:enabled, form textarea");

	// Remove success or error from each element.
	for (i = 0; i < elements.length; i++)
	{
		if (contains(elements[i].className, "success"))
		{
			removeClass(elements[i], "success");
		}
		else if (contains(elements[i].className, "error"))
		{
			removeClass(elements[i], "error");
		}
	}

	// This selectes all message elements.
	var messages = $(".message");

	// This will remove the content in each message element.
	for (i = 0; i < messages.length; i++)
	{
		changeContent(messages[i], "");
	}
}

/*************************************************************************
 * INPUT STATUS
 * This allows us to notify the user if their input was successful or not.
 * Pass in the element to effect, type of message, and then the actual
 * message.
 *************************************************************************/
 function inputStatus(node, type, message)
 {
	// This gets the message element that matches the input node.
	var nodeMess = node.nextSibling.nextSibling;

	// Add error class or success class if it wasn't already set.
	// Change only if messages are different for error class.
	if (type == "error" && message != nodeMess.innerHTML)
	{
		// Remove success class if it exists.
		if (contains(node.className, "success"))
		{
			removeClass(node, "success-input");
			removeClass(nodeMess, "success");
		}

		addClass(node, "error-input");
		addClass(nodeMess, "error");
		changeContent(nodeMess, message);
	}
	else if (type == "success" && !contains(node.className, "success"))
	{
		// Remove error class if it exists.
		if (contains(node.className, "error"))
		{
			removeClass(node, "error-input");
			removeClass(nodeMess, "error");
		}

		addClass(node, "success-input");
		addClass(nodeMess, "success");
		changeContent(nodeMess, message);
	}

	// Position message element correctly.
	nodeMess.style.right = (nodeMess.offsetWidth * -1) - 5 + "px";

	setTimeout( function()
	{
		nodeMess.style.right = "-" + (nodeMess.offsetWidth + 5) + "px";
	}, 10);
}

function checkCard(element) {
	if (element.value == "")
	{
		inputStatus(element, "error", "Error: cannot leave empty");
		element.focus();
	}
	else if (!/\d{16}/.test(element.value)) {
		inputStatus(element, "error", "Error: must contain 16 digits");
	}
	else {
		inputStatus(element, "success", "Success");
	}
}

function checkPhone(element) {
	if (element.value == "")
	{
		inputStatus(element, "error", "Error: cannot leave empty");
		element.focus();
	}
	else if (!/\d{3}-\d{3}-\d{4}/.test(element.value)) {
		inputStatus(element, "error", "Error: format must be 123-456-7890");
	}
	else {
		inputStatus(element, "success", "Success");
	}
}

function checkTextarea(element) {
	if (element.value == "")
	{
		inputStatus(element, "error", "Error: cannot leave empty");
		element.focus();
	}
	else {
		inputStatus(element, "success", "Success");
	}
}

function checkForText(element) {
	if (element.value == "")
	{
		inputStatus(element, "error", "Error: cannot leave empty");
		element.focus();
	}
	else if (/\d/.test(element.value))
	{
		inputStatus(element, "error", "Error: contains digit");
	}
	else {
		inputStatus(element, "success", "Success");
	}
}

function checkboxSettings() {
	var sum = 0;
	
	var checkboxes = document.forms[0]["product"];

	for (var i = 0; i < checkboxes.length; i++) {
		
		checkboxes[i].addEventListener("change", function () {

			var curr_checkboxes = $("[name*=product]:checked");

			for (var i = 0; i < curr_checkboxes.length; i++) {
				sum += curr_checkboxes[i].value * 1;
			}

			changeContent($(".price")[0], "$" + sum);
			sum = 0;

		});
	}
}

function radioSettings() {
	var cardTypes = $("[name*=credit-type]");
	var message = $(".credit-provider .block-message")[0];

	for (var i = 0; i < cardTypes.length; i++) {
		cardTypes[i].addEventListener("change", function () {
			addClass(message, "success");
			changeContent(message, "Success");
		});
	}	
}

function autoFillSettings() {
	$("#first")[0].value = "Ritchie";
	$("#last")[0].value = "Fitzgerald";
	$("#address")[0].value = "455 W. 5th S.\nRexburg, ID\n83440";
	$("#phone")[0].value = "208-881-1252";
	$("[name*=credit-type]")[1].checked = true;
	$("#card-number")[0].value = "3452137896574532";
}

function validate() {

	var textInputs = $("[type*=text], textarea");

	for (var i = 0; i < textInputs.length; i++) {
		if (textInputs[i].value == "")
		{
			inputStatus(textInputs[i], "error", "Error: cannot leave empty");
			textInputs[i].focus();
			return false;
		}
	}

	if ($("[name*=credit-type]:checked").length < 1) {
		var firstType = $("[name*=credit-type]")[0];
		var message = $(".credit-provider .block-message")[0];

		addClass(message, "error");
		changeContent(message, "Error: must choose type");
		firstType.focus();

		return false;
	}

	return true;
}

/*************************************************************************
 * MAIN
 * Run when page loads.
 *************************************************************************/
 function main()
 {
	// Set focus on APR when page loads.
	document.getElementById("first").focus();
	checkboxSettings();
	radioSettings();
}