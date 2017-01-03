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

function setCairisUrl(defaultValue) {
  var serverIP = prompt("Set CAIRIS URL",defaultValue);
  localStorage.setItem('cairis_url',serverIP);
  return serverIP;
}

function setContributor(defaultValue) {
  var contributorName = prompt("Set contributor",defaultValue);
  localStorage.setItem('document_reference_contributor',contributorName);
  return contributorName;
}

function setAuthor(defaultValue) {
  var authorName = prompt("Set author",defaultValue);
  localStorage.setItem('external_document_author',authorName);
}

function addDocumentReference(external_document_name,hTxt) {
  var contributorName = localStorage.getItem('document_reference_contributor') || "Undefined";
  if (contributorName == 'Undefined') {
    contributorName = setContributor('Undefined');
  }

  var x = prompt( "Factoid", hTxt);
  var dr = {
    'theName': x.replace(/'/g, "\\'"),
    'theDocName': external_document_name.replace(/'/g, "\\'"),
    'theContributor': contributorName,
    'theExcerpt': hTxt
  };
  var output = {};
  output.object = dr;
  output.session_id = 'test';
  output = JSON.stringify(output);

  var serverIP = localStorage.getItem('cairis_url') || "Undefined";
  if (serverIP == 'Undefined') {
    serverIP = setCairisUrl('Undefined');
  }

  $.ajax({
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    accept: "application/json",
    crossDomain: true,
    processData: false,
    origin: serverIP,
    data: output,
    url: serverIP + "/api/document_references" + "?session_id=test",
    success: function (data) {
      alert('Factoid added');
    },
    error: function (xhr, textStatus, errorThrown) {
      var error = JSON.parse(xhr.responseText);
      alert(String(error.message));
    }
  });
}



chrome.browserAction.onClicked.addListener(function(tab) {

  var serverIP = localStorage.getItem('cairis_url') || "Undefined";
  if (serverIP == 'Undefined') {
    serverIP = setCairisUrl('Undefined');
  }

  $.ajax({
    type: "GET",
    dataType: "json",
    accept: "application/json",
    crossDomain: true,
    data: {session_id : 'test'},
    url: serverIP + "/api/external_documents/name/" + encodeURIComponent(tab.title.replace(/'/g, "\\'")) + "?session_id=test",
    success: function (data) {
      chrome.tabs.executeScript({
        code: "window.getSelection().toString();"
      }, function(selection) {
        addDocumentReference(tab.title,String(selection[0]));
      });
    },
    error: function (xhr, textStatus, errorThrown) {
      if (xhr.status == 404) {

        var authorName = localStorage.getItem('external_document_author') || "Undefined";
        if (authorName == 'Undefined') {
          setAuthor('Undefined');
        }

        var edoc= {
          'theName': tab.title.replace(/'/g, "\\'"),
          'theVersion': '1',
          'thePublicationDate': document.lastModified,
          'theAuthors': authorName,
          'theDescription': tab.url
        };
        var output= {};
        output.object=edoc;
        output.session_id='test';
        output=JSON.stringify(output);
        $.ajax( {
          type: "POST",
          dataType: "json",
          contentType: "application/json",
          accept: "application/json",
          crossDomain: true,
          processData: false,
          origin: serverIP,
          data: output,
          url: serverIP + "/api/external_documents" + "?session_id=test",
          success: function (data) {
            chrome.tabs.executeScript({
              code: "window.getSelection().toString();"
            }, function(selection) {
              addDocumentReference(tab.title,String(selection[0]));
            });
          },
          error: function (xhr, textStatus, errorThrown) {
            var error=JSON.parse(xhr.responseText);
            alert(String(error.message));
          }
        });
      }
    }
  });
});

chrome.contextMenus.create({
  "title": "Set CAIRIS URL",
  "contexts": ["browser_action"],
  "onclick" : function() {
    setCairisUrl(localStorage.getItem('cairis_url') || "Undefined");
  }
});

chrome.contextMenus.create({
  "title": "Set Author",
  "contexts": ["browser_action"],
  "onclick" : function() {
    setAuthor(localStorage.getItem('external_document_author') || "Undefined");
  }
});

chrome.contextMenus.create({
  "title": "Set Contributor",
  "contexts": ["browser_action"],
  "onclick" : function() {
    setContributor(localStorage.getItem('document_reference_contributor') || "Undefined");
  }
});
