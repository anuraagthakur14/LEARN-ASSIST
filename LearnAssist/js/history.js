$(document).ready(function () {
    var username = localStorage.getItem("username");
    console.log(username);
    axios.post('http://localhost:5500/api/history', {
        user: username
    })
        .then(function (response) {
            var result = response.data.split("||").filter(function (el) { return el.length != 0 });
            for (var i in result) {
                result[i] = result[i].split("&&");
            }
            var doc = document.getElementById("result");
            doc.innerHTML = "<thead><tr>" +
                "<th scope=" + "col" + ">#</th>" +
                "<th scope=" + "col" + ">Extracted Text</th>" +
                "<th scope=" + "col" + ">Timestamp</th>" +
                "</tr></thead><tbody>";
            for (var i = 0; i < result.length; i++) {
                doc.innerHTML += "<tr>" +
                    "<td>" + i + "</td>" +
                    "<td>" + result[i][0] + "</td>" +
                    "<td>" + result[i][1] + "</td>" +
                    "</tr>";
            }
            doc.innerHTML += "</tbody>";
        })
        .catch(function (error) {
            console.log(error);
        });
});