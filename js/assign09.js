/*************************************************************************
 * $
 * This lets me select any element by using a CSS query.
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
	var elements = $("form input[type*=text]:enabled");

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

	// Clears whatever value was in the Monthly Payment section.
	changeContent($("#payment")[0], "");
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
	nodeMess.style.right = (nodeMess.offsetWidth * -1) - 20 + "px";

	setTimeout( function()
	{
		nodeMess.style.right = "-" + (nodeMess.offsetWidth + 20) + "px";
	}, 10);
}

/*************************************************************************
 * IS EMPTY
 * If input element is empty it notifies user that field needs to be filled
 * out and returns true. If there is a value it returns false.
 *************************************************************************/
function isEmpty(element)
{
	if (element.value == "")
	{
		inputStatus(element, "error", "Error: cannot leave empty");
		element.focus();
		return true;
	}
	else
	{
		return false;
	}
}

/*************************************************************************
 * UPDATE
 * This checks the inputs and make sure they are not empty or contain any
 * errors before updating.
 *************************************************************************/
 function update()
 {
	// Input Values
	var aprV = $("#apr")[0].value;
	var termV = $("#loan-term")[0].value;
	var amountV = $("#loan-amount")[0].value;

	// Input Classes
	var aprCN = $("#apr")[0].className;
	var termCN = $("#loan-term")[0].className;
	var amountCN = $("#loan-amount")[0].className;	

	if(isEmpty($("#apr")[0])) return;
	if(isEmpty($("#loan-term")[0])) return;
	if(isEmpty($("#loan-amount")[0])) return;

	// Check if any fields contain any errors.
	if (!contains(aprCN, "error") && !contains(termCN, "error") && !contains(amountCN, "error"))
	{
		getPayment();
	}
	else
	{
		$("#payment")[0].value = "Fix Errors";
	}
}

/*************************************************************************
 * CHECK UPDATE
 * This will update monthly payment only if all input fields are filled.
 *************************************************************************/
function checkUpdate()
{
	// Collect input fields.
	var inputs = $("#apr, #loan-term, #loan-amount");

	// Make sure they all contain values.
	if (inputs[0].value != "" && inputs[1].value != "" && inputs[2].value != "")
	{
		update();
	}
}

/*************************************************************************
 * CHECK INPUT
 * This validates the input field, and will update the input status
 * accordingly.
 *************************************************************************/
 function checkInput(element)
 {
	// Make sure the value is a numeric value, and that it is not
	// empty.
	if (isNaN(element.value) == true)
	{
		inputStatus(element, "error", "Error: contains non-digit");
	}
	else if (element.value == "")
	{
		inputStatus(element, "error", "Error: cannot leave empty");
		element.focus();
	}
	else {
		inputStatus(element, "success", "Success");
	}

	// This will update the monthly payment if all fields are filled in
	// and don't contain any errors.
	checkUpdate();
}

/**
 * GET PAYMENT
 * This creates an AJAX request to get the calculated monthly payment.
 */
function getPayment()
{
	var xmlhttp = new XMLHttpRequest();

	// Link to C++ file
	var url = "http://157.201.194.254/cgi-bin/fit07003/assign09";

	// Use this to build our GET query.
	var query = "";

	// Get the values from the form.
	var apr = $("#apr")[0].value;
	var loanTerm = $("#loan-term")[0].value;
	var loanAmount = $("#loan-amount")[0].value;

	// Build Query.
	query += "?apr=" + apr + "&loan-term=" + loanTerm + "&loan-amount=" + loanAmount;

	xmlhttp.onreadystatechange = function()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{
			// If everything worked correctly update payment form.
			var monthlyPayment = xmlhttp.responseText;
			changeContent($("#payment")[0], "$" + monthlyPayment);
		}
		else {
			// Else print to the console there was an error.
			console.log("Failed!! URL: " + url + query);
		}
	}

	xmlhttp.open("GET", url+query, true);
	xmlhttp.send();
}

/*************************************************************************
 * MAIN
 * Run when page loads.
 *************************************************************************/
 function main()
 {
	// Set focus on APR when page loads.
	$("#apr")[0].focus();
}