
const db = firebase.firestore();
const table = document.querySelector('#resultstable tbody');

const tooltip = document.querySelector('#tooltip');
const sentiment = document.querySelector('#sentiment');

const results = document.querySelector('#results');
const dashboard = document.querySelector('#dashboard');

const body = document.querySelector('body');

let fetchstatus = false;

sentiment.addEventListener('mouseover', e => {
    rect = sentiment.getBoundingClientRect()
    tooltip.style.left = rect.right + 10;
    tooltip.style.top = rect.top;
    tooltip.style.display = '';
})

sentiment.addEventListener('mouseout', e => {
    tooltip.style.display = 'none';
})

function paginate(){
    paginator({
        table: document.getElementById('resultstable'), 
        box: document.getElementById('pageSelector'),
        rows_per_page: 10
    });
}


body.style.background = gradient_generator();


//need to do some weird stuff to get the year at the start of the date for sorting purposes
//Find a more elegant way of solving this 
const addCase = (casedata, id) => {
    let case_string = casedata.casename.replace(' ', '+');
    let case_link = `https://www.hklii.hk/cgi-bin/sinosrch.cgi?query=${case_string}&results=50&submit=Search&mask_world=&mask_path=&callback=on&method=auto&meta=%2Fhklii`
    date = casedata.date.substr(-4,) + '/' + casedata.date.substr(0,casedata.date.length-5)
    let html = `
    <tr>
        <td><a href = ${case_link}>${casedata.citation}</a></td>
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

//Gets the data base, and adds each document one row at a time
//Maybe connect this to the page load somehow, rather than just floating in the middle of nowhere

function fetchCases(){
    if (fetchstatus === false){
        fetchstatus = true;
        results.style.display = "";
        dashboard.style.display = "";
        db.collection('casebank').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                addCase(doc.data(), doc.id);
            });
        paginate();
            
        }).catch(err => {
            console.log(err);
        });
    };
}

function myFunction() {
    fetchCases();
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
    filtersalary();
    filteryear();
}

function filtersalary(){
    fetchCases();
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
    fetchCases()
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

function gradient_generator(){
    //Random background gradient colour generator
    function gen_color(){
        let r = Math.min(Math.round(Math.random()*255), 200);
        let g = Math.min(Math.round(Math.random()*255), 200);
        let b = Math.min(Math.round(Math.random()*255), 200);
        return `rgba(${r},${g},${b},1)`
    }

    function gen_angle(){
        return String(Math.round(Math.random()*360));
    }

    return `linear-gradient(${gen_angle()}deg, ${gen_color()} 0%, ${gen_color()} 70%, ${gen_color()} 100%)`;
}


function calculator(){
    let calc = document.getElementById('calculator');
    let shield = document.getElementById('shield');
    let explainer = document.querySelector('#calcexplainer');
    if (calc.style.display == "none") {
        calc.style.display = ''
        shield.style.display = ''
    } else {
        calc.style.display = 'none'
        shield.style.display = 'none'
    }

    explainer.style.background = gradient_generator();
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
    let percentage = Number(inputs[5].value)
    let output = document.getElementById('awardamount');
    let medfees = Math.min(Number(inputs[4].value), 300);
    let sickleave = Number(inputs[2].value);
    let temp_salary = Number(inputs[3].value.replace(',', ''));

    let incapacity_compensation = salary * age * percentage/100;
    let medical_compensation = medfees * sickleave;
    let periodical_compensation = 0.8*(salary - temp_salary) * (sickleave/30);
    let total = Math.round(incapacity_compensation + medical_compensation + periodical_compensation);
    console.log(incapacity_compensation, medical_compensation, periodical_compensation)
    output.innerHTML = '<span>Predicted Compensation:</span> $' + String(total).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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

