/*  Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
    Author: Shamal Faily */

$(window).resize(function(e){
  e.preventDefault();
  window.resizeTo(275,155);
});

$(document).on('click','#submit',function(e){
  e.preventDefault();
  var credentials = btoa($('#email').val() + ':' + $('#password').val());
  var output = {};
  var serverIP = localStorage.getItem('cairis_url');

  $.ajax({
    type: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    accept: "application/json",
    crossDomain: true,
    processData: false,
    origin: serverIP,
    data: output,
    cache: false,
    url: serverIP + "/api/session",
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization','Basic ' + credentials);
    },
    success: function (data) {
      chrome.runtime.getBackgroundPage(function(bgWindow) {
        localStorage.setItem('session_id',data.session_id);
        bgWindow.toggleMenus(true);
        window.close();
      });
    },
    error: function (xhr, textStatus, errorThrown) {
      if (xhr.status == 401) {
        alert("Incorrect credentials");
      }
      else {
        var error = JSON.parse(xhr.responseText);
        alert(String(error.message));
        window.close();
      }
    }
  }); 
});
