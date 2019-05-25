var base64Img = null;
var PDF = {};

PDF['header-footer'] = function() {
    var doc = new jsPDF();
    var totalPagesExp = "{total_pages_count_string}";

    var pageContent = function(data) {
        // HEADER
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        if (base64Img) {
            doc.addImage(base64Img, 'JPEG', data.settings.margin.left + 150, doc.internal.pageSize.height - 15);
        }
        doc.text("Hisobot", data.settings.margin.left + 65, 22);

        // FOOTER
        var str = "Page " + data.pageCount;
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
            str = str + " of " + totalPagesExp;
        }
        doc.setFontSize(10);
        doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
    };
    doc.autoTable(getColumns(), getData(), {
        addPageContent: pageContent,
        margin: { top: 30 }
    });

    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    return doc;
};


var getColumns = function() {
    return [
        { title: "Nomi", dataKey: "no" },
        { title: "Tel", dataKey: "display_name" },
        { title: "Jami masofa (km)", dataKey: "distance" },
        { title: "Boshlang'ich harkat vaqti", dataKey: "mindate" },
        { title: "So'ngi harakat vaqti", dataKey: "maxdate" }
    ];
};

// Uses the faker.js library to get random data.
function getData() {
    //var sentence = "Minima quis totam nobis nihil et molestiae architecto accusantium qui necessitatibus sit ducimus cupiditate qui ullam et aspernatur esse et dolores ut voluptatem odit quasi ea sit ad sint voluptatem est dignissimos voluptatem vel adipisci facere consequuntur et reprehenderit cum unde debitis ab cumque sint quo ut officiis rerum aut quia quia expedita ut consectetur animiqui voluptas suscipit Monsequatur";
    var data = [];
    var winData = window.dbData;
    for (var j = 1; j <= winData.length; j++) {
        data.push({
            no: j,
            display_name: winData[j - 1].display_name,
            distance: winData[j - 1].distance,
            mindate: winData[j - 1].mindate,
            maxdate: winData[j - 1].maxdate
        });
    }
    return data;
}

imgToBase64('images/image.png', function(base64) {
    base64Img = base64;
});

function imgToBase64(url, callback) {
    if (!window.FileReader) {
        callback(null);
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result.replace('text/xml', 'image/jpeg'));
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
}