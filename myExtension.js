function makeHttpObject() {
    try { return new XMLHttpRequest(); } catch (error) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (error) {}
    try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (error) {}

    throw new Error("Could not create HTTP request object.");
}
var content = []

function get_content(code_link) {
    var request = makeHttpObject();
    request.open("GET", code_link, true);
    request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            console.log(code_link)
            var doc = new DOMParser().parseFromString(request.responseText, "text/html");
            content.push(doc.querySelectorAll("table")[0].innerText);
        }
    };
};


divs = document.getElementsByClassName("f4 text-normal")

hrefs = []
for (var i = 0; i < divs.length; i++) {
    hrefs.push(divs[i].getElementsByTagName('a')[0].getAttribute("href"));
}

hrefs.forEach(element => get_content(element));

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function percentagely_similar(str1, str2) {
    var longer = str1;
    var shorter = str2;
    if (str1.length < str2.length) {
        longer = str2;
        shorter = str1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
var result = [];

function compare_each_element_on_array(array) {
    for (i = 0; i < array.length; i++) {
        for (j = i + 1; j < array.length; j++) {
            if (i != j && !(array[i].length > array[j].length + 75 || array[i].length < array[j].length - 75)) {
                if (percentagely_similar(array[i], array[j]) > 0.90) {
                    result.push(i, j, "same");
                    console.log("comparing")
                }
            }
        }
    }
}

compare_each_element_on_array(content.map(function(el) { return el.replace(/\s/g, '') }))

function delete_same_elements_from_dom(array) {
    for (i = 0; i < array.length; i++) {
        if (i % 2 == 0) {
            console.log(i)
            var element = document.getElementsByClassName("f4 text-normal")[array[i]];
            if (element != null && element.parentNode != null) {
                element.parentNode.remove();
            }
        }
    }
}

delete_same_elements_from_dom(result)