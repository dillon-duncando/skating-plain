console.log("loaded file");
var data;
    $.ajax({
      type: "GET",
      url: "2022 Vancouver Island Interclub.csv",
      dataType: "text",       
      success: function(response)  
      {
        data = $.csv.toArrays(response);
        //add events to select input
        var clubs = [];
        var events = [];
        clubSelect = document.getElementById('Club');
        eventSelect = document.getElementById('Event');
        for(let iter = 1; iter < data.length; iter++){
            if(!clubs.includes(data[iter][3])){
                clubs.push(data[iter][3]);
            }
            if(!events.includes(data[iter][4])){
                events.push(data[iter][4]);
            }
        }
        clubs = clubs.sort();
        console.log(clubs);
        for(let iter = 0; iter < clubs.length; iter++){
            var opt = document.createElement('option');
            opt.value = clubs[iter];
            opt.innerHTML = clubs[iter];
            clubSelect.appendChild(opt);
        }
        events = events.sort();
        for(let iter = 0; iter < events.length; iter++){
            var opt = document.createElement('option');
            opt.value = events[iter];
            opt.innerHTML = events[iter];
            eventSelect.appendChild(opt);
        }
      }
    });

function search() {
    var competition = document.getElementById("Competition").value;
    if(competition == "2022 Vancouver Island Interclub"){
        var res = data;
        clubSelect = document.getElementById("Club").value;
        if(clubSelect != "All"){
            res = res.filter(function(row){
                return row[3] == clubSelect;
            });
        }
        eventSelect = document.getElementById("Event").value;
        if(eventSelect != "All"){
            res = res.filter(function(row){
                return row[4] == eventSelect;
            });
        }
        name = document.getElementById("Name").value;
        if(name.length > 0){
            res = res.filter(function(row){
                word = row[2] + row[1];
                return word.toLowerCase().includes(name.toLowerCase());
            })
        }
        groupSelect = document.getElementById("Group").value;
        if(groupSelect != "All" & groupSelect != "Select an Event"){
            res = res.filter(function(row){
                return row[0] == groupSelect;
            })
        }
        startDate = document.getElementById("Start").value.split(" ")[3];
        endDate = document.getElementById("End").value.split(" ")[3];
        res = res.filter(function(row){
            let split = row[14].split(" ");
            return split[3] >= startDate & split[3] <= endDate;
        })
        colList = ["group", "Last.Name", "First.Name", "Skater's.Home.Club",
            "Events", "Start", "End", "No.", "Date"]
        var table = '<table id = "result_table" class = "display"><thead><tr role = "row">';
        //add header
        for(let iter = 0; iter < data[0].length; iter++){
            if(colList.includes(data[0][iter])){
                table += `<td>${data[0][iter]}</td>`;
            }
        }
        table += "</tr></thead><tbody>";
        //add body
        if(res.length > 0){
            for(let iter1 = 1; iter1 < res.length; iter1++){
                table += "<tr>";
                for(let iter2 = 0; iter2 < data[0].length; iter2++){
                    if(colList.includes(data[0][iter2])){
                        table += `<td>${res[iter1][iter2]}</td>`;
                    }
                }
                table += "</tr>"
            }
        }
        var pdftitle = "2022 Vancouver Island Interclub 1035 Shawnigan Lake-Mill Bay Rd, Mill Bay, BC V0R 2P2"
        table += "</tbody></table>";
        document.getElementById("resultUI").innerHTML = table;
        $('#result_table').DataTable({
            searching: false,
            dom: 'Brltip',
            buttons: [
                {
                    extend: 'print', 
                    title: function(){
                        return pdftitle;
                    }
                },
                {
                    extend: 'pdf',
                    title: function(){
                        return pdftitle;
                    }
                },
                "csv"
            ]
        });
    } else {
        document.getElementById("resultUI").innerHTML = '<h4 style = "text-align: center;">' +
        'Information about this Competition is not available, please check again later </h4>';
    }
}

$(document).ready( function() {
    document.getElementById('Event').addEventListener("change", function() {
        var groupSelect = document.getElementById("Group");
        let options = groupSelect.getElementsByTagName('option');
        var value = this.value;
        for (var i = options.length; i--;) {
            groupSelect.removeChild(options[i]);
        }
        if (value == "All") {
            var opt = document.createElement('option');
            opt.value = "Select an Event";
            opt.innerHTML = "Select an Event";
            groupSelect.appendChild(opt);
        } else {
            var filter = data.filter(function(row){
                return row[4] == value;
            });
            var opt = document.createElement('option');
            opt.value = "All";
            opt.innerHTML = "All";
            groupSelect.appendChild(opt);
            var groups = [];
            for(let iter = 1; iter < filter.length; iter++){
                if(!groups.includes(filter[iter][0])){
                    groups.push(filter[iter][0]);
                }
            }
            groups = groups.sort();
            for(let iter = 0; iter < groups.length; iter++){
                var opt = document.createElement('option');
                opt.value = groups[iter];
                opt.innerHTML = groups[iter];
                groupSelect.appendChild(opt);
            }
        }
    });
})
