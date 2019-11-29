
const db = firebase.firestore();
const table = document.querySelector('table');



//need to do some weird stuff to get the year at the start of the date for sorting purposes
//Find a more elegant way of solving this 
const addCase = (casedata, id) => {
    date = casedata.date.substr(-4,) + '/' + casedata.date.substr(0,casedata.date.length-5)
    let html = `
    <tr>
        <td>${casedata.citation}</td>
        <td>${casedata.percentage}</td>
        <td>${casedata.location}</td>
        <td>${casedata.age}</td>
        <td>${casedata.sickleave}</td>
        <td>${date}</td>
        <td>${casedata.salary}</td>
        <td>${casedata.sentiment}</td>
    </tr>
    `
    table.innerHTML += html;
}

db.collection('casebank').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        addCase(doc.data(), doc.id);

    });
}).catch(err => {
    console.log(err);
});

function myFunction() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchbar");
    filter = input.value.toUpperCase();
    table = document.getElementById("resultstable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2];
        if (td) {
            txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }       
        }
    }

function filter(){
    filtersalary()
    filteryear()
}

function filtersalary(){
    let input, filter, table, tr, td, i, txtValue; 
    input = document.getElementById('salary');
    pattern = /\$?([0-9]{1,2},?[0-9]{1,3})/
    filter = Number(input.value)

    table = document.getElementById("resultstable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i< tr.length; i++ ){
        td = tr[i].getElementsByTagName('td')[6];
        td = td.textContent.replace('unk', '$0,000')
        console.log(td)
        td = td.match(pattern)[1]
        td = Number(td.replace(/\,/g, ''))
        if ((td >= filter && td <= filter+10000) || filter == 0) {
            tr[i].style.display = ""
        } else {
            tr[i].style.display = "none"
        }
    }
}

function filteryear(){
    let input, filter, table, tr, td, i, txtValue; 
    input = document.getElementById('year')
    
    pattern = /[0-9]{4}/
    filter = Number(input.value)
    table = document.getElementById("resultstable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i<tr.length; i++){
        td = tr[i].getElementsByTagName('td')[5];
        td = Number(td.textContent.match(pattern)[0])
        if(td == filter || filter == 0){
            tr[i].style.display = ""
        } else{
            tr[i].style.display = "none"
        }
    }

}

function highlight(){
    let table = document.getElementById('resultstable');
    let tr = table.getElementsByTagName('tr');
    for (i = 1; i < tr.length; i++){
        let td = tr[i].getElementsByTagName('td')[7].textContent;
        if (td.toLowerCase().includes("positive")){
            tr[i].classList.toggle('positive')
        } else if (td.toLowerCase().includes('negative')){
            tr[i].classList.toggle('negative')
        } 
    }
}

function calculator(){
    let calc = document.getElementById('calculator');
    let shield = document.getElementById('shield')
    if (calc.style.display == "none") {
        calc.style.display = ''
        shield.style.display = ''
    } else {
        calc.style.display = 'none'
        shield.style.display = 'none'
    }
}

function calculate(){
    let inputs = document.getElementsByClassName('calcinput')
    let salary = Number(inputs[0].value.replace(',', ''))
    let age = Number(inputs[1].value)
    if (age<40){
        age = 96
    } else if (age <56 ){
        age = 72
    } else {
        age = 48
    }
    let percentage = Number(inputs[2].value)
    let output = document.getElementById('awardamount');
    output.textContent = 'Projected Compensation: $' + String(salary * age * percentage/100).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function sort(n){
    let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById('resultstable');
    switching = true;
    dir = 'asc'
    while(switching){
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length-1); i ++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName('td')[n];
            y = rows[i+1].getElementsByTagName('td')[n];
            if (dir == "asc"){
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()){
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == 'desc'){
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()){
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch){
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;
        } else {
            if (switchcount ==0 && dir == 'asc'){
                dir = 'desc';
                switching = true; 
            }
        }
    }
}

