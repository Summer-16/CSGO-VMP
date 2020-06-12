/* VMP-by-Summer-Soldier
*
* Copyright (C) 2020 SUMMER SOLDIER
*
* This file is part of VMP-by-Summer-Soldier
*
* VMP-by-Summer-Soldier is free software: you can redistribute it and/or modify it
* under the terms of the GNU General Public License as published by the Free
* Software Foundation, either version 3 of the License, or (at your option)
* any later version.
*
* VMP-by-Summer-Soldier is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License along with
* VMP-by-Summer-Soldier. If not, see http://www.gnu.org/licenses/.
*/

//-----------------------------------------------------------------------------------------------------
// Global variables
var record_per_page = $('#recordsPerPage').val(), current_page = 1, max_pages = 1, old_page = 0

//-----------------------------------------------------------------------------------------------------
// 

function getSalesReordListing(currentPage, recordPerPage) {


  let loader = `<div class="loading">Loading&#8230;</div>`;
  $("#divForLoader").html(loader)

  fetch('/fetchsalesrecord', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      currentPage: currentPage,
      recordPerPage: recordPerPage
    })
  })
    .then((res) => { return res.json(); })
    .then((response) => {
      $("#divForLoader").html("")

      let dataArray = response.data.res.salesRecord
      max_pages = response.data.res.totalRecords > record_per_page ? Math.ceil(response.data.res.totalRecords / record_per_page) : 1;
      createPagination(max_pages, currentPage);
      $(`#page_${old_page}`).removeClass("active")
      $(`#page_${current_page}`).addClass("active")

      let htmlString = ""
      for (let i = 0; i < dataArray.length; i++) {
        htmlString += `<tr>
                        <td>${dataArray[i].order_id ? dataArray[i].order_id : 'NA'}</td>
                        <td>${dataArray[i].payer_id ? dataArray[i].payer_id : 'NA'}</td>
                        <td>${dataArray[i].payer_steamid ? dataArray[i].payer_steamid : 'NA'}</td>
                        <td>${dataArray[i].payer_name ? dataArray[i].payer_name + " " + dataArray[i].payer_surname : 'NA'}</td>
                        <td>${dataArray[i].payer_email ? dataArray[i].payer_email : 'NA'}</td>
                        <td>${dataArray[i].product_desc ? dataArray[i].product_desc : 'NA'}</td>
                        <td>${dataArray[i].amount_paid ? dataArray[i].amount_paid + dataArray[i].amount_currency : 'NA'}</td>
                        <td>${dataArray[i].status ? dataArray[i].status : 'NA'}</td>
                        <td>${dataArray[i].sale_type == 1 ? "New Buy" : dataArray[i].sale_type == 2 ? "Renew" : 'NA'}</td>
                        <td>${dataArray[i].created_on ? dateFormatter(dataArray[i].created_on) : 'NA'}</td>
                        </tr>`
      }
      document.getElementById("salesRecordBody").innerHTML = htmlString
    })
    .catch(error => {
      $("#divForLoader").html("")
      showNotif({ success: false, data: { "error": error } })
    });
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// pagination
function prevPage() {
  if (current_page > 1) {
    current_page--;
    setActivePage(current_page);
  }
}

function nextPage() {
  if (current_page < max_pages) {
    current_page++;
    setActivePage(current_page);
  }
}

function setActivePage(page) {
  // Validate page
  if (page / 1 < 1) {
    page = 1;
  }
  if (page / 1 > max_pages) {
    page = max_pages;
  }

  old_page = current_page
  current_page = page

  getSalesReordListing(page, record_per_page)
}

function recordPerPageChanged() {
  record_per_page = $('#recordsPerPage').val()
  getSalesReordListing(current_page, record_per_page)
}

function createPagination(maxPages, currentPage) {

  $("#paginationUL").empty();

  const prevButton = `<li class="page-item">
                      <a class="page-link" href="javascript:void(0)" onclick="prevPage()" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Previous</span>
                      </a>
                    </li>`
  const nextButton = `<li class="page-item">
                      <a class="page-link" href="javascript:void(0)" onclick="nextPage()" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>
                      </a>
                    </li>`

  $("#paginationUL").append(prevButton);
  for (let index = Math.max(1, currentPage - 2); index <= Math.min(currentPage + 2, maxPages); index++) {
    const pageLi = `<li class="page-item" id="page_${index}"><a class="page-link" href="javascript:void(0)" onclick="setActivePage(${index})">${index}</a></li>`
    $("#paginationUL").append(pageLi);
  }
  $("#paginationUL").append(nextButton);

}

function dateFormatter(date) {
  let d = new Date(date);
  let dd = d.getDate();
  let mm = d.getMonth() + 1;
  let yyyy = d.getFullYear();
  return dd + '-' + mm + '-' + yyyy;
}

$(document).ready(function () {

  setActivePage(1);

  $(window).keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});